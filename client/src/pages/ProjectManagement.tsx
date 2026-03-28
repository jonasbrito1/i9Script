import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import KanbanColumn from '../components/Kanban/KanbanColumn';
import KanbanCard from '../components/Kanban/KanbanCard';
import CardDetailsModal from '../components/Kanban/CardDetailsModal';
import '../styles/ProjectManagement.css';

interface Column {
  id: number;
  name: string;
  position: number;
  color: string;
  wip_limit?: number;
}

interface Card {
  id: number;
  board_id: number;
  column_id: number;
  title: string;
  description?: string;
  assigned_to?: number;
  assigned_to_name?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  position: number;
  tags?: string;
  due_date?: string;
  estimated_hours?: number;
  time_spent?: number;
  checklist?: string;
  created_by_name?: string;
}

interface Board {
  id: number;
  project_id: number;
  name: string;
  description?: string;
  columns: Column[];
  cards: Card[];
}

interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
}

const ProjectManagement: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [selectedColumnForNewCard, setSelectedColumnForNewCard] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'timeline'>('board');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadProjectAndBoard();
  }, [id]);

  const loadProjectAndBoard = async () => {
    try {
      setLoading(true);

      // Load project
      const projectRes = await axios.get(`http://localhost:5000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProject(projectRes.data);

      // Load or create board
      const boardsRes = await axios.get(
        `http://localhost:5000/api/kanban/boards?project_id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (boardsRes.data.length > 0) {
        // Load existing board
        const boardId = boardsRes.data[0].id;
        const boardDetailRes = await axios.get(
          `http://localhost:5000/api/kanban/boards/${boardId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBoard(boardDetailRes.data);
      } else {
        // Create default board
        const createBoardRes = await axios.post(
          'http://localhost:5000/api/kanban/boards',
          {
            project_id: id,
            name: `${projectRes.data.title} - Board`,
            description: 'Quadro Kanban do projeto',
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Load the newly created board
        const boardDetailRes = await axios.get(
          `http://localhost:5000/api/kanban/boards/${createBoardRes.data.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setBoard(boardDetailRes.data);
      }
    } catch (error) {
      console.error('Erro ao carregar projeto/board:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = board?.cards.find((c) => c.id === active.id);
    setActiveCard(card || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    setBoard((prevBoard) => {
      if (!prevBoard) return prevBoard;

      const activeCard = prevBoard.cards.find((c) => c.id === activeId);
      if (!activeCard) return prevBoard;

      // Check if over is a column (droppable)
      const overColumn = prevBoard.columns.find((col) => col.id === overId);

      // Check if over is a card
      const overCard = prevBoard.cards.find((c) => c.id === overId);

      let newColumnId: number;
      let newPosition: number;

      if (overColumn) {
        // Dropped on a column (empty area or column header)
        newColumnId = overColumn.id;
        const cardsInColumn = prevBoard.cards.filter(
          (c) => c.column_id === newColumnId && c.id !== activeId
        );
        newPosition = cardsInColumn.length; // Add to end of column
      } else if (overCard) {
        // Dropped on a card - insert at that position
        newColumnId = overCard.column_id;
        const cardsInColumn = prevBoard.cards
          .filter((c) => c.column_id === newColumnId && c.id !== activeId)
          .sort((a, b) => a.position - b.position);

        const overIndex = cardsInColumn.findIndex((c) => c.id === overId);
        newPosition = overIndex >= 0 ? overIndex : cardsInColumn.length;
      } else {
        return prevBoard;
      }

      // If the card is already in this position, don't update
      if (activeCard.column_id === newColumnId && activeCard.position === newPosition) {
        return prevBoard;
      }

      // Update card positions
      const updatedCards = prevBoard.cards.map((card) => {
        if (card.id === activeId) {
          return { ...card, column_id: newColumnId, position: newPosition };
        }

        // Adjust positions of other cards in the target column
        if (card.column_id === newColumnId && card.id !== activeId) {
          if (card.position >= newPosition) {
            return { ...card, position: card.position + 1 };
          }
        }

        return card;
      });

      return { ...prevBoard, cards: updatedCards };
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || !board) return;

    const activeCard = board.cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    try {
      await axios.patch(
        `http://localhost:5000/api/kanban/cards/${active.id}/move`,
        {
          column_id: activeCard.column_id,
          position: activeCard.position,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Erro ao mover card:', error);
      loadProjectAndBoard(); // Reload on error
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setShowCardModal(true);
  };

  const handleCreateCard = (columnId: number) => {
    setSelectedColumnForNewCard(columnId);
    setShowNewCardModal(true);
  };

  const handleChecklistUpdate = async (cardId: number, newChecklist: any[]) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/kanban/cards/${cardId}`,
        {
          checklist: JSON.stringify(newChecklist),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setBoard((prevBoard) => {
        if (!prevBoard) return prevBoard;
        const updatedCards = prevBoard.cards.map((card) =>
          card.id === cardId
            ? { ...card, checklist: JSON.stringify(newChecklist) }
            : card
        );
        return { ...prevBoard, cards: updatedCards };
      });
    } catch (error) {
      console.error('Erro ao atualizar checklist:', error);
    }
  };

  const handleCloseModal = () => {
    setShowCardModal(false);
    setShowNewCardModal(false);
    setSelectedCard(null);
    setSelectedColumnForNewCard(null);
    loadProjectAndBoard();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Carregando projeto...</p>
      </div>
    );
  }

  if (!project || !board) {
    return (
      <div className="project-management">
        <div className="error-state">
          <h2>Projeto não encontrado</h2>
          <button className="btn-primary" onClick={() => navigate('/projects')}>
            Voltar para Projetos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="project-management">
      {/* Header */}
      <div className="project-header">
        <div className="project-header-left">
          <button className="btn-back" onClick={() => navigate('/projects')}>
            <i className="fas fa-arrow-left"></i> Voltar
          </button>
          <div>
            <h1>{project.title}</h1>
            <p className="project-subtitle">{project.description}</p>
          </div>
        </div>
        <div className="project-header-right">
          <div className="view-switcher">
            <button
              className={`view-btn ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
              title="Visualização em Board"
            >
              <i className="fas fa-columns"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="Visualização em Lista"
            >
              <i className="fas fa-list"></i>
            </button>
            <button
              className={`view-btn ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
              title="Timeline"
            >
              <i className="fas fa-calendar-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      {viewMode === 'board' && (
        <div className="kanban-board">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            <div className="kanban-columns">
              {board.columns
                .sort((a, b) => a.position - b.position)
                .map((column) => (
                  <KanbanColumn
                    key={column.id}
                    column={column}
                    cards={board.cards.filter((c) => c.column_id === column.id)}
                    onCardClick={handleCardClick}
                    onAddCard={() => handleCreateCard(column.id)}
                    onChecklistUpdate={handleChecklistUpdate}
                  />
                ))}
            </div>

            <DragOverlay>
              {activeCard ? (
                <div className="kanban-card dragging">
                  <div className="card-header">
                    <span className={`priority-badge priority-${activeCard.priority}`}>
                      {activeCard.priority}
                    </span>
                  </div>
                  <h3>{activeCard.title}</h3>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="list-view">
          <p>Visualização em Lista (Em desenvolvimento)</p>
        </div>
      )}

      {/* Timeline View */}
      {viewMode === 'timeline' && (
        <div className="timeline-view">
          <p>Timeline (Em desenvolvimento)</p>
        </div>
      )}

      {/* Card Details Modal */}
      {showCardModal && selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          boardId={board.id}
          onClose={handleCloseModal}
        />
      )}

      {/* New Card Modal */}
      {showNewCardModal && selectedColumnForNewCard && (
        <CardDetailsModal
          boardId={board.id}
          columnId={selectedColumnForNewCard}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProjectManagement;

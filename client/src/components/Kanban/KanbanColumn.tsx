import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import KanbanCard from './KanbanCard';

interface Column {
  id: number;
  name: string;
  color: string;
  wip_limit?: number;
}

interface Card {
  id: number;
  board_id: number;
  column_id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status?: 'todo' | 'in_progress' | 'review' | 'done' | 'blocked';
  assigned_to?: number;
  assigned_to_name?: string;
  tags?: string;
  due_date?: string;
  estimated_hours?: number;
  time_spent?: number;
  checklist?: string;
  position: number;
}

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddCard: () => void;
  onChecklistUpdate?: (cardId: number, newChecklist: any[]) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onCardClick,
  onAddCard,
  onChecklistUpdate,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <div className="column-header" style={{ borderTopColor: column.color }}>
        <h3>{column.name}</h3>
        <span className="card-count">{cards.length}</span>
        {column.wip_limit && (
          <span className="wip-limit">/ {column.wip_limit}</span>
        )}
      </div>

      <SortableContext
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="cards-container">
          {cards
            .sort((a, b) => a.position - b.position)
            .map((card) => (
              <KanbanCard
                key={card.id}
                card={card}
                onClick={() => onCardClick(card)}
                onChecklistUpdate={onChecklistUpdate}
              />
            ))}
        </div>
      </SortableContext>

      <button className="add-card-btn" onClick={onAddCard}>
        <i className="fas fa-plus"></i> Adicionar Card
      </button>
    </div>
  );
};

export default KanbanColumn;

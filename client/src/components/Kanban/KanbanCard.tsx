import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

interface KanbanCardProps {
  card: Card;
  onClick: () => void;
  onChecklistUpdate?: (cardId: number, newChecklist: any[]) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, onClick, onChecklistUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const [mouseDownTime, setMouseDownTime] = React.useState<number>(0);
  const [wasDragged, setWasDragged] = React.useState<boolean>(false);

  const priorityColors: Record<string, string> = {
    low: '#51cf66',
    medium: '#FFD700',
    high: '#ff9f43',
    urgent: '#ff6b6b',
  };

  const statusColors: Record<string, string> = {
    todo: '#64748b',       // Gray
    in_progress: '#3b82f6', // Blue
    review: '#f59e0b',      // Orange
    done: '#10b981',        // Green
    blocked: '#ef4444',     // Red
  };

  const statusBorderColor = card.status ? statusColors[card.status] : statusColors.todo;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    borderLeft: `4px solid ${statusBorderColor}`,
  };

  let checklist: any[] = [];
  let completedItems = 0;
  let checklistTotalHours = 0;

  if (card.checklist) {
    try {
      checklist = JSON.parse(card.checklist);
      completedItems = checklist.filter((item: any) => item.checked).length;
      checklistTotalHours = checklist.reduce((sum: number, item: any) => sum + (parseFloat(item.hours) || 0), 0);
    } catch (e) {
      checklist = [];
    }
  }

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag
    onClick();
  };

  const handleChecklistToggle = (e: React.MouseEvent, itemIndex: number) => {
    e.stopPropagation(); // Prevent card click

    if (onChecklistUpdate && checklist.length > 0) {
      const updatedChecklist = checklist.map((item, idx) =>
        idx === itemIndex ? { ...item, checked: !item.checked } : item
      );
      onChecklistUpdate(card.id, updatedChecklist);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
    >
      <div className="card-header">
        <span
          className="priority-indicator"
          style={{ backgroundColor: priorityColors[card.priority] }}
        ></span>
        {card.due_date && (
          <span className="due-date">
            <i className="fas fa-calendar"></i>
            {new Date(card.due_date).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>

      <h3 className="card-title">{card.title}</h3>

      {card.description && (
        <p className="card-description">
          {card.description.substring(0, 100)}
          {card.description.length > 100 ? '...' : ''}
        </p>
      )}

      {card.tags && (
        <div className="card-tags">
          {card.tags.split(',').map((tag, index) => (
            <span key={index} className="tag">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}

      {checklist.length > 0 && (
        <div className="card-checklist-preview">
          <div className="checklist-preview-header">
            <span className="checklist-preview-title">
              <i className="fas fa-tasks"></i> Checklist
            </span>
            {checklistTotalHours > 0 && (
              <span className="checklist-total-hours-badge">
                {checklistTotalHours.toFixed(1)}h
              </span>
            )}
          </div>
          {checklist.slice(0, 3).map((item, index) => (
            <div key={index} className="checklist-preview-item">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => handleChecklistToggle(e as any, index)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className={item.checked ? 'checked' : ''}>
                {item.text.length > 25 ? item.text.substring(0, 25) + '...' : item.text}
              </span>
              {item.hours > 0 && (
                <span className="checklist-item-hours-badge">
                  {parseFloat(item.hours).toFixed(1)}h
                </span>
              )}
            </div>
          ))}
          {checklist.length > 3 && (
            <div className="checklist-more">
              +{checklist.length - 3} mais
            </div>
          )}
        </div>
      )}

      <div className="card-footer">
        <div className="card-footer-info">
          {card.assigned_to_name && (
            <div className="avatar-small">
              {card.assigned_to_name.charAt(0).toUpperCase()}
            </div>
          )}

          {checklist.length > 0 && (
            <span className="checklist-progress">
              <i className="fas fa-check-square"></i>
              {completedItems}/{checklist.length}
            </span>
          )}

          {(card.estimated_hours || checklistTotalHours > 0) && (
            <span className="time-estimate" title={`Executadas: ${(parseFloat(card.time_spent as any) || 0).toFixed(1)}h (Card) + ${checklistTotalHours.toFixed(1)}h (Checklist) | Estimadas: ${parseFloat(card.estimated_hours as any) || 0}h`}>
              <i className="fas fa-clock"></i>
              {((parseFloat(card.time_spent as any) || 0) + checklistTotalHours).toFixed(1)}h / {(parseFloat(card.estimated_hours as any) || 0).toFixed(1)}h
            </span>
          )}
        </div>

        <button
          className="btn-card-details"
          onClick={handleDetailsClick}
          title="Ver detalhes do card"
        >
          <i className="fas fa-eye"></i>
        </button>
      </div>
    </div>
  );
};

export default KanbanCard;


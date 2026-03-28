import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Card {
  id?: number;
  board_id?: number;
  column_id?: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  tags?: string;
  due_date?: string;
  estimated_hours?: number;
  time_spent?: number;
  checklist?: string;
  position?: number;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface CardDetailsModalProps {
  card?: Card;
  boardId: number;
  columnId?: number;
  onClose: () => void;
}

const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  card,
  boardId,
  columnId,
  onClose,
}) => {
  const { token } = useAuth();
  const isNewCard = !card?.id;

  const [formData, setFormData] = useState({
    title: card?.title || '',
    description: card?.description || '',
    priority: card?.priority || 'medium',
    assigned_to: card?.assigned_to || '',
    tags: card?.tags || '',
    due_date: card?.due_date ? card.due_date.substring(0, 10) : '',
    estimated_hours: card?.estimated_hours || '',
    time_spent: card?.time_spent || '',
  });

  const [checklist, setChecklist] = useState<any[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (card?.checklist) {
      try {
        setChecklist(JSON.parse(card.checklist));
      } catch (e) {
        setChecklist([]);
      }
    }

    // Load users for assignment
    const loadUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuários:', error);
      }
    };

    loadUsers();
  }, [card, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        board_id: boardId,
        column_id: columnId || card?.column_id,
        checklist: JSON.stringify(checklist),
      };

      if (isNewCard) {
        await axios.post('http://localhost:5000/api/kanban/cards', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.patch(
          `http://localhost:5000/api/kanban/cards/${card.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      onClose();
    } catch (error) {
      console.error('Erro ao salvar card:', error);
      alert('Erro ao salvar card');
    } finally {
      setLoading(false);
    }
  };

  const handleAddChecklistItem = () => {
    if (newChecklistItem.trim()) {
      setChecklist([
        ...checklist,
        { text: newChecklistItem, checked: false, hours: 0 },
      ]);
      setNewChecklistItem('');
    }
  };

  const handleChecklistHoursChange = (index: number, hours: string) => {
    setChecklist(
      checklist.map((item, i) =>
        i === index ? { ...item, hours: parseFloat(hours) || 0 } : item
      )
    );
  };

  const calculateTotalHours = () => {
    return checklist.reduce((total, item) => total + (item.hours || 0), 0);
  };

  const toggleChecklistItem = (index: number) => {
    setChecklist(
      checklist.map((item, i) =>
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const deleteChecklistItem = (index: number) => {
    setChecklist(checklist.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (!card?.id) return;

    if (window.confirm('Tem certeza que deseja excluir este card?')) {
      try {
        await axios.delete(
          `http://localhost:5000/api/kanban/cards/${card.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onClose();
      } catch (error) {
        console.error('Erro ao excluir card:', error);
        alert('Erro ao excluir card');
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>{isNewCard ? 'Novo Card' : 'Editar Card'}</h2>
          <button className="modal-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Título *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              placeholder="Nome da tarefa"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              placeholder="Descreva os detalhes da tarefa..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridade</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    priority: e.target.value as any,
                  })
                }
              >
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            <div className="form-group">
              <label>Data de Vencimento</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) =>
                  setFormData({ ...formData, due_date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="form-group">
            <label>Atribuído a</label>
            <select
              value={formData.assigned_to}
              onChange={(e) =>
                setFormData({ ...formData, assigned_to: e.target.value as any })
              }
            >
              <option value="">Não atribuído</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Horas Estimadas</label>
              <input
                type="number"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    estimated_hours: e.target.value as any,
                  })
                }
                placeholder="Ex: 8"
              />
            </div>

            <div className="form-group">
              <label>Horas Gastas</label>
              <input
                type="number"
                step="0.5"
                value={formData.time_spent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    time_spent: e.target.value as any,
                  })
                }
                placeholder="Ex: 4"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="frontend, bug, prioridade"
            />
          </div>

          <div className="form-group">
            <label>
              Checklist
              {checklist.length > 0 && (
                <span className="checklist-total-hours">
                  Total: {calculateTotalHours()}h
                </span>
              )}
            </label>
            <div className="checklist-container">
              {checklist.map((item, index) => (
                <div key={index} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(index)}
                  />
                  <span className={item.checked ? 'checked' : ''}>
                    {item.text}
                  </span>
                  <div className="checklist-item-hours">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={item.hours || 0}
                      onChange={(e) => handleChecklistHoursChange(index, e.target.value)}
                      placeholder="0"
                      title="Horas estimadas"
                    />
                    <span>h</span>
                  </div>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteChecklistItem(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}

              <div className="add-checklist-item">
                <input
                  type="text"
                  value={newChecklistItem}
                  onChange={(e) => setNewChecklistItem(e.target.value)}
                  placeholder="Adicionar item..."
                  onKeyPress={(e) =>
                    e.key === 'Enter' &&
                    (e.preventDefault(), handleAddChecklistItem())
                  }
                />
                <button type="button" onClick={handleAddChecklistItem}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <div className="modal-actions-left">
              {!isNewCard && (
                <button
                  type="button"
                  className="btn-danger"
                  onClick={handleDelete}
                >
                  <i className="fas fa-trash"></i> Excluir Card
                </button>
              )}
            </div>
            <div className="modal-actions-right">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading
                  ? 'Salvando...'
                  : isNewCard
                  ? 'Criar Card'
                  : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardDetailsModal;

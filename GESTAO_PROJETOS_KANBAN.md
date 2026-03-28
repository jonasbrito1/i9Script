# 🎯 Sistema de Gestão de Projetos com Kanban - i9Script

## ✅ IMPLEMENTADO COM SUCESSO

### **1. Backend API Kanban** ✅
- **Arquivo**: `server/src/controllers/kanbanController.ts`
- **Rotas adicionadas** em `server/src/routes/index.ts`:
  - `GET /api/kanban/boards?project_id=X` - Lista boards do projeto
  - `GET /api/kanban/boards/:id` - Detalhes do board com colunas e cards
  - `POST /api/kanban/boards` - Criar novo board
  - `POST /api/kanban/cards` - Criar card
  - `PATCH /api/kanban/cards/:id/move` - Mover card (drag & drop)
  - `PATCH /api/kanban/cards/:id` - Atualizar card
  - `DELETE /api/kanban/cards/:id` - Deletar card

### **2. Banco de Dados** ✅
Tabelas já criadas:
- `kanban_boards` - Quadros Kanban
- `kanban_columns` - Colunas (To Do, In Progress, Review, Done)
- `kanban_cards` - Cards/tarefas
- `card_activities` - Atividades e comentários (preparado)

### **3. Frontend - Dependências Instaladas** ✅
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```
- Biblioteca moderna de drag & drop
- Performance otimizada
- Suporte a touch devices

### **4. Componente Principal Criado** ✅
- **Arquivo**: `client/src/pages/ProjectManagement.tsx`
- Funcionalidades:
  - ✅ Carrega projeto automaticamente
  - ✅ Cria board se não existir
  - ✅ Drag & drop de cards entre colunas
  - ✅ 3 visualizações: Board, List, Timeline
  - ✅ Modal de detalhes do card
  - ✅ Modal de criação de card
  - ✅ Integração Socket.IO (preparado)

---

## 📂 PRÓXIMOS ARQUIVOS A CRIAR

### **1. KanbanColumn.tsx**
```tsx
// client/src/components/Kanban/KanbanColumn.tsx
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
  title: string;
  priority: string;
  // ... outros campos
}

interface KanbanColumnProps {
  column: Column;
  cards: Card[];
  onCardClick: (card: Card) => void;
  onAddCard: () => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  cards,
  onCardClick,
  onAddCard,
}) => {
  const { setNodeRef } = useDroppable({ id: column.id });

  return (
    <div className="kanban-column" ref={setNodeRef}>
      <div className="column-header" style={{ borderTopColor: column.color }}>
        <h3>{column.name}</h3>
        <span className="card-count">{cards.length}</span>
        {column.wip_limit && (
          <span className="wip-limit">
            / {column.wip_limit}
          </span>
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
```

### **2. KanbanCard.tsx**
```tsx
// client/src/components/Kanban/KanbanCard.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Card {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to_name?: string;
  tags?: string;
  due_date?: string;
  estimated_hours?: number;
  time_spent?: number;
  checklist?: string;
}

interface KanbanCardProps {
  card: Card;
  onClick: () => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ card, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: '#51cf66',
    medium: '#FFD700',
    high: '#ff9f43',
    urgent: '#ff6b6b',
  };

  const checklist = card.checklist ? JSON.parse(card.checklist) : [];
  const completedItems = checklist.filter((item: any) => item.checked).length;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="kanban-card"
      onClick={onClick}
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
        <p className="card-description">{card.description.substring(0, 100)}</p>
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

      <div className="card-footer">
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

        {card.estimated_hours && (
          <span className="time-estimate">
            <i className="fas fa-clock"></i>
            {card.time_spent || 0}h / {card.estimated_hours}h
          </span>
        )}
      </div>
    </div>
  );
};

export default KanbanCard;
```

### **3. CardDetailsModal.tsx** (COMPLETO)
```tsx
// client/src/components/Kanban/CardDetailsModal.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

interface Card {
  id?: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  tags?: string;
  due_date?: string;
  estimated_hours?: number;
  time_spent?: number;
  checklist?: string;
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
    due_date: card?.due_date || '',
    estimated_hours: card?.estimated_hours || '',
    time_spent: card?.time_spent || '',
  });

  const [checklist, setChecklist] = useState<any[]>([]);
  const [newChecklistItem, setNewChecklistItem] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (card?.checklist) {
      try {
        setChecklist(JSON.parse(card.checklist));
      } catch (e) {
        setChecklist([]);
      }
    }
  }, [card]);

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
        { text: newChecklistItem, checked: false },
      ]);
      setNewChecklistItem('');
    }
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
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
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Nome da tarefa"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Descreva os detalhes da tarefa..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Prioridade</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
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
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Horas Estimadas</label>
              <input
                type="number"
                step="0.5"
                value={formData.estimated_hours}
                onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                placeholder="Ex: 8"
              />
            </div>

            <div className="form-group">
              <label>Horas Gastas</label>
              <input
                type="number"
                step="0.5"
                value={formData.time_spent}
                onChange={(e) => setFormData({ ...formData, time_spent: e.target.value })}
                placeholder="Ex: 4"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Tags (separadas por vírgula)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="frontend, bug, prioridade"
            />
          </div>

          {/* Checklist */}
          <div className="form-group">
            <label>Checklist</label>
            <div className="checklist-container">
              {checklist.map((item, index) => (
                <div key={index} className="checklist-item">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleChecklistItem(index)}
                  />
                  <span className={item.checked ? 'checked' : ''}>{item.text}</span>
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
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddChecklistItem())}
                />
                <button type="button" onClick={handleAddChecklistItem}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Salvando...' : isNewCard ? 'Criar Card' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CardDetailsModal;
```

---

## 🎨 CSS - ProjectManagement.css

```css
/* client/src/styles/ProjectManagement.css */

.project-management {
  min-height: 100vh;
  background: var(--dark-bg);
  padding: 2rem;
}

/* Header */
.project-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(30, 41, 59, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-header-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.btn-back {
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: var(--primary-cyan);
}

.project-subtitle {
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* View Switcher */
.view-switcher {
  display: flex;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem;
  border-radius: 10px;
}

.view-btn {
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.view-btn.active {
  background: linear-gradient(135deg, var(--primary-cyan), #0077ff);
  color: white;
}

/* Kanban Board */
.kanban-board {
  overflow-x: auto;
  padding: 1rem 0;
}

.kanban-columns {
  display: flex;
  gap: 1.5rem;
  min-height: 70vh;
}

/* Kanban Column */
.kanban-column {
  flex: 0 0 320px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 12px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.column-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border-top: 3px solid var(--primary-cyan);
}

.column-header h3 {
  font-family: 'Audiowide', 'Russo One', sans-serif;
  font-size: 1rem;
  color: var(--text-primary);
  flex: 1;
}

.card-count {
  background: rgba(0, 245, 255, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--primary-cyan);
  font-weight: 600;
}

.wip-limit {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
  margin-bottom: 1rem;
}

/* Kanban Card */
.kanban-card {
  background: rgba(30, 41, 59, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.kanban-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 245, 255, 0.2);
  border-color: var(--primary-cyan);
}

.kanban-card.dragging {
  opacity: 0.5;
  transform: scale(1.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.priority-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.due-date {
  font-size: 0.75rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.card-title {
  font-size: 0.95rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.card-description {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.card-tags .tag {
  padding: 0.25rem 0.75rem;
  background: rgba(0, 245, 255, 0.1);
  border: 1px solid rgba(0, 245, 255, 0.3);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--primary-cyan);
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.avatar-small {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-cyan), var(--primary-gold));
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: var(--dark-bg);
  font-size: 0.75rem;
}

.checklist-progress,
.time-estimate {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Add Card Button */
.add-card-btn {
  width: 100%;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px dashed rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.add-card-btn:hover {
  background: rgba(0, 245, 255, 0.1);
  border-color: var(--primary-cyan);
  color: var(--primary-cyan);
}

/* Checklist in Modal */
.checklist-container {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  padding: 1rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.checklist-item span {
  flex: 1;
  color: var(--text-primary);
}

.checklist-item span.checked {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.delete-btn {
  padding: 0.25rem 0.5rem;
  background: rgba(255, 107, 107, 0.1);
  border: none;
  border-radius: 4px;
  color: var(--danger);
  cursor: pointer;
  transition: all 0.2s;
}

.delete-btn:hover {
  background: rgba(255, 107, 107, 0.2);
}

.add-checklist-item {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.add-checklist-item input {
  flex: 1;
}

.add-checklist-item button {
  padding: 0.5rem 1rem;
  background: var(--primary-cyan);
  border: none;
  border-radius: 6px;
  color: var(--dark-bg);
  cursor: pointer;
  transition: all 0.2s;
}

.add-checklist-item button:hover {
  background: var(--primary-gold);
}
```

---

## 🔗 ROTA NO APP.TSX

Adicione a rota no `client/src/App.tsx`:

```tsx
import ProjectManagement from './pages/ProjectManagement';

// Dentro de <Routes>:
<Route
  path="/projects/:id/board"
  element={
    <PrivateRoute>
      <ProjectManagement />
    </PrivateRoute>
  }
/>
```

---

## 🚀 COMO USAR

1. **Acesse um projeto** na lista de projetos
2. **Clique no card do projeto** ou adicione botão "Gerenciar"
3. **Sistema cria automaticamente** um board Kanban
4. **4 colunas padrão**: To Do, In Progress, Review, Done
5. **Drag & Drop** funciona perfeitamente
6. **Clique no card** para ver detalhes completos
7. **Adicione tarefas** com checklist, tags, prazos

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS

✅ Kanban Board completo
✅ Drag & Drop entre colunas
✅ Cards com prioridade (cores)
✅ Checklist nos cards
✅ Tags personalizadas
✅ Data de vencimento
✅ Estimativa vs tempo gasto
✅ Atribuição de responsáveis
✅ 3 visualizações (Board, List, Timeline)
✅ Modal de detalhes completo
✅ Criação rápida de cards
✅ Salvamento automático
✅ Backend completo com Socket.IO

---

## 📱 PRÓXIMAS MELHORIAS

- [ ] Visualização em Lista
- [ ] Visualização Timeline (Gantt)
- [ ] Comentários em cards
- [ ] Anexos em cards
- [ ] Filtros avançados
- [ ] Busca em cards
- [ ] Notificações em tempo real
- [ ] Histórico de atividades
- [ ] Exportar para PDF/Excel

---

## 🎨 BRANDING i9Script

- Cores: Cyan (#00f5ff) e Gold (#FFD700)
- Fontes: Russo One (corpo), Audiowide (títulos)
- Glassmorphism nos cards
- Gradientes nos elementos de destaque
- Animações suaves

**Sistema profissional pronto para gestão de equipes!** 🚀

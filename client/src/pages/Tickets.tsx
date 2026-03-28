import React, { useEffect, useState } from 'react';
import { ticketsAPI, projectsAPI } from '../services/api';
import { Ticket, Project } from '../types';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Tickets: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // New ticket form
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'bug' as 'bug' | 'feature' | 'support' | 'question' | 'other',
    project_id: undefined as number | undefined
  });

  useEffect(() => {
    loadTickets();
    loadProjects();
  }, []);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await ticketsAPI.getAll();
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ticketsAPI.create(newTicket);
      setShowCreateModal(false);
      setNewTicket({
        title: '',
        description: '',
        priority: 'medium',
        category: 'bug',
        project_id: undefined
      });
      loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const getPriorityColor = (priority: string): string => {
    const colors: Record<string, string> = {
      low: '#51cf66',
      medium: '#FFD700',
      high: '#ff9f43',
      urgent: '#ff6b6b'
    };
    return colors[priority] || '#6c757d';
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      open: '#FFD700',
      in_progress: '#00f5ff',
      waiting: '#ff9f43',
      resolved: '#51cf66',
      closed: '#6c757d'
    };
    return colors[status] || '#6c757d';
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      bug: '🐛',
      feature: '✨',
      support: '💬',
      question: '❓',
      other: '📝'
    };
    return icons[category] || '📝';
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading tickets...</p>
      </div>
    );
  }

  return (
    <div className="tickets-page">
      <div className="page-header">
        <div>
          <h1>Tickets</h1>
          <p className="page-subtitle">Manage support tickets and issues</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="waiting">Waiting</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          className="filter-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="all">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      {/* Tickets Grid */}
      <div className="tickets-grid">
        {filteredTickets.length === 0 ? (
          <div className="empty-state-card">
            <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3>No tickets found</h3>
            <p>Try adjusting your filters or create a new ticket</p>
          </div>
        ) : (
          filteredTickets.map(ticket => (
            <div
              key={ticket.id}
              className="ticket-card"
              onClick={() => handleTicketClick(ticket)}
            >
              <div className="ticket-card-header">
                <div className="ticket-category">{getCategoryIcon(ticket.category)}</div>
                <div
                  className="ticket-priority-badge"
                  style={{ background: getPriorityColor(ticket.priority) }}
                >
                  {ticket.priority}
                </div>
              </div>
              <h3 className="ticket-title">{ticket.title}</h3>
              <p className="ticket-description">{ticket.description.substring(0, 100)}...</p>
              <div className="ticket-card-footer">
                <div className="ticket-meta">
                  {ticket.project_title && (
                    <span className="ticket-project">{ticket.project_title}</span>
                  )}
                  <span
                    className="ticket-status"
                    style={{ background: getStatusColor(ticket.status) }}
                  >
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <span className="ticket-date">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Ticket</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  required
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Brief description of the issue"
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  required
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Detailed description..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as any })}
                  >
                    <option value="bug">Bug</option>
                    <option value="feature">Feature</option>
                    <option value="support">Support</option>
                    <option value="question">Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Project (Optional)</label>
                <select
                  value={newTicket.project_id || ''}
                  onChange={(e) => setNewTicket({ ...newTicket, project_id: e.target.value ? Number(e.target.value) : undefined })}
                >
                  <option value="">No Project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ticket Details Modal */}
      {showModal && selectedTicket && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedTicket.title}</h2>
                <div className="ticket-modal-badges">
                  <span
                    className="badge"
                    style={{ background: getStatusColor(selectedTicket.status) }}
                  >
                    {selectedTicket.status.replace('_', ' ')}
                  </span>
                  <span
                    className="badge"
                    style={{ background: getPriorityColor(selectedTicket.priority) }}
                  >
                    {selectedTicket.priority}
                  </span>
                  <span className="badge">{getCategoryIcon(selectedTicket.category)} {selectedTicket.category}</span>
                </div>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="ticket-details-section">
                <h3>Description</h3>
                <p className="ticket-details-text">{selectedTicket.description}</p>
              </div>

              <div className="ticket-details-grid">
                <div className="detail-item">
                  <label>Created By</label>
                  <p>{selectedTicket.user_name || 'Unknown'}</p>
                </div>
                <div className="detail-item">
                  <label>Created At</label>
                  <p>{new Date(selectedTicket.created_at).toLocaleString()}</p>
                </div>
                {selectedTicket.project_title && (
                  <div className="detail-item">
                    <label>Project</label>
                    <p>{selectedTicket.project_title}</p>
                  </div>
                )}
                {selectedTicket.assigned_name && (
                  <div className="detail-item">
                    <label>Assigned To</label>
                    <p>{selectedTicket.assigned_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;

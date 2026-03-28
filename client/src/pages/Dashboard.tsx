import React, { useEffect, useState } from 'react';
import { projectsAPI, ticketsAPI } from '../services/api';
import { DashboardStats, Project, Ticket } from '../types';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    projects: {
      total: 0,
      planning: 0,
      development: 0,
      testing: 0,
      completed: 0,
      maintenance: 0,
      avg_progress: 0
    },
    tickets: {
      total: 0,
      open: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      urgent: 0
    }
  });
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [projectStatsRes, ticketStatsRes, projectsRes, ticketsRes] = await Promise.all([
        projectsAPI.getStats(),
        ticketsAPI.getStats(),
        projectsAPI.getAll(),
        ticketsAPI.getAll({ limit: 5 })
      ]);

      setStats({
        projects: projectStatsRes.data,
        tickets: ticketStatsRes.data
      });
      setRecentProjects(projectsRes.data.slice(0, 5));
      setRecentTickets(ticketsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
      planning: '#FFD700',
      development: '#00f5ff',
      testing: '#ff6b6b',
      completed: '#51cf66',
      maintenance: '#ff9f43',
      open: '#FFD700',
      in_progress: '#00f5ff',
      waiting: '#ff9f43',
      resolved: '#51cf66',
      closed: '#6c757d'
    };
    return colors[status] || '#6c757d';
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p className="dashboard-subtitle">Overview of your projects and tickets</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #00f5ff, #0077ff)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.projects.total}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #FFD700, #ff9f43)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.projects.development}</h3>
            <p>In Development</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a6f)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.tickets.open}</h3>
            <p>Open Tickets</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="stat-content">
            <h3>{stats.tickets.urgent}</h3>
            <p>Urgent Tickets</p>
          </div>
        </div>
      </div>

      {/* Status Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Project Status Distribution</h3>
          <div className="chart-bars">
            {Object.entries(stats.projects)
              .filter(([key]) => !['total', 'avg_progress'].includes(key))
              .map(([status, count]) => (
                <div key={status} className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                    <span className="chart-bar-value">{count}</span>
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${stats.projects.total > 0 ? (count / stats.projects.total) * 100 : 0}%`,
                        background: getStatusColor(status)
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="chart-card">
          <h3>Ticket Status Distribution</h3>
          <div className="chart-bars">
            {Object.entries(stats.tickets)
              .filter(([key]) => !['total', 'urgent'].includes(key))
              .map(([status, count]) => (
                <div key={status} className="chart-bar-item">
                  <div className="chart-bar-label">
                    <span>{status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</span>
                    <span className="chart-bar-value">{count}</span>
                  </div>
                  <div className="chart-bar-track">
                    <div
                      className="chart-bar-fill"
                      style={{
                        width: `${stats.tickets.total > 0 ? (count / stats.tickets.total) * 100 : 0}%`,
                        background: getStatusColor(status)
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="recent-grid">
        <div className="recent-card">
          <div className="recent-header">
            <h3>Recent Projects</h3>
            <a href="/projects" className="view-all-link">View All</a>
          </div>
          <div className="recent-list">
            {recentProjects.length === 0 ? (
              <p className="empty-state">No projects yet</p>
            ) : (
              recentProjects.map(project => (
                <div key={project.id} className="recent-item">
                  <div className="recent-item-content">
                    <h4>{project.title}</h4>
                    <p className="recent-item-meta">
                      {project.client_name && <span>{project.client_name}</span>}
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(project.status) }}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>
                  <div className="progress-circle">
                    <svg width="50" height="50">
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#1e293b" strokeWidth="4" />
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="none"
                        stroke="#00f5ff"
                        strokeWidth="4"
                        strokeDasharray={`${2 * Math.PI * 20}`}
                        strokeDashoffset={`${2 * Math.PI * 20 * (1 - project.progress / 100)}`}
                        transform="rotate(-90 25 25)"
                      />
                      <text x="25" y="30" textAnchor="middle" fill="#fff" fontSize="12">
                        {project.progress}%
                      </text>
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="recent-card">
          <div className="recent-header">
            <h3>Recent Tickets</h3>
            <a href="/tickets" className="view-all-link">View All</a>
          </div>
          <div className="recent-list">
            {recentTickets.length === 0 ? (
              <p className="empty-state">No tickets yet</p>
            ) : (
              recentTickets.map(ticket => (
                <div key={ticket.id} className="recent-item">
                  <div className="recent-item-content">
                    <h4>{ticket.title}</h4>
                    <p className="recent-item-meta">
                      {ticket.project_title && <span>{ticket.project_title}</span>}
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(ticket.status) }}
                      >
                        {ticket.status}
                      </span>
                    </p>
                  </div>
                  <div
                    className="priority-badge"
                    style={{ background: getPriorityColor(ticket.priority) }}
                  >
                    {ticket.priority}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

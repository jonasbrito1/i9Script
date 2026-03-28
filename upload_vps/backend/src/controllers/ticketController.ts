import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest, Ticket } from '../types';
import { RowDataPacket } from 'mysql2';

export const getTickets = async (req: AuthRequest, res: Response) => {
  try {
    const { status, priority, project_id } = req.query;

    let query = `
      SELECT t.*,
        u.name as user_name,
        a.name as assigned_name,
        p.title as project_title
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN users a ON t.assigned_to = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }

    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }

    if (project_id) {
      query += ' AND t.project_id = ?';
      params.push(project_id);
    }

    query += ' ORDER BY t.created_at DESC';

    const [tickets] = await pool.query<RowDataPacket[]>(query, params);

    res.json(tickets);
  } catch (error) {
    console.error('Erro ao buscar tickets:', error);
    res.status(500).json({ message: 'Erro ao buscar tickets' });
  }
};

export const getTicketById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [tickets] = await pool.query<RowDataPacket[]>(
      `SELECT t.*,
        u.name as user_name, u.email as user_email,
        a.name as assigned_name, a.email as assigned_email,
        p.title as project_title
      FROM tickets t
      LEFT JOIN users u ON t.user_id = u.id
      LEFT JOIN users a ON t.assigned_to = a.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?`,
      [id]
    );

    if (tickets.length === 0) {
      return res.status(404).json({ message: 'Ticket não encontrado' });
    }

    // Buscar comentários
    const [comments] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, u.name as user_name, u.avatar as user_avatar
      FROM ticket_comments c
      LEFT JOIN users u ON c.user_id = u.id
      WHERE c.ticket_id = ?
      ORDER BY c.created_at ASC`,
      [id]
    );

    res.json({ ...tickets[0], comments });
  } catch (error) {
    console.error('Erro ao buscar ticket:', error);
    res.status(500).json({ message: 'Erro ao buscar ticket' });
  }
};

export const createTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { project_id, title, description, priority, category } = req.body;
    const user_id = req.user?.id;

    const [result] = await pool.query(
      `INSERT INTO tickets (project_id, user_id, title, description, priority, category)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [project_id, user_id, title, description, priority || 'medium', category || 'support']
    );

    res.status(201).json({
      message: 'Ticket criado com sucesso',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Erro ao criar ticket:', error);
    res.status(500).json({ message: 'Erro ao criar ticket' });
  }
};

export const updateTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, priority, assigned_to } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
      if (status === 'resolved' || status === 'closed') {
        updates.push('resolved_at = NOW()');
      }
    }

    if (priority) {
      updates.push('priority = ?');
      params.push(priority);
    }

    if (assigned_to !== undefined) {
      updates.push('assigned_to = ?');
      params.push(assigned_to);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    params.push(id);

    await pool.query(
      `UPDATE tickets SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Ticket atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar ticket:', error);
    res.status(500).json({ message: 'Erro ao atualizar ticket' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { comment, is_internal } = req.body;
    const user_id = req.user?.id;

    await pool.query(
      'INSERT INTO ticket_comments (ticket_id, user_id, comment, is_internal) VALUES (?, ?, ?, ?)',
      [id, user_id, comment, is_internal || false]
    );

    res.status(201).json({ message: 'Comentário adicionado com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error);
    res.status(500).json({ message: 'Erro ao adicionar comentário' });
  }
};

export const getTicketStats = async (req: AuthRequest, res: Response) => {
  try {
    const [stats] = await pool.query<RowDataPacket[]>(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
        SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) as resolved,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closed,
        SUM(CASE WHEN priority = 'urgent' THEN 1 ELSE 0 END) as urgent
      FROM tickets
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

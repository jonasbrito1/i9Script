import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket } from 'mysql2';
import { io } from '../index';

// Get all boards for a project
export const getBoards = async (req: AuthRequest, res: Response) => {
  try {
    const { project_id } = req.query;

    let query = `
      SELECT kb.*, u.name as created_by_name
      FROM kanban_boards kb
      LEFT JOIN users u ON kb.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (project_id) {
      query += ' AND kb.project_id = ?';
      params.push(project_id);
    }

    query += ' ORDER BY kb.created_at DESC';

    const [boards] = await pool.query<RowDataPacket[]>(query, params);
    res.json(boards);
  } catch (error) {
    console.error('Erro ao buscar boards:', error);
    res.status(500).json({ message: 'Erro ao buscar boards' });
  }
};

// Get board with columns and cards
export const getBoardById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [boards] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM kanban_boards WHERE id = ?',
      [id]
    );

    if (boards.length === 0) {
      return res.status(404).json({ message: 'Board não encontrado' });
    }

    const board = boards[0];

    const [columns] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM kanban_columns WHERE board_id = ? ORDER BY position',
      [id]
    );

    const [cards] = await pool.query<RowDataPacket[]>(
      `SELECT kc.*, u.name as assigned_to_name, c.name as created_by_name
       FROM kanban_cards kc
       LEFT JOIN users u ON kc.assigned_to = u.id
       LEFT JOIN users c ON kc.created_by = c.id
       WHERE kc.board_id = ?
       ORDER BY kc.column_id, kc.position`,
      [id]
    );

    res.json({ ...board, columns, cards });
  } catch (error) {
    console.error('Erro ao buscar board:', error);
    res.status(500).json({ message: 'Erro ao buscar board' });
  }
};

// Create board
export const createBoard = async (req: AuthRequest, res: Response) => {
  try {
    const { project_id, name, description } = req.body;
    const created_by = req.user?.id;

    const [result] = await pool.query(
      `INSERT INTO kanban_boards (project_id, name, description, created_by)
       VALUES (?, ?, ?, ?)`,
      [project_id, name, description, created_by]
    );

    const boardId = (result as any).insertId;

    // Create default columns
    const defaultColumns = [
      { name: 'To Do', color: '#94a3b8', position: 0 },
      { name: 'In Progress', color: '#00f5ff', position: 1 },
      { name: 'Review', color: '#ff9f43', position: 2 },
      { name: 'Done', color: '#51cf66', position: 3 }
    ];

    for (const col of defaultColumns) {
      await pool.query(
        `INSERT INTO kanban_columns (board_id, name, color, position)
         VALUES (?, ?, ?, ?)`,
        [boardId, col.name, col.color, col.position]
      );
    }

    io.emit('board-created', { boardId, project_id });

    res.status(201).json({ message: 'Board criado com sucesso', id: boardId });
  } catch (error) {
    console.error('Erro ao criar board:', error);
    res.status(500).json({ message: 'Erro ao criar board' });
  }
};

// Create card
export const createCard = async (req: AuthRequest, res: Response) => {
  try {
    const {
      board_id,
      column_id,
      title,
      description,
      assigned_to,
      priority,
      tags,
      due_date,
      estimated_hours
    } = req.body;

    const created_by = req.user?.id;

    // Sanitize integer fields - convert empty strings to null
    const assigned_to_value = assigned_to && assigned_to !== '' ? parseInt(assigned_to) : null;
    const estimated_hours_value = estimated_hours && estimated_hours !== '' ? parseFloat(estimated_hours) : null;

    // Get max position
    const [maxPos]: any = await pool.query(
      'SELECT MAX(position) as max_pos FROM kanban_cards WHERE column_id = ?',
      [column_id]
    );
    const position = (maxPos[0].max_pos || -1) + 1;

    const [result] = await pool.query(
      `INSERT INTO kanban_cards
       (board_id, column_id, title, description, assigned_to, priority, position, tags, due_date, estimated_hours, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [board_id, column_id, title, description, assigned_to_value, priority, position, tags, due_date, estimated_hours_value, created_by]
    );

    io.to(`board-${board_id}`).emit('card-created', { card_id: (result as any).insertId });

    res.status(201).json({ message: 'Card criado com sucesso', id: (result as any).insertId });
  } catch (error) {
    console.error('Erro ao criar card:', error);
    res.status(500).json({ message: 'Erro ao criar card' });
  }
};

// Move card
export const moveCard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { column_id, position } = req.body;

    // Get column name to determine status
    const [columns] = await pool.query<RowDataPacket[]>(
      'SELECT name FROM kanban_columns WHERE id = ?',
      [column_id]
    );

    let status = 'todo'; // default
    if (columns.length > 0) {
      const columnName = columns[0].name.toLowerCase();
      if (columnName.includes('to do') || columnName.includes('todo') || columnName.includes('backlog')) {
        status = 'todo';
      } else if (columnName.includes('progress') || columnName.includes('doing') || columnName.includes('development')) {
        status = 'in_progress';
      } else if (columnName.includes('review') || columnName.includes('testing') || columnName.includes('qa')) {
        status = 'review';
      } else if (columnName.includes('done') || columnName.includes('complete') || columnName.includes('finished')) {
        status = 'done';
      } else if (columnName.includes('block') || columnName.includes('waiting')) {
        status = 'blocked';
      }
    }

    await pool.query(
      'UPDATE kanban_cards SET column_id = ?, position = ?, status = ? WHERE id = ?',
      [column_id, position, status, id]
    );

    const [cards] = await pool.query<RowDataPacket[]>(
      'SELECT board_id FROM kanban_cards WHERE id = ?',
      [id]
    );

    if (cards.length > 0) {
      io.to(`board-${cards[0].board_id}`).emit('card-moved', { card_id: id, column_id, position, status });
    }

    res.json({ message: 'Card movido com sucesso', status });
  } catch (error) {
    console.error('Erro ao mover card:', error);
    res.status(500).json({ message: 'Erro ao mover card' });
  }
};

// Update card
export const updateCard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates: any = {};
    const fields: string[] = [];
    const values: any[] = [];

    // Build dynamic update query based on provided fields
    if (req.body.title !== undefined) {
      fields.push('title = ?');
      values.push(req.body.title);
    }
    if (req.body.description !== undefined) {
      fields.push('description = ?');
      values.push(req.body.description);
    }
    if (req.body.assigned_to !== undefined) {
      fields.push('assigned_to = ?');
      const assigned_to_value = req.body.assigned_to && req.body.assigned_to !== '' ? parseInt(req.body.assigned_to) : null;
      values.push(assigned_to_value);
    }
    if (req.body.priority !== undefined) {
      fields.push('priority = ?');
      values.push(req.body.priority);
    }
    if (req.body.tags !== undefined) {
      fields.push('tags = ?');
      values.push(req.body.tags);
    }
    if (req.body.due_date !== undefined) {
      fields.push('due_date = ?');
      values.push(req.body.due_date);
    }
    if (req.body.estimated_hours !== undefined) {
      fields.push('estimated_hours = ?');
      const estimated_hours_value = req.body.estimated_hours && req.body.estimated_hours !== '' ? parseFloat(req.body.estimated_hours) : null;
      values.push(estimated_hours_value);
    }
    if (req.body.time_spent !== undefined) {
      fields.push('time_spent = ?');
      const time_spent_value = req.body.time_spent && req.body.time_spent !== '' ? parseFloat(req.body.time_spent) : null;
      values.push(time_spent_value);
    }
    if (req.body.checklist !== undefined) {
      fields.push('checklist = ?');
      values.push(req.body.checklist);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    values.push(id);

    await pool.query(
      `UPDATE kanban_cards SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    const [cards] = await pool.query<RowDataPacket[]>(
      'SELECT board_id FROM kanban_cards WHERE id = ?',
      [id]
    );

    if (cards.length > 0) {
      io.to(`board-${cards[0].board_id}`).emit('card-updated', { card_id: id });
    }

    res.json({ message: 'Card atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar card:', error);
    res.status(500).json({ message: 'Erro ao atualizar card' });
  }
};

// Delete card
export const deleteCard = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [cards] = await pool.query<RowDataPacket[]>(
      'SELECT board_id FROM kanban_cards WHERE id = ?',
      [id]
    );

    await pool.query('DELETE FROM kanban_cards WHERE id = ?', [id]);

    if (cards.length > 0) {
      io.to(`board-${cards[0].board_id}`).emit('card-deleted', { card_id: id });
    }

    res.json({ message: 'Card removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover card:', error);
    res.status(500).json({ message: 'Erro ao remover card' });
  }
};

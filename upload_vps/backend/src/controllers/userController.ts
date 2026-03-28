import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket } from 'mysql2';

// Get all users (for assignment purposes)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT id, name, email, role FROM users ORDER BY name'
    );

    res.json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

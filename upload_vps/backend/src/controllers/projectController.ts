import { Response } from 'express';
import { pool } from '../config/database';
import { AuthRequest } from '../types';
import { RowDataPacket } from 'mysql2';

export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT p.*, u.name as created_by_name
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }

    query += ' ORDER BY p.created_at DESC';

    const [projects] = await pool.query<RowDataPacket[]>(query, params);

    res.json(projects);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const [projects] = await pool.query<RowDataPacket[]>(
      `SELECT p.*, u.name as created_by_name
      FROM projects p
      LEFT JOIN users u ON p.created_by = u.id
      WHERE p.id = ?`,
      [id]
    );

    if (projects.length === 0) {
      return res.status(404).json({ message: 'Projeto não encontrado' });
    }

    // Buscar atualizações do projeto
    const [updates] = await pool.query<RowDataPacket[]>(
      `SELECT pu.*, u.name as user_name
      FROM project_updates pu
      LEFT JOIN users u ON pu.user_id = u.id
      WHERE pu.project_id = ?
      ORDER BY pu.created_at DESC`,
      [id]
    );

    // Buscar tickets relacionados
    const [tickets] = await pool.query<RowDataPacket[]>(
      `SELECT id, title, status, priority, created_at
      FROM tickets
      WHERE project_id = ?
      ORDER BY created_at DESC
      LIMIT 10`,
      [id]
    );

    res.json({
      ...projects[0],
      updates,
      recent_tickets: tickets
    });
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    res.status(500).json({ message: 'Erro ao buscar projeto' });
  }
};

export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      client_name,
      status,
      technologies,
      start_date,
      end_date,
      budget,
      github_url,
      demo_url,
      show_on_landing,
      landing_image,
      landing_tags,
      landing_link
    } = req.body;

    const created_by = req.user?.id;

    const [result] = await pool.query(
      `INSERT INTO projects
      (title, description, client_name, status, technologies, start_date, end_date, budget, github_url, demo_url, created_by, show_on_landing, landing_image, landing_tags, landing_link)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        description,
        client_name,
        status || 'planning',
        JSON.stringify(technologies || []),
        start_date,
        end_date,
        budget,
        github_url,
        demo_url,
        created_by,
        show_on_landing || false,
        landing_image || null,
        landing_tags || null,
        landing_link || null
      ]
    );

    res.status(201).json({
      message: 'Projeto criado com sucesso',
      id: (result as any).insertId
    });
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    res.status(500).json({ message: 'Erro ao criar projeto' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, progress, technologies, end_date, demo_url, github_url } = req.body;

    const updates: string[] = [];
    const params: any[] = [];

    if (status) {
      updates.push('status = ?');
      params.push(status);
    }

    if (progress !== undefined) {
      updates.push('progress = ?');
      params.push(progress);
    }

    if (technologies) {
      updates.push('technologies = ?');
      params.push(JSON.stringify(technologies));
    }

    if (end_date) {
      updates.push('end_date = ?');
      params.push(end_date);
    }

    if (demo_url !== undefined) {
      updates.push('demo_url = ?');
      params.push(demo_url);
    }

    if (github_url !== undefined) {
      updates.push('github_url = ?');
      params.push(github_url);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'Nenhum campo para atualizar' });
    }

    params.push(id);

    await pool.query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    res.json({ message: 'Projeto atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    res.status(500).json({ message: 'Erro ao atualizar projeto' });
  }
};

export const addProjectUpdate = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, update_type } = req.body;
    const user_id = req.user?.id;

    await pool.query(
      'INSERT INTO project_updates (project_id, user_id, title, description, update_type) VALUES (?, ?, ?, ?, ?)',
      [id, user_id, title, description, update_type || 'progress']
    );

    res.status(201).json({ message: 'Atualização adicionada com sucesso' });
  } catch (error) {
    console.error('Erro ao adicionar atualização:', error);
    res.status(500).json({ message: 'Erro ao adicionar atualização' });
  }
};

export const getProjectStats = async (req: AuthRequest, res: Response) => {
  try {
    const [stats] = await pool.query<RowDataPacket[]>(`
      SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'planning' THEN 1 ELSE 0 END) as planning,
        SUM(CASE WHEN status = 'development' THEN 1 ELSE 0 END) as development,
        SUM(CASE WHEN status = 'testing' THEN 1 ELSE 0 END) as testing,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN status = 'maintenance' THEN 1 ELSE 0 END) as maintenance,
        AVG(progress) as avg_progress
      FROM projects
    `);

    res.json(stats[0]);
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ message: 'Erro ao buscar estatísticas' });
  }
};

// Public endpoint for landing page
export const getPublicProjects = async (req: any, res: Response) => {
  try {
    const [projects] = await pool.query<RowDataPacket[]>(
      `SELECT
        id,
        title,
        description,
        technologies,
        landing_image,
        landing_tags,
        landing_link,
        demo_url,
        github_url,
        status
      FROM projects
      WHERE show_on_landing = TRUE
      ORDER BY created_at DESC`
    );

    // Parse technologies JSON
    const formattedProjects = projects.map(project => ({
      ...project,
      technologies: typeof project.technologies === 'string'
        ? JSON.parse(project.technologies)
        : project.technologies,
      landing_tags: project.landing_tags
        ? project.landing_tags.split(',').map((tag: string) => tag.trim())
        : []
    }));

    res.json(formattedProjects);
  } catch (error) {
    console.error('Erro ao buscar projetos públicos:', error);
    res.status(500).json({ message: 'Erro ao buscar projetos' });
  }
};

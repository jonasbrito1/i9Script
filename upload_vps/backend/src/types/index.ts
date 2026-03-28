import { Request } from 'express';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'developer' | 'support' | 'client';
  avatar?: string;
  created_at: Date;
  updated_at: Date;
}

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export interface Project {
  id: number;
  title: string;
  description: string;
  client_name?: string;
  status: 'planning' | 'development' | 'testing' | 'completed' | 'maintenance';
  progress: number;
  technologies: string[];
  start_date?: Date;
  end_date?: Date;
  budget?: number;
  github_url?: string;
  demo_url?: string;
  created_by: number;
  created_at: Date;
  updated_at: Date;
}

export interface Ticket {
  id: number;
  project_id?: number;
  user_id: number;
  assigned_to?: number;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  category: 'bug' | 'feature' | 'support' | 'question' | 'other';
  attachments?: string[];
  created_at: Date;
  updated_at: Date;
  resolved_at?: Date;
}

export interface TicketComment {
  id: number;
  ticket_id: number;
  user_id: number;
  comment: string;
  is_internal: boolean;
  attachments?: string[];
  created_at: Date;
}

export interface ProjectUpdate {
  id: number;
  project_id: number;
  user_id: number;
  title: string;
  description?: string;
  update_type: 'milestone' | 'progress' | 'issue' | 'note';
  created_at: Date;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message?: string;
  type: 'ticket' | 'project' | 'system' | 'mention';
  reference_id?: number;
  is_read: boolean;
  created_at: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'support' | 'client';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  client_name?: string;
  status: 'planning' | 'development' | 'testing' | 'completed' | 'maintenance';
  progress: number;
  technologies: string[];
  start_date?: string;
  end_date?: string;
  budget?: number;
  github_url?: string;
  demo_url?: string;
  created_by: number;
  created_by_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Ticket {
  id: number;
  project_id?: number;
  project_title?: string;
  user_id: number;
  user_name?: string;
  assigned_to?: number;
  assigned_name?: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
  category: 'bug' | 'feature' | 'support' | 'question' | 'other';
  attachments?: string[];
  created_at: string;
  updated_at: string;
  resolved_at?: string;
}

export interface TicketComment {
  id: number;
  ticket_id: number;
  user_id: number;
  user_name?: string;
  user_avatar?: string;
  comment: string;
  is_internal: boolean;
  attachments?: string[];
  created_at: string;
}

export interface DashboardStats {
  projects: {
    total: number;
    planning: number;
    development: number;
    testing: number;
    completed: number;
    maintenance: number;
    avg_progress: number;
  };
  tickets: {
    total: number;
    open: number;
    in_progress: number;
    resolved: number;
    closed: number;
    urgent: number;
  };
}

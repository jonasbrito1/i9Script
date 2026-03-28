-- ============================================
-- i9Script Advanced Management System
-- Sistema completo de gestão estilo GLPI + ClickUp + Scrum
-- ============================================

-- Expandir tabela de tickets para sistema GLPI-like
ALTER TABLE tickets
ADD COLUMN category ENUM('bug', 'feature', 'support', 'infrastructure', 'documentation', 'other') DEFAULT 'support',
ADD COLUMN impact ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
ADD COLUMN urgency ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
ADD COLUMN sla_due_date DATETIME,
ADD COLUMN resolution_time INT COMMENT 'Tempo de resolução em minutos',
ADD COLUMN first_response_time INT COMMENT 'Tempo de primeira resposta em minutos',
ADD COLUMN requester_id INT,
ADD COLUMN assigned_to INT,
ADD COLUMN watcher_ids TEXT COMMENT 'IDs dos observadores separados por vírgula',
ADD COLUMN time_spent INT DEFAULT 0 COMMENT 'Tempo gasto em minutos',
ADD COLUMN estimated_time INT COMMENT 'Tempo estimado em minutos',
ADD COLUMN attachments TEXT COMMENT 'JSON com anexos',
ADD COLUMN satisfaction_rating INT COMMENT 'Nota de satisfação 1-5',
ADD COLUMN tags TEXT,
ADD COLUMN parent_ticket_id INT COMMENT 'Ticket pai para sub-tickets',
ADD CONSTRAINT fk_tickets_requester FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_tickets_assigned FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
ADD CONSTRAINT fk_tickets_parent FOREIGN KEY (parent_ticket_id) REFERENCES tickets(id) ON DELETE CASCADE;

-- Tabela de histórico de tickets
CREATE TABLE IF NOT EXISTS ticket_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ticket_id INT NOT NULL,
  user_id INT NOT NULL,
  field_changed VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tabela de SLA (Service Level Agreement)
CREATE TABLE IF NOT EXISTS sla_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  priority ENUM('low', 'medium', 'high', 'urgent') NOT NULL,
  first_response_time INT COMMENT 'Minutos para primeira resposta',
  resolution_time INT COMMENT 'Minutos para resolução',
  business_hours_only BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Kanban Boards
CREATE TABLE IF NOT EXISTS kanban_boards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de Colunas do Kanban
CREATE TABLE IF NOT EXISTS kanban_columns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  position INT NOT NULL,
  wip_limit INT COMMENT 'Work In Progress limit',
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES kanban_boards(id) ON DELETE CASCADE
);

-- Tabela de Cards do Kanban
CREATE TABLE IF NOT EXISTS kanban_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  board_id INT NOT NULL,
  column_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  assigned_to INT,
  priority ENUM('low', 'medium', 'high', 'urgent') DEFAULT 'medium',
  position INT NOT NULL,
  tags TEXT,
  due_date DATETIME,
  estimated_hours DECIMAL(5,2),
  time_spent DECIMAL(5,2) DEFAULT 0,
  checklist TEXT COMMENT 'JSON com checklist',
  attachments TEXT COMMENT 'JSON com anexos',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES kanban_boards(id) ON DELETE CASCADE,
  FOREIGN KEY (column_id) REFERENCES kanban_columns(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de Sprints (Scrum)
CREATE TABLE IF NOT EXISTS sprints (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  goal TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('planning', 'active', 'completed', 'cancelled') DEFAULT 'planning',
  velocity INT COMMENT 'Story points completados',
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de Backlog Items
CREATE TABLE IF NOT EXISTS backlog_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  sprint_id INT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('story', 'task', 'bug', 'epic') DEFAULT 'story',
  story_points INT,
  priority INT DEFAULT 0,
  status ENUM('backlog', 'todo', 'in_progress', 'review', 'done') DEFAULT 'backlog',
  assigned_to INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de Inventário
CREATE TABLE IF NOT EXISTS inventory (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category ENUM('hardware', 'software', 'license', 'asset', 'other') NOT NULL,
  description TEXT,
  serial_number VARCHAR(100),
  model VARCHAR(100),
  manufacturer VARCHAR(100),
  status ENUM('available', 'in_use', 'maintenance', 'retired') DEFAULT 'available',
  assigned_to INT,
  project_id INT,
  purchase_date DATE,
  purchase_price DECIMAL(10,2),
  warranty_expiry DATE,
  location VARCHAR(255),
  notes TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Tabela de Time Tracking
CREATE TABLE IF NOT EXISTS time_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  project_id INT,
  ticket_id INT,
  card_id INT,
  description TEXT,
  hours DECIMAL(5,2) NOT NULL,
  date DATE NOT NULL,
  billable BOOLEAN DEFAULT TRUE,
  hourly_rate DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE,
  FOREIGN KEY (card_id) REFERENCES kanban_cards(id) ON DELETE CASCADE
);

-- Tabela de Departamentos
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  manager_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Adicionar departamento aos usuários
ALTER TABLE users
ADD COLUMN department_id INT,
ADD COLUMN job_title VARCHAR(100),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
ADD COLUMN hourly_rate DECIMAL(10,2),
ADD CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL;

-- Tabela de Conhecimento Base (Knowledge Base)
CREATE TABLE IF NOT EXISTS knowledge_base (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT,
  views INT DEFAULT 0,
  helpful_count INT DEFAULT 0,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Inserir SLA policies padrão
INSERT INTO sla_policies (name, priority, first_response_time, resolution_time) VALUES
('SLA Crítico', 'urgent', 15, 240),
('SLA Alto', 'high', 60, 480),
('SLA Médio', 'medium', 240, 1440),
('SLA Baixo', 'low', 480, 2880);

-- Inserir departamentos padrão
INSERT INTO departments (name, description) VALUES
('Desenvolvimento', 'Equipe de desenvolvimento de software'),
('Suporte Técnico', 'Equipe de suporte ao cliente'),
('Infraestrutura', 'Equipe de infraestrutura e DevOps'),
('Gestão de Projetos', 'Gerenciamento de projetos');

-- Criar índices para performance
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_tickets_sla ON tickets(sla_due_date);
CREATE INDEX idx_kanban_cards_column ON kanban_cards(column_id);
CREATE INDEX idx_kanban_cards_assigned ON kanban_cards(assigned_to);
CREATE INDEX idx_sprints_project ON sprints(project_id);
CREATE INDEX idx_backlog_sprint ON backlog_items(sprint_id);
CREATE INDEX idx_time_entries_user ON time_entries(user_id);
CREATE INDEX idx_time_entries_date ON time_entries(date);

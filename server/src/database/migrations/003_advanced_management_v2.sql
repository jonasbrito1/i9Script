-- ============================================
-- i9Script Advanced Management System V2
-- Sistema completo de gestão estilo GLPI + ClickUp + Scrum
-- ============================================

-- Modificar categoria do ticket para incluir mais opções
ALTER TABLE tickets MODIFY COLUMN category ENUM('bug', 'feature', 'support', 'question', 'infrastructure', 'documentation', 'other') DEFAULT 'support';

-- Expandir tabela de tickets
ALTER TABLE tickets
ADD COLUMN IF NOT EXISTS impact ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS urgency ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS sla_due_date DATETIME,
ADD COLUMN IF NOT EXISTS resolution_time INT COMMENT 'Tempo de resolução em minutos',
ADD COLUMN IF NOT EXISTS first_response_time INT COMMENT 'Tempo de primeira resposta em minutos',
ADD COLUMN IF NOT EXISTS requester_id INT,
ADD COLUMN IF NOT EXISTS watcher_ids TEXT COMMENT 'IDs dos observadores separados por vírgula',
ADD COLUMN IF NOT EXISTS time_spent INT DEFAULT 0 COMMENT 'Tempo gasto em minutos',
ADD COLUMN IF NOT EXISTS estimated_time INT COMMENT 'Tempo estimado em minutos',
ADD COLUMN IF NOT EXISTS satisfaction_rating INT COMMENT 'Nota de satisfação 1-5',
ADD COLUMN IF NOT EXISTS tags TEXT,
ADD COLUMN IF NOT EXISTS parent_ticket_id INT COMMENT 'Ticket pai para sub-tickets';

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
  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_ticket (ticket_id)
);

-- Tabela de SLA
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_project (project_id)
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
  FOREIGN KEY (board_id) REFERENCES kanban_boards(id) ON DELETE CASCADE,
  INDEX idx_board (board_id)
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_board (board_id),
  INDEX idx_column (column_id),
  INDEX idx_assigned (assigned_to)
);

-- Tabela de Sprints
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_project (project_id),
  INDEX idx_status (status)
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_project (project_id),
  INDEX idx_sprint (sprint_id),
  INDEX idx_status (status)
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_assigned (assigned_to)
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
  FOREIGN KEY (card_id) REFERENCES kanban_cards(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_project (project_id),
  INDEX idx_date (date)
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

-- Expandir tabela de usuários
ALTER TABLE users
ADD COLUMN IF NOT EXISTS department_id INT,
ADD COLUMN IF NOT EXISTS job_title VARCHAR(100),
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'America/Sao_Paulo',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10,2);

-- Tabela de Knowledge Base
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
  FOREIGN KEY (created_by) REFERENCES users(id),
  INDEX idx_category (category)
);

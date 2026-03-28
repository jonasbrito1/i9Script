import { pool } from '../config/database';

const migrateAdvancedSystem = async () => {
  try {
    console.log('\n🚀 Iniciando migração do Sistema Avançado de Gestão i9Script\n');

    // Helper function to check if column exists
    const columnExists = async (table: string, column: string): Promise<boolean> => {
      const [columns]: any = await pool.query(
        `SHOW COLUMNS FROM ${table} LIKE '${column}'`
      );
      return columns.length > 0;
    };

    // 1. Modificar categoria do ticket
    console.log('📝 Atualizando categoria de tickets...');
    await pool.query(`
      ALTER TABLE tickets MODIFY COLUMN category
      ENUM('bug', 'feature', 'support', 'question', 'infrastructure', 'documentation', 'other')
      DEFAULT 'support'
    `);

    // 2. Adicionar campos ao tickets
    console.log('📝 Expandindo tabela de tickets...');

    const ticketFields = [
      { name: 'impact', sql: "ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium'" },
      { name: 'urgency', sql: "ENUM('low', 'medium', 'high', 'critical') DEFAULT 'medium'" },
      { name: 'sla_due_date', sql: 'DATETIME' },
      { name: 'resolution_time', sql: "INT COMMENT 'Tempo de resolução em minutos'" },
      { name: 'first_response_time', sql: "INT COMMENT 'Tempo de primeira resposta em minutos'" },
      { name: 'requester_id', sql: 'INT' },
      { name: 'watcher_ids', sql: "TEXT COMMENT 'IDs dos observadores separados por vírgula'" },
      { name: 'time_spent', sql: "INT DEFAULT 0 COMMENT 'Tempo gasto em minutos'" },
      { name: 'estimated_time', sql: "INT COMMENT 'Tempo estimado em minutos'" },
      { name: 'satisfaction_rating', sql: "INT COMMENT 'Nota de satisfação 1-5'" },
      { name: 'tags', sql: 'TEXT' },
      { name: 'parent_ticket_id', sql: "INT COMMENT 'Ticket pai para sub-tickets'" }
    ];

    for (const field of ticketFields) {
      if (!(await columnExists('tickets', field.name))) {
        await pool.query(`ALTER TABLE tickets ADD COLUMN ${field.name} ${field.sql}`);
        console.log(`  ✅ Campo ${field.name} adicionado`);
      }
    }

    // 3. Adicionar campos ao users
    console.log('📝 Expandindo tabela de usuários...');
    const userFields = [
      { name: 'department_id', sql: 'INT' },
      { name: 'job_title', sql: 'VARCHAR(100)' },
      { name: 'phone', sql: 'VARCHAR(20)' },
      { name: 'timezone', sql: "VARCHAR(50) DEFAULT 'America/Sao_Paulo'" },
      { name: 'hourly_rate', sql: 'DECIMAL(10,2)' }
    ];

    for (const field of userFields) {
      if (!(await columnExists('users', field.name))) {
        await pool.query(`ALTER TABLE users ADD COLUMN ${field.name} ${field.sql}`);
        console.log(`  ✅ Campo ${field.name} adicionado`);
      }
    }

    // 4. Criar tabelas novas
    console.log('📝 Criando novas tabelas...');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela ticket_history');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela sla_policies');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        manager_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);
    console.log('  ✅ Tabela departments');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela kanban_boards');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela kanban_columns');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela kanban_cards');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela sprints');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela backlog_items');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela inventory');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela time_entries');

    await pool.query(`
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
      )
    `);
    console.log('  ✅ Tabela knowledge_base');

    // 5. Inserir dados padrão
    console.log('\n📝 Inserindo dados padrão...');

    const [slaCheck]: any = await pool.query('SELECT COUNT(*) as count FROM sla_policies');
    if (slaCheck[0].count === 0) {
      await pool.query(`
        INSERT INTO sla_policies (name, priority, first_response_time, resolution_time) VALUES
        ('SLA Crítico', 'urgent', 15, 240),
        ('SLA Alto', 'high', 60, 480),
        ('SLA Médio', 'medium', 240, 1440),
        ('SLA Baixo', 'low', 480, 2880)
      `);
      console.log('  ✅ Políticas de SLA criadas');
    }

    const [deptCheck]: any = await pool.query('SELECT COUNT(*) as count FROM departments');
    if (deptCheck[0].count === 0) {
      await pool.query(`
        INSERT INTO departments (name, description) VALUES
        ('Desenvolvimento', 'Equipe de desenvolvimento de software'),
        ('Suporte Técnico', 'Equipe de suporte ao cliente'),
        ('Infraestrutura', 'Equipe de infraestrutura e DevOps'),
        ('Gestão de Projetos', 'Gerenciamento de projetos')
      `);
      console.log('  ✅ Departamentos criados');
    }

    console.log('\n✅ Migração concluída com sucesso!');
    console.log('\n📊 Sistema i9Script agora possui:');
    console.log('   - Sistema de Tickets estilo GLPI');
    console.log('   - Kanban Boards para gestão visual');
    console.log('   - Sprints e Backlog (Metodologia Scrum)');
    console.log('   - Inventário de ativos');
    console.log('   - Time Tracking');
    console.log('   - Base de Conhecimento');
    console.log('   - Departamentos e Organização\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Erro na migração:', error);
    process.exit(1);
  }
};

migrateAdvancedSystem();

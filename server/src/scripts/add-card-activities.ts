import { pool } from '../config/database';

const addCardActivities = async () => {
  try {
    console.log('\n📝 Criando tabela de atividades de cards...\n');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS card_activities (
        id INT AUTO_INCREMENT PRIMARY KEY,
        card_id INT NOT NULL,
        user_id INT NOT NULL,
        activity_type ENUM('comment', 'status_change', 'assignment', 'attachment', 'checklist', 'due_date', 'tag', 'move') NOT NULL,
        content TEXT,
        metadata JSON COMMENT 'Dados adicionais da atividade',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (card_id) REFERENCES kanban_cards(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id),
        INDEX idx_card (card_id),
        INDEX idx_type (activity_type),
        INDEX idx_created (created_at)
      )
    `);

    console.log('✅ Tabela card_activities criada\n');

    // Adicionar campo de atividade recente aos cards
    const [columns]: any = await pool.query(
      `SHOW COLUMNS FROM kanban_cards LIKE 'last_activity_at'`
    );

    if (columns.length === 0) {
      await pool.query(`
        ALTER TABLE kanban_cards
        ADD COLUMN last_activity_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      `);
      console.log('✅ Campo last_activity_at adicionado aos cards\n');
    }

    console.log('✅ Sistema de atividades configurado com sucesso!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error);
    process.exit(1);
  }
};

addCardActivities();

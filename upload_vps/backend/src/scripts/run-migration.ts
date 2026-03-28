import { promises as fs } from 'fs';
import { join } from 'path';
import { pool } from '../config/database';

const runMigration = async () => {
  try {
    const migrationFile = process.argv[2];
    if (!migrationFile) {
      console.error('❌ Por favor, especifique o arquivo de migração');
      process.exit(1);
    }

    const migrationPath = join(__dirname, '../database/migrations', migrationFile);
    console.log(`\n🔄 Executando migração: ${migrationFile}\n`);

    const sql = await fs.readFile(migrationPath, 'utf-8');
    const statements = sql.split(';').filter(stmt => stmt.trim());

    for (const statement of statements) {
      if (statement.trim()) {
        await pool.query(statement);
        console.log('✅', statement.trim().substring(0, 100) + '...');
      }
    }

    console.log('\n✅ Migração executada com sucesso!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migração:', error);
    process.exit(1);
  }
};

runMigration();

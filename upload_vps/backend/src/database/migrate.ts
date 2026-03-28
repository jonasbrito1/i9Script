import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  let connection;
  try {
    console.log('🚀 Iniciando migração do banco de dados...');

    // Conectar ao MySQL sem especificar o banco
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: Number(process.env.DB_PORT) || 3306
    });

    console.log('✅ Conectado ao MySQL');

    const sqlPath = path.join(__dirname, 'schema.sql');
    let sql = fs.readFileSync(sqlPath, 'utf8');

    // Hash da senha padrão
    const hashedPassword = await bcrypt.hash('admin123', 10);
    sql = sql.replace('$2a$10$YourHashedPasswordHere', hashedPassword);

    // Executar cada comando SQL separadamente
    const commands = sql.split(';').filter(cmd => cmd.trim());

    for (const command of commands) {
      if (command.trim()) {
        try {
          await connection.query(command);
        } catch (err: any) {
          if (!err.message.includes('Duplicate entry')) {
            throw err;
          }
        }
      }
    }

    console.log('✅ Migração concluída com sucesso!');
    console.log('📧 Login padrão: admin@i9script.com');
    console.log('🔑 Senha padrão: admin123');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro na migração:', error);
    if (connection) await connection.end();
    process.exit(1);
  }
};

migrate();

import bcrypt from 'bcryptjs';
import { pool } from '../config/database';

const resetAdminUser = async () => {
  try {
    const email = 'admin@i9script.com';
    const password = 'admin123';
    const name = 'Administrador';
    const role = 'admin';

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('\n🔐 Resetando usuário administrador...\n');
    console.log('Email:', email);
    console.log('Senha:', password);
    console.log('Hash:', hashedPassword);

    // Verificar se usuário existe
    const [existingUsers]: any = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      // Atualizar senha
      await pool.query(
        'UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?',
        [hashedPassword, name, role, email]
      );
      console.log('\n✅ Senha do administrador atualizada com sucesso!');
    } else {
      // Criar usuário
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );
      console.log('\n✅ Usuário administrador criado com sucesso!');
    }

    console.log('\n📋 Credenciais de acesso:');
    console.log('   Email: admin@i9script.com');
    console.log('   Senha: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao resetar usuário admin:', error);
    process.exit(1);
  }
};

resetAdminUser();

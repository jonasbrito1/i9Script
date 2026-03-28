import { pool } from '../config/database';

const createDemoProject = async () => {
  try {
    console.log('\n📦 Criando projeto de demonstração...\n');

    const [result] = await pool.query(
      `INSERT INTO projects
      (title, description, client_name, status, technologies, start_date, budget, demo_url, github_url, created_by, show_on_landing, landing_image, landing_tags, landing_link, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'E-commerce Inteligente',
        'Plataforma completa de vendas online com IA integrada, painel administrativo, sistema de pagamentos e analytics avançados.',
        'TechCorp Solutions',
        'completed',
        JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AI/ML']),
        '2024-01-15',
        50000,
        'https://demo.example.com',
        'https://github.com/i9script/ecommerce',
        1, // admin user
        true, // show_on_landing
        '🛒', // landing_image (emoji)
        'React, Node.js, PostgreSQL, Stripe, AI/ML', // landing_tags
        'https://demo.example.com', // landing_link
        100 // progress
      ]
    );

    console.log('✅ Projeto de demonstração criado com ID:', (result as any).insertId);

    // Create another demo project
    const [result2] = await pool.query(
      `INSERT INTO projects
      (title, description, client_name, status, technologies, start_date, budget, created_by, show_on_landing, landing_image, landing_tags, progress)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Dashboard Analytics Avançado',
        'Sistema de business intelligence com análise em tempo real, machine learning e visualizações interativas.',
        'DataViz Inc',
        'development',
        JSON.stringify(['Python', 'Django', 'D3.js', 'TensorFlow', 'Redis']),
        '2024-03-01',
        75000,
        1,
        true,
        '📊',
        'Python, Django, D3.js, TensorFlow, Redis',
        85
      ]
    );

    console.log('✅ Segundo projeto criado com ID:', (result2 as any).insertId);

    console.log('\n✅ Projetos de demonstração criados com sucesso!\n');
    console.log('🌐 Acesse http://localhost:3002 para ver os projetos na landing page\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar projetos:', error);
    process.exit(1);
  }
};

createDemoProject();

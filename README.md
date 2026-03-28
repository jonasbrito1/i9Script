# i9Script - Sistema de Gestão e Suporte

Sistema web completo para gestão de projetos e suporte técnico (i9Help).

## 🚀 Stack Tecnológica

### Backend
- Node.js + Express
- TypeScript
- MySQL
- JWT Authentication
- Socket.IO (Real-time)
- bcryptjs, helmet, cors

### Frontend
- React 18
- TypeScript
- React Router v6
- Axios
- Socket.IO Client
- CSS Modules

## 📋 Pré-requisitos

- Node.js 18+
- MySQL 8+
- npm ou yarn

## 🔧 Instalação

### 1. Backend

```bash
cd server
npm install
```

Configurar `.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=i9script_db
JWT_SECRET=seu_secret_key
```

Criar banco e executar migração:
```bash
npm run migrate
```

Iniciar servidor:
```bash
npm run dev
```

Servidor rodará em: `http://localhost:5000`

### 2. Frontend

```bash
cd client
npm install
```

Configurar `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

Iniciar aplicação:
```bash
npm start
```

Aplicação rodará em: `http://localhost:3000`

## 👤 Login Padrão

**Email:** admin@i9script.com
**Senha:** admin123

## 📦 Funcionalidades

### ✅ Concluído

- ✅ Sistema de autenticação JWT
- ✅ Dashboard com estatísticas
- ✅ **i9Help** - Sistema de chamados completo
  - Criar, visualizar e gerenciar tickets
  - Comentários em tickets
  - Filtros por status e prioridade
  - Atribuição de tickets
- ✅ **Gestão de Projetos**
  - Listagem e criação de projetos
  - Acompanhamento em tempo real
  - Timeline de atualizações
  - Progresso visual
- ✅ Landing Page moderna
  - Missão, Visão e Valores
  - Portfólio de projetos
  - Stack tecnológica
- ✅ Design responsivo
- ✅ Tema dark moderno

## 📁 Estrutura do Projeto

```
i9script/
├── server/               # Backend Node.js
│   ├── src/
│   │   ├── config/      # Configurações (DB)
│   │   ├── controllers/ # Lógica de negócio
│   │   ├── middleware/  # Auth, validações
│   │   ├── models/      # (futuro) Models
│   │   ├── routes/      # Rotas da API
│   │   ├── types/       # TypeScript types
│   │   ├── database/    # Migrations & schemas
│   │   └── index.ts     # Entry point
│   └── package.json
│
├── client/              # Frontend React
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── services/    # API calls
│   │   ├── context/     # Context API
│   │   ├── types/       # TypeScript types
│   │   └── styles/      # CSS
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Auth
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Dados do usuário logado

### Tickets (i9Help)
- `GET /api/tickets` - Listar tickets
- `GET /api/tickets/:id` - Detalhes do ticket
- `POST /api/tickets` - Criar ticket
- `PATCH /api/tickets/:id` - Atualizar ticket
- `POST /api/tickets/:id/comments` - Adicionar comentário
- `GET /api/tickets/stats` - Estatísticas

### Projects
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Detalhes do projeto
- `POST /api/projects` - Criar projeto (admin/dev)
- `PATCH /api/projects/:id` - Atualizar projeto
- `POST /api/projects/:id/updates` - Adicionar atualização
- `GET /api/projects/stats` - Estatísticas

## 🎨 Design

- **Cores principais:**
  - Cyan: `#00f5ff`
  - Gold: `#FFD700`
  - Dark: `#0f172a`
- **Fonte:** Inter (corpo) + Orbitron (logo)
- **Estilo:** Glassmorphism + Dark theme

## 📝 Licença

© 2025 i9Script. Todos os direitos reservados.

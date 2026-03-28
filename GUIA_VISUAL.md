# 📸 Guia Visual - Sistema i9Script

## 🎯 Visão Geral do Sistema

Este é um sistema web completo com **3 áreas principais**:

---

## 1️⃣ Landing Page (Pública)

### 🌐 URL: http://localhost:3001

### O que você verá:

**Hero Section**
```
┌─────────────────────────────────────────────┐
│                                             │
│              i9Script                       │
│     Tecnologia que transforma               │
│        ideias em resultados                 │
│                                             │
│   [Acessar Sistema]  [Ver Projetos]        │
└─────────────────────────────────────────────┘
```

**Stack Tecnológica**
- ⚛️ React & TypeScript
- 🚀 Node.js & Express
- 💾 MySQL & PostgreSQL
- ☁️ Cloud & DevOps

**Missão, Visão e Valores**
- 🎯 Missão: Desenvolver soluções que geram valor
- 🔭 Visão: Ser referência na região
- 💎 Valores: Excelência, Transparência, Inovação

**Portfólio**
- Sistema Hospitalar ✅
- E-commerce ✅
- Dashboard Analytics ✅
- EduSystem ⚠️ (Em desenvolvimento)

---

## 2️⃣ Página de Login

### 🔐 URL: http://localhost:3001/login

### Layout:
```
┌─────────────────────────────────────────────┐
│                                             │
│            i9Script                         │
│      Sistema de Gestão e Suporte           │
│                                             │
│  ┌──────────────────────────────────────┐  │
│  │  Email: [________________]           │  │
│  │  Senha: [________________]           │  │
│  │                                      │  │
│  │         [ENTRAR]                     │  │
│  └──────────────────────────────────────┘  │
│                                             │
│  Login: admin@i9script.com                 │
│  Senha: admin123                           │
└─────────────────────────────────────────────┘
```

**Credenciais:**
- 📧 Email: `admin@i9script.com`
- 🔑 Senha: `admin123`

---

## 3️⃣ Sistema Interno (Autenticado)

### Após fazer login, você acessa:

---

### 📊 Dashboard

**URL**: http://localhost:3001/dashboard

```
┌─────────────────────────────────────────────────────────┐
│  [≡] Dashboard                    👤 Admin    [Sair]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │   15     │  │    8     │  │   23     │  │   5    │ │
│  │ Projetos │  │   Ativo  │  │ Tickets  │  │ Urgent │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│                                                         │
│  📈 Gráfico de Status                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Planning   ████████                            │   │
│  │  Development ████████████████                   │   │
│  │  Testing     ████████                           │   │
│  │  Completed   ████████████████████████           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  📋 Últimos Tickets                                     │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🐛 Bug no login            [URGENT] [OPEN]      │   │
│  │ ⭐ Nova funcionalidade     [MEDIUM] [IN PROGRESS]│   │
│  │ ❓ Dúvida sobre API        [LOW]    [RESOLVED]  │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Elementos:**
- 4 Cards de estatísticas
- Gráficos de barras
- Lista de tickets recentes
- Lista de projetos recentes

---

### 🎫 i9Help - Sistema de Chamados

**URL**: http://localhost:3001/tickets

```
┌─────────────────────────────────────────────────────────┐
│  [≡] Tickets                      👤 Admin    [Sair]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  [+ Novo Ticket]                                        │
│                                                         │
│  Filtros: [Status ▼] [Prioridade ▼] [🔍 Buscar...]    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🐛 Erro ao fazer login                          │   │
│  │ Sistema retorna erro 500 ao tentar login...     │   │
│  │ [URGENT] [OPEN] 📁 Sistema Web                  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ⭐ Adicionar dark mode                          │   │
│  │ Implementar tema escuro para o dashboard...    │   │
│  │ [MEDIUM] [IN PROGRESS] 📁 Dashboard Analytics   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛠️ Suporte para exportação                      │   │
│  │ Cliente precisa exportar relatórios em PDF...  │   │
│  │ [HIGH] [OPEN] 📁 E-commerce                     │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- ➕ Criar novo ticket
- 🔍 Buscar tickets
- 🎛️ Filtrar por status/prioridade
- 👁️ Ver detalhes (click no card)
- 💬 Adicionar comentários
- 👤 Atribuir responsável
- ✅ Alterar status

**Cores de Prioridade:**
- 🔴 **URGENT** - Vermelho
- 🟠 **HIGH** - Laranja
- 🟡 **MEDIUM** - Amarelo
- 🟢 **LOW** - Verde

---

### 📁 Gestão de Projetos

**URL**: http://localhost:3001/projects

```
┌─────────────────────────────────────────────────────────┐
│  [≡] Projetos                     👤 Admin    [Sair]    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Filtros: [Status ▼] [🔍 Buscar...]                    │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🏥 Sistema Hospitalar                           │   │
│  │ Gestão completa de prontuários...               │   │
│  │ ████████████████████░░░░ 85%                    │   │
│  │ [React] [Node.js] [PostgreSQL]                  │   │
│  │ 👤 João Silva    💰 R$ 150.000    ✅ COMPLETED   │   │
│  │ [GitHub] [Demo]                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 🛒 E-commerce                                   │   │
│  │ Plataforma de vendas online...                  │   │
│  │ ████████████████████████████ 100%               │   │
│  │ [Next.js] [Stripe] [MongoDB]                    │   │
│  │ 👤 Maria Costa   💰 R$ 200.000   ✅ COMPLETED    │   │
│  │ [GitHub] [Demo]                                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📊 Dashboard Analytics                          │   │
│  │ Visualização de dados em tempo real...         │   │
│  │ ████████████░░░░░░░░░░░░░░░░ 60%               │   │
│  │ [React] [D3.js] [WebSocket]                     │   │
│  │ 👤 Pedro Lima    💰 R$ 80.000    🔄 DEVELOPMENT  │   │
│  │ [GitHub]                                        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- 📊 Barra de progresso visual
- 🏷️ Tags de tecnologias
- 💰 Informação de orçamento
- 👤 Responsável
- 🔗 Links para GitHub e Demo
- 📈 Status do projeto
- 🔍 Filtros e busca

**Status dos Projetos:**
- 📋 **PLANNING** - Planejamento
- 🔄 **DEVELOPMENT** - Em desenvolvimento
- 🧪 **TESTING** - Em testes
- ✅ **COMPLETED** - Concluído
- 🔧 **MAINTENANCE** - Manutenção

---

## 🎨 Paleta de Cores

```
Cyan:    #00f5ff  ████  (Tecnologia, botões primários)
Gold:    #FFD700  ████  (Destaques, valores)
Dark:    #0f172a  ████  (Background)
Gray:    #94a3b8  ████  (Textos secundários)
Red:     #ff6b6b  ████  (Urgente)
Green:   #4ade80  ████  (Sucesso)
```

---

## 🔄 Fluxo de Navegação

```
Landing Page (/)
      │
      ├─→ [Acessar Sistema]
      │         │
      │         ↓
      │    Login (/login)
      │         │
      │         ├─ Email: admin@i9script.com
      │         ├─ Senha: admin123
      │         └─ [ENTRAR]
      │               │
      │               ↓
      │         Dashboard (/dashboard)
      │               │
      │               ├─→ Tickets (/tickets)
      │               │      │
      │               │      ├─ Criar Ticket
      │               │      ├─ Ver Detalhes
      │               │      └─ Adicionar Comentário
      │               │
      │               └─→ Projetos (/projects)
      │                      │
      │                      ├─ Ver Lista
      │                      └─ Ver Detalhes
      │
      └─→ [Ver Projetos] (scroll para portfólio)
```

---

## 📱 Responsividade

### Desktop (> 768px)
- Sidebar visível
- Grid de 2-4 colunas
- Cards lado a lado

### Mobile (< 768px)
- Menu hambúrguer (≡)
- Grid de 1 coluna
- Cards empilhados
- Textos adaptáveis

---

## 🎯 Elementos Visuais

### Cards
```
┌──────────────────────────────┐
│  Background: Dark + Glass    │
│  Border: Cyan glow           │
│  Shadow: Neon effect         │
│  Hover: Levitação (↑)        │
└──────────────────────────────┘
```

### Botões
```
[Primário] - Cyan gradient + glow
[Secundário] - Border gold
[Desabilitado] - Opacidade 50%
```

### Badges
```
[URGENT]  - Vermelho
[HIGH]    - Laranja
[MEDIUM]  - Amarelo
[LOW]     - Verde
```

---

## 🚀 Inicialização Rápida

### Opção 1: Script Automático (Windows)
```bash
# Duplo click no arquivo:
start.bat
```

### Opção 2: Manual
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
set PORT=3001
npm start
```

### Opção 3: Comandos Individuais
```bash
# Backend (Porta 5000)
cd server && npm run dev

# Frontend (Porta 3001)
cd client && PORT=3001 npm start
```

---

## ✅ Checklist de Teste

### Landing Page
- [ ] Abrir http://localhost:3001
- [ ] Ver hero section com logo i9Script
- [ ] Scroll ver Stack Tecnológica
- [ ] Ver Missão, Visão e Valores
- [ ] Ver Portfólio de projetos
- [ ] Click em "Acessar Sistema"

### Login
- [ ] Ver formulário de login
- [ ] Tentar login com credenciais erradas (deve dar erro)
- [ ] Login com `admin@i9script.com` / `admin123`
- [ ] Redirecionar para dashboard

### Dashboard
- [ ] Ver 4 cards de estatísticas
- [ ] Ver gráficos
- [ ] Ver últimos tickets
- [ ] Ver últimos projetos

### Tickets
- [ ] Click em "Tickets" no menu
- [ ] Ver lista de tickets
- [ ] Usar filtros
- [ ] Click em "Novo Ticket"
- [ ] Preencher formulário
- [ ] Salvar ticket
- [ ] Click em um ticket
- [ ] Ver detalhes
- [ ] Adicionar comentário

### Projetos
- [ ] Click em "Projetos" no menu
- [ ] Ver lista de projetos
- [ ] Ver barras de progresso
- [ ] Click em um projeto
- [ ] Ver timeline de atualizações
- [ ] Ver tickets relacionados

### Logout
- [ ] Click no botão "Sair"
- [ ] Redirecionar para login

---

## 🎨 Design Tokens

### Espaçamento
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 2rem (32px)
- lg: 4rem (64px)
- xl: 6rem (96px)

### Border Radius
- sm: 10px
- md: 15px
- lg: 20px
- full: 50%

### Fontes
- **Família**: Inter (corpo), Orbitron (logo)
- **Tamanhos**: 0.85rem → 2.5rem
- **Pesos**: 400, 600, 700, 800

---

## 🎓 Dicas de Uso

1. **Navegação Rápida**
   - Use o menu lateral para alternar entre seções
   - Logo sempre volta para dashboard

2. **Filtros**
   - Combine status + prioridade para buscar específica
   - Use busca por texto livre

3. **Tempo Real**
   - Dashboard atualiza automaticamente
   - Projetos mostram progresso atual

4. **Mobile**
   - Menu hambúrguer (≡) para abrir navegação
   - Swipe para fechar sidebar

---

**Desenvolvido com ❤️ por i9Script**

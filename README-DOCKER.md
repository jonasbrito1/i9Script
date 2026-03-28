# 🐳 i9Script - Configuração Docker

Este guia mostra como rodar MySQL e phpMyAdmin usando Docker.

## 📋 Pré-requisitos

1. **Docker Desktop** instalado e rodando
   - Download: https://www.docker.com/products/docker-desktop/

## 🚀 Início Rápido

### Opção 1: Script Automático (Recomendado)

Clique duas vezes no arquivo:
```
start-mysql.bat
```

### Opção 2: Linha de Comando

```bash
docker-compose up -d mysql phpmyadmin
```

## 🔧 Configuração Completa

### 1. Iniciar MySQL e phpMyAdmin

```bash
# Iniciar containers
docker-compose up -d mysql phpmyadmin

# Verificar status
docker ps
```

### 2. Executar Migrations

Após o MySQL estar rodando, execute as migrations para criar as tabelas:

```bash
cd server
npm run migrate
```

### 3. Iniciar Backend e Frontend

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
PORT=3001 npm start
```

## 🌐 URLs de Acesso

- **Frontend:** http://localhost:3001
- **Backend API:** http://localhost:5000
- **phpMyAdmin:** http://localhost:8080

## 🔑 Credenciais

### phpMyAdmin
- **Servidor:** `mysql`
- **Usuário:** `root`
- **Senha:** `root123`

### Banco de Dados (Aplicação)
- **Database:** `i9script`
- **Usuário:** `i9script`
- **Senha:** `i9script123`

### Login da Aplicação
- **Email:** `admin@i9script.com`
- **Senha:** `admin123`

## 📊 Estrutura Docker

### Containers
- `i9script-mysql` - MySQL 8.0 (porta 3306)
- `i9script-phpmyadmin` - phpMyAdmin (porta 8080)

### Volumes
- `i9script-mysql-data` - Dados persistentes do MySQL

### Network
- `i9script-network` - Rede interna para comunicação entre containers

## 🛠️ Comandos Úteis

### Gerenciar Containers

```bash
# Iniciar
docker-compose up -d mysql phpmyadmin

# Parar
docker-compose stop mysql phpmyadmin

# Reiniciar
docker-compose restart mysql

# Ver logs
docker-compose logs -f mysql
docker-compose logs -f phpmyadmin

# Status
docker ps

# Remover containers
docker-compose down

# Remover containers E dados
docker-compose down -v
```

### Acesso ao MySQL via Terminal

```bash
# Acessar container MySQL
docker exec -it i9script-mysql bash

# Conectar ao MySQL
mysql -uroot -proot123

# Usar banco i9script
USE i9script;

# Listar tabelas
SHOW TABLES;
```

### Backup do Banco de Dados

```bash
# Backup
docker exec i9script-mysql mysqldump -uroot -proot123 i9script > backup.sql

# Restore
docker exec -i i9script-mysql mysql -uroot -proot123 i9script < backup.sql
```

## 🔍 Troubleshooting

### Docker Desktop não está rodando

**Erro:** `error during connect: ... dockerDesktopLinuxEngine`

**Solução:**
1. Abra o Docker Desktop
2. Aguarde o ícone ficar verde
3. Tente novamente

### Porta 3306 já em uso

**Erro:** `port is already allocated`

**Solução:**
```bash
# Verificar processos na porta 3306
netstat -ano | findstr :3306

# Parar MySQL local se estiver rodando
net stop MySQL80

# Ou matar o processo
taskkill /PID <PID> /F
```

### Container não conecta

```bash
# Ver logs do MySQL
docker-compose logs mysql

# Verificar health
docker inspect i9script-mysql | findstr Health

# Reiniciar container
docker-compose restart mysql
```

### Resetar banco de dados completamente

```bash
# Parar e remover tudo
docker-compose down -v

# Iniciar novamente
docker-compose up -d mysql phpmyadmin

# Aguardar 10 segundos
timeout /t 10

# Rodar migrations
cd server
npm run migrate
```

### Backend não conecta ao MySQL

**Erro no backend:** `ECONNREFUSED 127.0.0.1:3306`

**Verificações:**
1. MySQL container está rodando? `docker ps`
2. Porta 3306 está exposta? `docker port i9script-mysql`
3. Aguarde alguns segundos após iniciar o MySQL

**Arquivo `.env` correto:**
```env
DB_HOST=localhost
DB_USER=i9script
DB_PASSWORD=change_me_db_password
DB_NAME=i9script
DB_PORT=3306
```

## 📁 Arquivos de Configuração

### docker-compose.yml
Configuração principal dos containers

### server/.env
Configuração do backend (credenciais do banco)

### server/src/config/database.ts
Configuração de conexão MySQL

## 🔄 Fluxo de Trabalho Diário

### Iniciar ambiente completo:

```bash
# 1. Iniciar Docker Desktop (se não estiver rodando)

# 2. Iniciar MySQL e phpMyAdmin
start-mysql.bat
# ou
docker-compose up -d mysql phpmyadmin

# 3. Aguardar alguns segundos

# 4. Iniciar Backend
cd server
npm run dev

# 5. Iniciar Frontend (outro terminal)
cd client
PORT=3001 npm start
```

### Parar ambiente:

```bash
# Parar MySQL e phpMyAdmin
stop-mysql.bat
# ou
docker-compose stop mysql phpmyadmin

# Backend e Frontend: Ctrl+C nos terminais
```

## 📝 Notas Importantes

- ✅ Os dados do MySQL são **persistentes** (volume `mysql_data`)
- ✅ Mesmo após `docker-compose down`, os dados são mantidos
- ⚠️ Use `docker-compose down -v` apenas se quiser **apagar TUDO**
- ✅ phpMyAdmin facilita visualização e edição de dados
- ✅ Credenciais estão no `docker-compose.yml`

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se Docker Desktop está rodando
2. Veja os logs: `docker-compose logs mysql`
3. Reinicie os containers: `docker-compose restart mysql`
4. Em último caso, reset completo: `docker-compose down -v && docker-compose up -d`

## 📚 Documentação Adicional

- [Docker Documentation](https://docs.docker.com/)
- [MySQL Docker Hub](https://hub.docker.com/_/mysql)
- [phpMyAdmin Docker Hub](https://hub.docker.com/_/phpmyadmin)

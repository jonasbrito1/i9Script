# 🚀 Iniciar MySQL e phpMyAdmin via Docker

## Pré-requisitos
- Docker Desktop instalado e rodando

## Passo 1: Iniciar Docker Desktop
1. Abra o **Docker Desktop** no Windows
2. Aguarde até que o ícone fique verde (Docker está rodando)

## Passo 2: Iniciar MySQL e phpMyAdmin

Abra o terminal na pasta do projeto e execute:

```bash
docker-compose up -d mysql phpmyadmin
```

## Passo 3: Verificar se os containers estão rodando

```bash
docker ps
```

Você deve ver:
- `i9script-mysql` rodando na porta 3306
- `i9script-phpmyadmin` rodando na porta 8080

## Passo 4: Acessar phpMyAdmin

Abra o navegador em: **http://localhost:8080**

**Credenciais:**
- Servidor: `mysql`
- Usuário: `root`
- Senha: `root123`

## Passo 5: Criar tabelas do banco de dados

Após o MySQL estar rodando, execute as migrations:

```bash
cd server
npm run migrate
```

## Credenciais do Banco de Dados

### Root
- Usuário: `root`
- Senha: `root123`

### Aplicação
- Database: `i9script`
- Usuário: `i9script`
- Senha: `i9script123`

## Credenciais de Login da Aplicação

Após rodar as migrations, use:
- **Email:** `admin@i9script.com`
- **Senha:** `admin123`

## Comandos úteis

### Parar containers
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f mysql
docker-compose logs -f phpmyadmin
```

### Reiniciar MySQL
```bash
docker-compose restart mysql
```

### Remover tudo (incluindo dados)
```bash
docker-compose down -v
```

## Portas usadas

- **3306** - MySQL
- **8080** - phpMyAdmin
- **5000** - Backend API
- **3001** - Frontend React

## Troubleshooting

### Erro "port is already allocated"
```bash
# Parar containers existentes
docker-compose down

# Verificar se algum processo está usando a porta
netstat -ano | findstr :3306
```

### Banco de dados não conecta
1. Verifique se o container está rodando: `docker ps`
2. Verifique os logs: `docker-compose logs mysql`
3. Reinicie o container: `docker-compose restart mysql`

### Resetar banco de dados
```bash
# Parar e remover volumes
docker-compose down -v

# Reiniciar
docker-compose up -d mysql phpmyadmin

# Rodar migrations novamente
cd server
npm run migrate
```

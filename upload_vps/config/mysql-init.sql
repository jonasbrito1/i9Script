-- Configurações iniciais do MySQL para i9Script
-- Este arquivo é executado automaticamente na primeira inicialização

-- Criar usuário se não existir
CREATE USER IF NOT EXISTS 'i9script'@'%' IDENTIFIED BY 'I9script@2025!Secure';
GRANT ALL PRIVILEGES ON i9script_db.* TO 'i9script'@'%';
FLUSH PRIVILEGES;

-- Configurações de timezone
SET GLOBAL time_zone = '-04:00';

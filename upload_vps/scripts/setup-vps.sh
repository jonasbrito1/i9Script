#!/bin/bash

# Script de configuração inicial do VPS para i9Script
# Execute este script como root

set -e

echo "=========================================="
echo "  i9Script - Configuração do VPS"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then
    echo -e "${RED}[ERRO]${NC} Execute este script como root (sudo)"
    exit 1
fi

echo -e "${BLUE}[1/10]${NC} Atualizando sistema..."
apt update && apt upgrade -y

echo -e "${BLUE}[2/10]${NC} Instalando dependências básicas..."
apt install -y curl wget git unzip software-properties-common

echo -e "${BLUE}[3/10]${NC} Instalando Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl enable docker
    systemctl start docker
    rm get-docker.sh
    echo -e "${GREEN}✓${NC} Docker instalado"
else
    echo -e "${GREEN}✓${NC} Docker já está instalado"
fi

echo -e "${BLUE}[4/10]${NC} Instalando Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN}✓${NC} Docker Compose instalado"
else
    echo -e "${GREEN}✓${NC} Docker Compose já está instalado"
fi

echo -e "${BLUE}[5/10]${NC} Instalando Nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✓${NC} Nginx instalado"
else
    echo -e "${GREEN}✓${NC} Nginx já está instalado"
fi

echo -e "${BLUE}[6/10]${NC} Instalando Certbot (SSL)..."
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓${NC} Certbot instalado"
else
    echo -e "${GREEN}✓${NC} Certbot já está instalado"
fi

echo -e "${BLUE}[7/10]${NC} Criando diretórios da aplicação..."
mkdir -p /var/www/i9script/frontend
mkdir -p /var/www/i9script/backend
mkdir -p /var/www/certbot
echo -e "${GREEN}✓${NC} Diretórios criados"

echo -e "${BLUE}[8/10]${NC} Configurando firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3306/tcp
ufw --force enable
echo -e "${GREEN}✓${NC} Firewall configurado"

echo -e "${BLUE}[9/10]${NC} Criando usuário para deploy..."
if ! id "i9script" &>/dev/null; then
    useradd -m -s /bin/bash i9script
    usermod -aG docker i9script
    echo -e "${GREEN}✓${NC} Usuário i9script criado"
else
    echo -e "${GREEN}✓${NC} Usuário i9script já existe"
fi

echo -e "${BLUE}[10/10]${NC} Configurando permissões..."
chown -R i9script:i9script /var/www/i9script
chmod -R 755 /var/www/i9script

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Configuração inicial concluída!${NC}"
echo "=========================================="
echo ""
echo "Próximos passos:"
echo "1. Faça upload dos arquivos para /var/www/i9script/"
echo "2. Execute: bash /var/www/i9script/scripts/deploy.sh"
echo ""

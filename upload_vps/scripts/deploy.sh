#!/bin/bash

# Script de Deploy do i9Script
# Execute este script após fazer upload dos arquivos

set -e

echo "=========================================="
echo "  i9Script - Deploy"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

APP_DIR="/var/www/i9script"

cd $APP_DIR

echo -e "${BLUE}[1/8]${NC} Configurando Nginx..."
if [ -f "$APP_DIR/config/nginx-i9script.conf" ]; then
    cp $APP_DIR/config/nginx-i9script.conf /etc/nginx/sites-available/i9script.com
    ln -sf /etc/nginx/sites-available/i9script.com /etc/nginx/sites-enabled/

    # Remover configuração default se existir
    rm -f /etc/nginx/sites-enabled/default

    # Testar configuração
    nginx -t
    systemctl reload nginx
    echo -e "${GREEN}✓${NC} Nginx configurado"
else
    echo -e "${RED}✗${NC} Arquivo de configuração do Nginx não encontrado"
    exit 1
fi

echo -e "${BLUE}[2/8]${NC} Gerando certificado SSL com Let's Encrypt..."
echo -e "${YELLOW}IMPORTANTE:${NC} Certifique-se que o domínio i9script.com aponta para este servidor"
read -p "O domínio já está apontando? (s/n): " domain_ready

if [ "$domain_ready" = "s" ] || [ "$domain_ready" = "S" ]; then
    certbot --nginx -d i9script.com -d www.i9script.com --non-interactive --agree-tos --email admin@i9script.com || {
        echo -e "${YELLOW}⚠${NC} Certificado SSL não gerado. Configure manualmente depois."
    }
else
    echo -e "${YELLOW}⚠${NC} Configure o DNS primeiro e execute: certbot --nginx -d i9script.com -d www.i9script.com"
fi

echo -e "${BLUE}[3/8]${NC} Copiando arquivos do backend..."
cp -r $APP_DIR/backend/* $APP_DIR/backend/ 2>/dev/null || true
echo -e "${GREEN}✓${NC} Backend copiado"

echo -e "${BLUE}[4/8]${NC} Copiando arquivos do frontend..."
rm -rf /var/www/i9script/frontend/*
cp -r $APP_DIR/frontend/* /var/www/i9script/frontend/
echo -e "${GREEN}✓${NC} Frontend copiado"

echo -e "${BLUE}[5/8]${NC} Configurando variáveis de ambiente..."
if [ ! -f "$APP_DIR/backend/.env.production" ]; then
    echo -e "${RED}✗${NC} Arquivo .env.production não encontrado!"
    exit 1
fi
cp $APP_DIR/backend/.env.production $APP_DIR/backend/.env
echo -e "${GREEN}✓${NC} Variáveis configuradas"

echo -e "${BLUE}[6/8]${NC} Iniciando containers Docker..."
cd $APP_DIR
docker-compose -f docker-compose.production.yml down 2>/dev/null || true
docker-compose -f docker-compose.production.yml up -d
echo -e "${GREEN}✓${NC} Containers iniciados"

echo -e "${BLUE}[7/8]${NC} Aguardando serviços iniciarem..."
sleep 15

echo -e "${BLUE}[8/8]${NC} Executando migrations do banco..."
docker-compose -f docker-compose.production.yml exec -T backend npm run migrate || {
    echo -e "${YELLOW}⚠${NC} Migration pode precisar ser executada manualmente"
}

echo ""
echo "=========================================="
echo -e "${GREEN}✓ Deploy concluído com sucesso!${NC}"
echo "=========================================="
echo ""
echo "Serviços:"
echo "  • Frontend: https://i9script.com"
echo "  • Backend API: https://i9script.com/api"
echo "  • MySQL: localhost:3306"
echo ""
echo "Verificar status:"
echo "  docker-compose -f docker-compose.production.yml ps"
echo ""
echo "Ver logs:"
echo "  docker-compose -f docker-compose.production.yml logs -f"
echo ""

#!/bin/bash

# Script para reiniciar os serviços do i9Script

echo "Reiniciando serviços do i9Script..."

cd /var/www/i9script

docker-compose -f docker-compose.production.yml restart

echo ""
echo "✓ Serviços reiniciados!"
echo ""
echo "Status dos containers:"
docker-compose -f docker-compose.production.yml ps

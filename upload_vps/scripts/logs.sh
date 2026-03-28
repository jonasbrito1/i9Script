#!/bin/bash

# Script para visualizar logs do i9Script

cd /var/www/i9script

if [ "$1" = "backend" ]; then
    echo "=== Logs do Backend ==="
    docker-compose -f docker-compose.production.yml logs -f backend
elif [ "$1" = "mysql" ]; then
    echo "=== Logs do MySQL ==="
    docker-compose -f docker-compose.production.yml logs -f mysql
else
    echo "=== Logs de todos os serviços ==="
    docker-compose -f docker-compose.production.yml logs -f
fi

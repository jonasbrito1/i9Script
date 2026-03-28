@echo off
echo ========================================
echo  i9Script - Iniciar MySQL e phpMyAdmin
echo ========================================
echo.

REM Verificar se Docker Desktop está rodando
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Desktop nao esta rodando!
    echo.
    echo Por favor, inicie o Docker Desktop e tente novamente.
    echo.
    pause
    exit /b 1
)

echo [OK] Docker Desktop esta rodando
echo.

echo Iniciando MySQL e phpMyAdmin...
docker-compose up -d mysql phpmyadmin

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo  Containers iniciados com sucesso!
    echo ========================================
    echo.
    echo MySQL:        localhost:3306
    echo phpMyAdmin:   http://localhost:8080
    echo.
    echo Credenciais phpMyAdmin:
    echo   Usuario: root
    echo   Senha:   root123
    echo.
    echo Aguardando MySQL inicializar...
    timeout /t 10 /nobreak > nul
    echo.
    echo Verificando status dos containers...
    docker ps --filter "name=i9script-mysql" --filter "name=i9script-phpmyadmin"
    echo.
    echo ========================================
    echo  Pronto para usar!
    echo ========================================
    echo.
    echo Acesse: http://localhost:8080
    echo.
) else (
    echo.
    echo [ERRO] Falha ao iniciar containers
    echo.
)

pause

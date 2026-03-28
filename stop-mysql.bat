@echo off
echo ========================================
echo  i9Script - Parar MySQL e phpMyAdmin
echo ========================================
echo.

docker-compose stop mysql phpmyadmin

if %errorlevel% equ 0 (
    echo.
    echo [OK] Containers parados com sucesso!
    echo.
) else (
    echo.
    echo [ERRO] Falha ao parar containers
    echo.
)

pause

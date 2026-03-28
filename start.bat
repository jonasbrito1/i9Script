@echo off
echo ========================================
echo   i9Script - Sistema de Gestao e Suporte
echo ========================================
echo.

echo [1/2] Iniciando Backend (Porta 5000)...
start "i9Script Backend" cmd /k "cd server && npm run dev"
timeout /t 3 /nobreak > nul

echo [2/2] Iniciando Frontend (Porta 3001)...
start "i9Script Frontend" cmd /k "cd client && set PORT=3001 && npm start"

echo.
echo ========================================
echo   Servidores iniciados com sucesso!
echo ========================================
echo.
echo Landing Page: http://localhost:3001
echo Login: http://localhost:3001/login
echo API: http://localhost:5000/api
echo.
echo Credenciais:
echo Email: admin@i9script.com
echo Senha: admin123
echo.
echo Pressione qualquer tecla para abrir no navegador...
pause > nul

start http://localhost:3001

echo.
echo Aplicacao aberta no navegador!
echo Mantenha as janelas do servidor abertas.
echo.
pause

@echo off
chcp 65001 >nul
echo ==============================================
echo Workshop de Empreendedorismo - Desenvolvimento
echo ==============================================
echo.
echo Iniciando PostgreSQL pelo Docker...
docker compose up -d
if errorlevel 1 (
  echo.
  echo Nao foi possivel iniciar o Docker.
  echo Abra o Docker Desktop e tente novamente.
  pause
  exit /b 1
)

echo.
echo Instalando dependencias (se necessario)...
call npm install
if errorlevel 1 (
  echo Erro ao instalar as dependencias.
  pause
  exit /b 1
)

echo.
echo Preparando o banco de dados...
call npm run db:setup
if errorlevel 1 (
  echo Erro ao preparar o PostgreSQL/Prisma.
  pause
  exit /b 1
)

echo.
echo Abrindo o servidor em http://localhost:3000
echo Para parar, pressione Ctrl+C.
call npm run dev
pause

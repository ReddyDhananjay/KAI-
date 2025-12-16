@echo off
REM KAI Platform - Quick Start Script for Windows

echo ========================================
echo   Starting KAI Platform
echo ========================================
echo.

REM Check if .env exists in backend
if not exist "backend\.env" (
    echo WARNING: Backend .env file not found!
    echo Creating from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo Please edit backend\.env and add your OPENAI_API_KEY
    pause
    exit /b 1
)

REM Check if .env.local exists in frontend
if not exist "frontend\.env.local" (
    echo Creating frontend\.env.local from example...
    copy "frontend\.env.local.example" "frontend\.env.local"
)

REM Check if virtual environment exists
if not exist "backend\venv" (
    echo Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Check if node_modules exists
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Start backend
echo.
echo Starting Backend Server...
cd backend
call venv\Scripts\activate
pip install -r requirements.txt --quiet
start /B python main.py
cd ..

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend
echo.
echo Starting Frontend Server...
cd frontend
start /B npm run dev
cd ..

echo.
echo ========================================
echo   KAI Platform is running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop the servers
echo.

pause

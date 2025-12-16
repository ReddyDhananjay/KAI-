#!/bin/bash

# KAI Platform - Quick Start Script

echo "🚀 Starting KAI Platform..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists in backend
if [ ! -f "backend/.env" ]; then
    echo -e "${RED}⚠️  Backend .env file not found!${NC}"
    echo "Creating from .env.example..."
    cp backend/.env.example backend/.env
    echo -e "${RED}⚠️  Please edit backend/.env and add your OPENAI_API_KEY${NC}"
    exit 1
fi

# Check if .env.local exists in frontend
if [ ! -f "frontend/.env.local" ]; then
    echo "Creating frontend/.env.local from example..."
    cp frontend/.env.local.example frontend/.env.local
fi

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo -e "${BLUE}📦 Creating Python virtual environment...${NC}"
    cd backend
    python3 -m venv venv
    cd ..
fi

# Check if node_modules exists
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd frontend
    npm install
    cd ..
fi

# Start backend
echo -e "${GREEN}🔧 Starting Backend Server...${NC}"
cd backend
source venv/bin/activate
pip install -r requirements.txt --quiet
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Start frontend
echo -e "${GREEN}🎨 Starting Frontend Server...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo -e "${GREEN}✅ KAI Platform is running!${NC}"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend API: http://localhost:8000"
echo "📍 API Docs: http://localhost:8000/api/docs"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait

# KAI Platform - Quick Start Guide

Get KAI up and running in under 5 minutes!

## Prerequisites

- **Python 3.11+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## Quick Setup (Recommended)

### Option 1: Using Start Scripts

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```bash
start.bat
```

The script will:
1. Create environment files
2. Set up virtual environment
3. Install dependencies
4. Start both servers

### Option 2: Manual Setup

#### Step 1: Clone & Navigate
```bash
git clone <repository-url>
cd kai-platform
```

#### Step 2: Backend Setup (Terminal 1)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# OR Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Run server
python main.py
```

#### Step 3: Frontend Setup (Terminal 2)
```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.local.example .env.local

# Run server
npm run dev
```

## Access Your Application

Open your browser:

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/api/docs

## First Steps

### 1. Chat with KAI
1. Go to http://localhost:3000/chat
2. Try: "Show me best deals on smartphones"
3. KAI will search and compare across platforms!

### 2. Browse Deals
1. Visit http://localhost:3000/deals
2. Filter by category
3. View amazing discounts

### 3. Compare Products
1. Go to http://localhost:3000/compare
2. Enter "iPhone 15" or any product
3. See side-by-side comparison

## Configuration

### Add OpenAI API Key

Edit `backend/.env`:
```env
OPENAI_API_KEY=sk-your-key-here
```

Without this key, AI features will be limited.

### Change Ports (Optional)

**Backend** - Edit `backend/.env`:
```env
API_PORT=8000
```

**Frontend** - Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Docker Setup (Alternative)

If you prefer Docker:

```bash
# Set OpenAI key
export OPENAI_API_KEY=your_key_here

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Troubleshooting

### Backend won't start
- ✅ Check Python version: `python --version` (must be 3.11+)
- ✅ Verify virtual environment is activated
- ✅ Check `.env` file exists with OPENAI_API_KEY

### Frontend won't start
- ✅ Check Node version: `node --version` (must be 18+)
- ✅ Delete `node_modules` and run `npm install` again
- ✅ Check `.env.local` file exists

### "Connection refused" errors
- ✅ Make sure backend is running on port 8000
- ✅ Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- ✅ Check firewall settings

### AI responses not working
- ✅ Verify OPENAI_API_KEY is set correctly
- ✅ Check OpenAI API key is valid and has credits
- ✅ Check backend logs for errors

## Example Queries

Try these with KAI:

**Search & Compare:**
- "Show me running shoes under 3000"
- "Compare iPhone prices"
- "Best rated laptops under 50000"

**Deals:**
- "What are today's top deals?"
- "Show me fashion deals"
- "Any discounts on electronics?"

**Recommendations:**
- "Recommend a budget smartphone"
- "Suggest a gift under 2000"
- "I need a laptop for coding"

## Next Steps

1. **Customize** - Explore the code and make it yours
2. **Deploy** - See [DEPLOYMENT.md](DEPLOYMENT.md) for production setup
3. **Contribute** - Check [CONTRIBUTING.md](CONTRIBUTING.md) to contribute
4. **Learn More** - Read [ARCHITECTURE.md](ARCHITECTURE.md) for deep dive

## Getting Help

- 📖 [Full Documentation](README.md)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🚀 [Deployment Guide](DEPLOYMENT.md)
- 🤝 [Contributing Guide](CONTRIBUTING.md)

## Support

Having issues? 
- Create an issue on GitHub
- Check existing issues for solutions
- Contact: support@kai-shop.com

---

**Happy Shopping with KAI! 🛍️**

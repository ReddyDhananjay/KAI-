# KAI Backend - FastAPI + AI Agents

## Overview

The backend is built with FastAPI and implements an Agentic AI architecture using LangChain and OpenAI's GPT models.

## Architecture

### Master Agent (KAI)
The orchestrator that manages conversation flow and delegates tasks to worker agents.

### Worker Agents
1. **Recommendation Agent** - Product suggestions and search
2. **Comparison Agent** - Cross-platform price comparison
3. **Deals Agent** - Top deals aggregation
4. **Inventory Agent** - Stock availability checks
5. **Payment Agent** - Checkout processing
6. **Fulfillment Agent** - Order tracking
7. **Support Agent** - Customer support queries

## Setup

### Installation

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Configuration

Create `.env` file:

```env
OPENAI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./kai.db
DEBUG=True
```

### Run Server

```bash
# Development
python main.py

# Production
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Interactive API docs available at:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## Database

### Initialize Database

```bash
python -c "from models.database import init_db; from app.config import settings; init_db(settings.database_url)"
```

### Models
- User
- UserPreference
- Conversation
- Message
- Product
- Deal
- Order
- SearchHistory

## Platform Integrations

Currently supports mock integrations for:
- Amazon
- Flipkart
- Meesho
- Myntra
- Ajio

To integrate real APIs, update `services/platform_integrations.py`

## Testing

```bash
pytest tests/
```

## Deployment

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

- `OPENAI_API_KEY` - Required for AI features
- `DATABASE_URL` - Database connection string
- `REDIS_URL` - Cache connection (optional)
- `SECRET_KEY` - JWT secret key

## Performance

- Async operations for concurrent API calls
- Redis caching for product data
- Database connection pooling
- Request rate limiting

## Security

- CORS configuration
- API key validation
- SQL injection prevention
- Input sanitization
- HTTPS in production

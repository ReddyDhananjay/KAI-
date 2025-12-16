# KAI - Unified Conversational Commerce Platform

<div align="center">

![KAI Logo](https://img.shields.io/badge/KAI-Conversational%20Commerce-0ea5e9?style=for-the-badge&logo=shopify&logoColor=white)

**AI-powered shopping assistant that helps you find, compare, and buy products across multiple e-commerce platforms**

[![Made with Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Made with Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![LangChain](https://img.shields.io/badge/LangChain-AI-00ADD8?style=flat)](https://langchain.com/)

</div>

---

## 🌟 Features

### 🤖 Conversational AI Shopping
- Natural language chat interface powered by GPT-3.5/GPT-4
- Voice support for hands-free shopping
- Context-aware responses and personalized recommendations
- Multi-turn conversations with memory

### 💰 Multi-Platform Price Comparison
- **Supported Platforms:**
  - Amazon
  - Flipkart
  - Meesho
  - Myntra
  - Ajio
- Real-time price comparison
- Best deal identification
- Delivery time comparison
- Rating and review aggregation

### 🎯 Smart Recommendations
- AI-powered product suggestions
- Based on user preferences and budget
- Shopping history analysis
- Trending products
- Personalized deals

### 🔥 Top Deals of the Day
- Daily curated deals across all platforms
- Category-wise deal filtering
- Discount percentage tracking
- Limited-time offer alerts

### 🛒 Seamless Checkout
- Multi-platform order placement
- Secure payment processing
- Order tracking
- Purchase history

### 📊 Advanced Features
- Product comparison tables
- Price drop alerts
- Deal notifications
- User preference management
- Shopping analytics

---

## 🏗️ Architecture

### Agentic AI System

```
Master Agent (KAI)
    ├── Recommendation Agent    → Product suggestions
    ├── Comparison Agent        → Price comparison
    ├── Deals Agent            → Best deals finder
    ├── Inventory Agent        → Stock availability
    ├── Payment Agent          → Checkout processing
    ├── Fulfillment Agent      → Order tracking
    └── Support Agent          → Customer support
```

### Tech Stack

#### Backend
- **Framework:** FastAPI (Python)
- **AI/ML:** OpenAI GPT-3.5, LangChain
- **Database:** SQLite (development), PostgreSQL (production)
- **Caching:** Redis (optional)
- **APIs:** RESTful architecture

#### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **State Management:** Zustand
- **API Client:** Axios
- **UI Components:** Custom + Radix UI

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **OpenAI API Key** (required for AI features)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd kai-platform
```

#### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Initialize database
python -c "from models.database import init_db; from app.config import settings; init_db(settings.database_url)"

# Run the backend server
python main.py
```

The backend API will be available at `http://localhost:8000`

API Documentation: `http://localhost:8000/api/docs`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local if needed (default points to localhost:8000)

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

---

## 📖 Usage

### Chat with KAI

1. Navigate to the **Chat** page
2. Type your shopping query, for example:
   - "Show me best deals on smartphones"
   - "Compare iPhone prices across platforms"
   - "Recommend a laptop under ₹50000"
3. KAI will search, compare, and present the best options
4. Click on products to view details or purchase

### Compare Products

1. Go to the **Compare** page
2. Enter a product name
3. View side-by-side comparison across platforms
4. See best price, best rated, and fastest delivery options

### Browse Top Deals

1. Visit the **Deals** page
2. Filter by category
3. View all current deals with discount percentages
4. Click to view or purchase

### Manage Preferences

1. Go to **Profile** page
2. Set preferred platforms
3. Choose favorite categories
4. Set budget range
5. Configure notification preferences

---

## 🔧 Configuration

### Backend Configuration

Edit `backend/.env`:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Database
DATABASE_URL=sqlite:///./kai.db

# API Settings
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True

# Security
SECRET_KEY=your-secret-key-here
```

### Frontend Configuration

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📁 Project Structure

```
kai-platform/
├── backend/
│   ├── agents/              # AI agent implementations
│   │   ├── master_agent.py  # Main orchestrator
│   │   └── worker_agents.py # Specialized agents
│   ├── api/                 # API routes
│   │   └── routes.py
│   ├── app/                 # Application configuration
│   │   └── config.py
│   ├── models/              # Database models and schemas
│   │   ├── database.py
│   │   └── schemas.py
│   ├── services/            # Business logic
│   │   └── platform_integrations.py
│   ├── main.py             # FastAPI application
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js app directory
│   │   │   ├── page.tsx    # Landing page
│   │   │   ├── chat/       # Chat page
│   │   │   ├── deals/      # Deals page
│   │   │   ├── compare/    # Compare page
│   │   │   └── profile/    # Profile page
│   │   ├── components/     # React components
│   │   │   ├── ui/         # UI components
│   │   │   ├── chat/       # Chat components
│   │   │   ├── products/   # Product components
│   │   │   └── layout/     # Layout components
│   │   └── lib/            # Utilities and API clients
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## 🎨 Design Philosophy

### Minimalistic & Modern
- Clean, uncluttered interface
- Intuitive navigation
- Smooth animations and transitions
- Responsive design for all devices

### Conversational-First
- Chat as primary interaction method
- Natural language understanding
- Contextual responses
- Helpful suggestions

### Performance Optimized
- Fast load times
- Efficient API calls
- Optimized images
- Smooth scrolling

---

## 🔌 API Endpoints

### Chat API
- `POST /api/v1/chat` - Send message to KAI

### Search & Compare
- `POST /api/v1/search` - Search products
- `GET /api/v1/compare` - Compare products across platforms

### Deals & Recommendations
- `GET /api/v1/deals` - Get top deals
- `POST /api/v1/recommendations` - Get personalized recommendations

### Products & Orders
- `GET /api/v1/products/{id}` - Get product details
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/{id}` - Track order

### Metadata
- `GET /api/v1/categories` - Get categories
- `GET /api/v1/platforms` - Get platforms
- `GET /api/v1/health` - Health check

Full API documentation: `http://localhost:8000/api/docs`

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

---

## 🚢 Deployment

### Backend Deployment

**Docker:**
```bash
cd backend
docker build -t kai-backend .
docker run -p 8000:8000 --env-file .env kai-backend
```

**Cloud Platforms:**
- Deploy to AWS Lambda, Google Cloud Run, or Azure Functions
- Use managed PostgreSQL for production database
- Configure Redis for caching

### Frontend Deployment

**Vercel (Recommended):**
```bash
cd frontend
vercel deploy
```

**Other Platforms:**
- Deploy to Netlify, AWS Amplify, or any Node.js hosting
- Set environment variables in platform settings

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- OpenAI for GPT API
- LangChain for agent framework
- Next.js and React teams
- FastAPI community
- All open-source contributors

---

## 📞 Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@kai-shop.com

---

## 🎯 Roadmap

### Phase 1 (Current)
- ✅ Basic chat interface
- ✅ Multi-platform search
- ✅ Price comparison
- ✅ Top deals

### Phase 2 (Upcoming)
- [ ] Voice shopping
- [ ] AR product visualization
- [ ] Social sharing
- [ ] Group buying

### Phase 3 (Future)
- [ ] Mobile apps (iOS/Android)
- [ ] Browser extension
- [ ] WhatsApp integration
- [ ] Blockchain payments

---

<div align="center">

**Made with ❤️ by the KAI Team**

[Website](https://kai-shop.com) • [Documentation](https://docs.kai-shop.com) • [Twitter](https://twitter.com/kai_shop)

</div>

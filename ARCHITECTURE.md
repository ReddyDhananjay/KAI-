# KAI Platform - Architecture Documentation

## System Overview

KAI is a unified conversational commerce platform that uses Agentic AI to help users shop across multiple e-commerce platforms through natural language conversations.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Interface                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │    Chat      │  │    Deals     │  │   Compare    │         │
│  │  Interface   │  │     Page     │  │     Page     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                    Next.js 14 Frontend                          │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (FastAPI)                      │
│                    /api/v1/* endpoints                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Master Agent (KAI)                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  • Intent Recognition                                     │  │
│  │  • Conversation Management                                │  │
│  │  • Worker Agent Orchestration                             │  │
│  │  • Context Memory (LangChain)                             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┴───────────────┐
          ▼                              ▼
┌──────────────────┐          ┌──────────────────┐
│  Worker Agents   │          │   Services       │
│ ┌──────────────┐ │          │ ┌──────────────┐ │
│ │Recommendation│ │          │ │  Platform    │ │
│ │   Agent      │ │          │ │ Integrations │ │
│ ├──────────────┤ │          │ ├──────────────┤ │
│ │ Comparison   │ │          │ │   Amazon     │ │
│ │   Agent      │ │          │ │   Flipkart   │ │
│ ├──────────────┤ │          │ │   Meesho     │ │
│ │    Deals     │ │          │ │   Myntra     │ │
│ │   Agent      │ │          │ │   Ajio       │ │
│ ├──────────────┤ │          │ └──────────────┘ │
│ │  Inventory   │ │          └──────────────────┘
│ │   Agent      │ │
│ ├──────────────┤ │          ┌──────────────────┐
│ │   Payment    │ │          │    Database      │
│ │   Agent      │ │          │ ┌──────────────┐ │
│ ├──────────────┤ │          │ │    Users     │ │
│ │ Fulfillment  │ │          │ │Conversations │ │
│ │   Agent      │ │          │ │   Messages   │ │
│ ├──────────────┤ │          │ │   Products   │ │
│ │   Support    │ │          │ │    Deals     │ │
│ │   Agent      │ │          │ │   Orders     │ │
│ └──────────────┘ │          │ └──────────────┘ │
└──────────────────┘          └──────────────────┘
```

## Components

### 1. Frontend (Next.js 14)

**Technology Stack:**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

**Pages:**
- **Landing Page** - Marketing and onboarding
- **Chat Interface** - Main conversational commerce interface
- **Deals Page** - Curated deals display
- **Compare Page** - Price comparison tool
- **Profile Page** - User preferences and settings

**Key Features:**
- Server-side rendering (SSR)
- Optimistic UI updates
- Real-time chat interface
- Responsive design
- Smooth animations

### 2. Backend (FastAPI)

**Technology Stack:**
- FastAPI (Python 3.11+)
- SQLAlchemy (ORM)
- LangChain (Agent orchestration)
- OpenAI API (GPT-3.5/4)

**API Endpoints:**

```
/api/v1/
  ├── chat              POST   - Chat with KAI
  ├── search            POST   - Search products
  ├── compare           GET    - Compare products
  ├── deals             GET    - Get top deals
  ├── recommendations   POST   - Get recommendations
  ├── products/{id}     GET    - Product details
  ├── orders            POST   - Create order
  ├── orders/{id}       GET    - Track order
  ├── categories        GET    - List categories
  ├── platforms         GET    - List platforms
  └── health            GET    - Health check
```

### 3. AI Agent System

#### Master Agent (KAI)
The orchestrator that manages conversation flow.

**Responsibilities:**
- Parse user messages
- Determine intent
- Maintain conversation context
- Route to appropriate worker agents
- Generate responses
- Handle errors gracefully

**Technologies:**
- LangChain for orchestration
- OpenAI GPT for NLU
- Conversation buffer memory

#### Worker Agents

##### 1. Recommendation Agent
```python
Purpose: Suggest products based on preferences
Input: User query, category, budget, user context
Output: List of recommended products
Logic: 
  - Search across platforms
  - Filter by criteria
  - Rank by relevance
  - Personalize based on history
```

##### 2. Comparison Agent
```python
Purpose: Compare products across platforms
Input: Product query, platforms list
Output: Comparison matrix with best options
Logic:
  - Fetch same product from multiple platforms
  - Compare: price, rating, delivery
  - Identify best price, best rated, fastest
  - Generate comparison report
```

##### 3. Deals Agent
```python
Purpose: Find and curate top deals
Input: Category, limit
Output: List of current deals
Logic:
  - Aggregate deals from all platforms
  - Calculate savings percentage
  - Filter by category
  - Sort by discount
  - Mark featured deals
```

##### 4. Inventory Agent
```python
Purpose: Check product availability
Input: Product ID, platform
Output: Availability status, stock level
Logic:
  - Query platform APIs
  - Check stock levels
  - Estimate restock time
```

##### 5. Payment Agent
```python
Purpose: Handle checkout and payments
Input: Cart items, payment method
Output: Order confirmation
Logic:
  - Calculate totals
  - Process payment
  - Generate order number
  - Send confirmation
```

##### 6. Fulfillment Agent
```python
Purpose: Track orders and delivery
Input: Order ID
Output: Order status, tracking info
Logic:
  - Query order status
  - Provide tracking updates
  - Estimate delivery date
```

##### 7. Support Agent
```python
Purpose: Handle customer support queries
Input: User query
Output: Support response
Logic:
  - Use GPT for natural responses
  - Handle FAQs
  - Escalate complex issues
```

### 4. Platform Integration Layer

**Purpose:** Abstract e-commerce platform APIs

**Supported Platforms:**
- Amazon
- Flipkart
- Meesho
- Myntra
- Ajio

**Interface:**
```python
class PlatformIntegration:
    async def search_products(query, **kwargs)
    async def get_product_details(product_id)
    async def check_availability(product_id)
```

**Current Implementation:**
- Mock data for development
- Easy to swap with real APIs
- Async operations for performance

### 5. Database Schema

**Tables:**

```sql
-- Users
users (
    id, email, username, hashed_password,
    full_name, is_active, created_at
)

-- User Preferences
user_preferences (
    id, user_id, preferred_platforms,
    budget_range, favorite_categories,
    priority, deal_alerts, price_drop_alerts
)

-- Conversations
conversations (
    id, user_id, session_id, title,
    context, is_active, created_at, updated_at
)

-- Messages
messages (
    id, conversation_id, role, content,
    metadata, created_at
)

-- Products (Cache)
products (
    id, external_id, platform, name,
    description, category, brand, price,
    original_price, discount_percentage,
    rating, reviews_count, image_url,
    product_url, availability, specifications,
    delivery_time, cached_at, expires_at
)

-- Deals
deals (
    id, product_id, title, description,
    deal_price, original_price, savings_percentage,
    valid_from, valid_until, is_active,
    category, featured
)

-- Orders
orders (
    id, user_id, order_number, platform,
    total_amount, status, items,
    shipping_address, billing_address,
    payment_method, payment_status,
    created_at, updated_at
)

-- Search History
search_history (
    id, user_id, query, category,
    filters, results_count, created_at
)
```

## Data Flow

### Chat Flow

```
1. User types message in chat
   ↓
2. Frontend sends POST /api/v1/chat
   ↓
3. Master Agent receives message
   ↓
4. Intent recognition (GPT)
   ↓
5. Route to appropriate worker agent
   ↓
6. Worker agent processes request
   │ • Search products
   │ • Compare prices
   │ • Fetch deals
   ↓
7. Worker agent returns results
   ↓
8. Master Agent generates response
   ↓
9. Response sent to frontend
   ↓
10. UI updates with:
    • AI message
    • Product cards
    • Suggestions
```

### Search & Compare Flow

```
1. User submits search/compare query
   ↓
2. API call to backend
   ↓
3. Platform Integration Service
   ↓
4. Parallel API calls to platforms
   ↓
5. Aggregate results
   ↓
6. Apply filters
   ↓
7. Sort and rank
   ↓
8. Return to frontend
   ↓
9. Display products/comparison
```

## Security Architecture

### Authentication & Authorization
- JWT-based authentication (future)
- Session management
- Secure password hashing (bcrypt)

### API Security
- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Data Security
- Environment variables for secrets
- HTTPS in production
- Database encryption
- Secure cookie settings

## Performance Optimizations

### Backend
- Async/await for concurrent operations
- Database connection pooling
- Redis caching (optional)
- Query optimization
- Pagination

### Frontend
- Server-side rendering (SSR)
- Code splitting
- Image optimization
- Lazy loading
- Optimistic updates

### Caching Strategy

```
Product Cache:
- TTL: 1 hour
- Invalidation: On price change

Deals Cache:
- TTL: 5 minutes
- Invalidation: On deal expiry

User Session:
- TTL: 30 minutes
- Stored in memory
```

## Scalability

### Horizontal Scaling
- Stateless backend (multiple instances)
- Load balancer
- Database read replicas
- Redis for shared session storage

### Vertical Scaling
- Optimize queries
- Database indexing
- Connection pooling
- Worker processes

## Monitoring & Logging

### Metrics to Track
- API response times
- Error rates
- User engagement
- Conversion rates
- Platform uptime

### Logging
- Structured logging
- Error tracking (Sentry)
- Performance monitoring
- User activity logs

## Future Enhancements

### Phase 2
- Voice shopping
- AR product visualization
- Social sharing
- Group buying

### Phase 3
- Mobile apps (iOS/Android)
- Browser extension
- WhatsApp integration
- Blockchain payments

### Technical Debt
- Real platform API integrations
- Advanced caching strategies
- Microservices architecture
- Event-driven architecture
- GraphQL API

## Development Workflow

```
1. Feature branch from main
2. Implement changes
3. Write tests
4. Run linters
5. Create PR
6. Code review
7. CI/CD pipeline
   - Run tests
   - Build containers
   - Deploy to staging
8. QA testing
9. Deploy to production
10. Monitor metrics
```

## Deployment Architecture

### Development
```
Localhost:
- Backend: localhost:8000
- Frontend: localhost:3000
- Database: SQLite
```

### Production
```
Cloud Infrastructure:
- Backend: AWS/GCP/Azure (containerized)
- Frontend: Vercel/Netlify (CDN)
- Database: PostgreSQL (managed)
- Cache: Redis (managed)
- Storage: S3/Cloud Storage
```

---

**Last Updated:** December 2025
**Version:** 1.0.0

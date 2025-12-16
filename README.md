# KAI - Smart Retail Shopping Assistant 🤖

An AI-powered shopping assistant website featuring a live chatbot, product catalog, mock ordering system, and admin panel.

## Features

### 🏠 Landing Page (Homepage)
- Hero banner introducing KAI
- Featured products section
- Hot deals display
- How KAI helps you section
- Quick access to chat

### 💬 Live KAI Chatbot
- Modern WhatsApp-like chat interface
- AI-powered responses (OpenRouter API integration)
- Quick action buttons for common requests
- Product recommendations
- Deal finder
- Mock order creation
- Chat history saved locally
- Sidebar with popular products and offers

### 📦 Products Page
- Full product catalog with 12+ items
- Category filtering (Electronics, Wearables, Accessories, Bags, Shoes)
- Search functionality
- Sort options (price, rating, popularity)
- Product cards with images, ratings, and prices

### 📋 Product Details Page
- Large product images
- Full specifications
- Rating and reviews
- Stock availability
- Mock "Buy Now" with order creation
- "Ask KAI" button integration
- Related products

### 🛒 Orders Page
- Order history display
- Order status tracking (Processing → Shipped → Delivered)
- Visual timeline
- Order statistics
- Filter by status
- Cancel order functionality

### ⚙️ Admin Panel
- Dashboard with statistics
- Products management (Add/Edit/Delete)
- Orders management (Update status)
- Low stock alerts
- Recent orders view

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **AI Integration**: OpenRouter API (Claude 3.5 Sonnet)
- **Database**: JSON files (mock database)

## Getting Started

### Prerequisites

- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. Clone or download the repository

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

4. (Optional) Add your OpenRouter API key to `.env`:
```
OPENROUTER_API_KEY=your_api_key_here
```

> Note: The chatbot works without an API key using mock responses.

### Running the Server

```bash
npm start
```

The server will start at `http://localhost:3000`

## Available Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/chat` | KAI Chatbot |
| `/products` | Product Catalog |
| `/product/:id` | Product Details |
| `/orders` | Order History |
| `/admin` | Admin Panel |

## API Endpoints

### Products
- `GET /api/products` - Get all products (supports query params: category, featured, deal, search)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status
- `DELETE /api/orders/:id` - Cancel order

### Chat
- `POST /api/chat` - Send message to KAI

## Product Categories

- 📱 Electronics (Earbuds, Speakers, Headphones)
- ⌚ Wearables (Smartwatches, Fitness Trackers)
- 🎧 Accessories (Belts, Sunglasses)
- 🎒 Bags (Backpacks, Messenger Bags)
- 👟 Shoes (Athletic, Casual)

## KAI Chatbot Capabilities

KAI can:
- ✅ Recommend products based on preferences
- ✅ Show product details and specifications
- ✅ Find current deals and discounts
- ✅ Compare products
- ✅ Create mock orders with tracking
- ✅ Answer product-related questions
- ✅ Generate sample products for items not in database

## Project Structure

```
/workspace/
├── server.js           # Express server & API routes
├── package.json        # Dependencies
├── .env               # Environment variables
├── index.html         # Homepage
├── chat.html          # KAI Chatbot page
├── products.html      # Products catalog
├── product-details.html # Product details page
├── orders.html        # Orders page
├── admin.html         # Admin panel
├── styles.css         # All styles
├── script.js          # Frontend JavaScript
└── data/
    ├── products.json  # Product database
    └── orders.json    # Orders database
```

## Screenshots

The website features a modern dark theme with gradient accents, smooth animations, and responsive design that works on all devices.

## Credits

Built by **Team RTX** - SRM University, Andhra Pradesh

---

**Note**: This is a demonstration project. All orders and transactions are simulated (mock data).

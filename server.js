// ===============================================
// KAI Shopping Assistant - Express Server
// ===============================================

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Data file paths
const PRODUCTS_FILE = path.join(__dirname, 'data', 'products.json');
const ORDERS_FILE = path.join(__dirname, 'data', 'orders.json');

// ===============================================
// HELPER FUNCTIONS
// ===============================================

function readJSON(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return null;
    }
}

function writeJSON(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
}

// ===============================================
// PRODUCTS API ROUTES
// ===============================================

// GET /api/products - Get all products
app.get('/api/products', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }
    
    let products = data.products;
    
    // Filter by category if provided
    const { category, featured, deal, search } = req.query;
    
    if (category) {
        products = products.filter(p => 
            p.category.toLowerCase() === category.toLowerCase()
        );
    }
    
    if (featured === 'true') {
        products = products.filter(p => p.featured);
    }
    
    if (deal === 'true') {
        products = products.filter(p => p.deal);
    }
    
    if (search) {
        const searchLower = search.toLowerCase();
        products = products.filter(p => 
            p.name.toLowerCase().includes(searchLower) ||
            p.description.toLowerCase().includes(searchLower) ||
            p.category.toLowerCase().includes(searchLower)
        );
    }
    
    res.json({ products, categories: data.categories });
});

// GET /api/products/:id - Get single product
app.get('/api/products/:id', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }
    
    const product = data.products.find(p => p.id === req.params.id);
    
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
});

// GET /api/categories - Get all categories
app.get('/api/categories', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read categories' });
    }
    
    res.json(data.categories);
});

// POST /api/products - Add new product (Admin)
app.post('/api/products', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }
    
    const newProduct = {
        id: `prod-${uuidv4().slice(0, 8)}`,
        ...req.body,
        rating: req.body.rating || 0,
        reviews: req.body.reviews || 0,
        featured: req.body.featured || false,
        deal: req.body.deal || false
    };
    
    data.products.push(newProduct);
    
    if (writeJSON(PRODUCTS_FILE, data)) {
        res.status(201).json(newProduct);
    } else {
        res.status(500).json({ error: 'Failed to save product' });
    }
});

// PUT /api/products/:id - Update product (Admin)
app.put('/api/products/:id', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }
    
    const index = data.products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    data.products[index] = { ...data.products[index], ...req.body };
    
    if (writeJSON(PRODUCTS_FILE, data)) {
        res.json(data.products[index]);
    } else {
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE /api/products/:id - Delete product (Admin)
app.delete('/api/products/:id', (req, res) => {
    const data = readJSON(PRODUCTS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read products' });
    }
    
    const index = data.products.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }
    
    data.products.splice(index, 1);
    
    if (writeJSON(PRODUCTS_FILE, data)) {
        res.json({ message: 'Product deleted successfully' });
    } else {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ===============================================
// ORDERS API ROUTES
// ===============================================

// GET /api/orders - Get all orders
app.get('/api/orders', (req, res) => {
    const data = readJSON(ORDERS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }
    
    let orders = data.orders;
    
    // Filter by status if provided
    const { status } = req.query;
    if (status) {
        orders = orders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    }
    
    // Sort by date (newest first)
    orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    
    res.json({ orders });
});

// GET /api/orders/:id - Get single order
app.get('/api/orders/:id', (req, res) => {
    const data = readJSON(ORDERS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }
    
    const order = data.orders.find(o => o.id === req.params.id);
    
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
});

// POST /api/orders - Create new order
app.post('/api/orders', (req, res) => {
    const data = readJSON(ORDERS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }
    
    // Generate order ID
    const orderCount = data.orders.length + 1;
    const orderId = `ORD-2024-${String(orderCount).padStart(3, '0')}`;
    
    // Calculate estimated delivery (3-5 business days)
    const orderDate = new Date();
    const deliveryDays = Math.floor(Math.random() * 3) + 3;
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
    
    const newOrder = {
        id: orderId,
        productId: req.body.productId,
        productName: req.body.productName,
        productImage: req.body.productImage || 'https://via.placeholder.com/400',
        quantity: req.body.quantity || 1,
        price: req.body.price,
        status: 'Processing',
        orderDate: orderDate.toISOString(),
        estimatedDelivery: estimatedDelivery.toISOString(),
        deliveredDate: null,
        shippingAddress: req.body.shippingAddress || '123 Demo Street, City, ST 12345',
        createdVia: req.body.createdVia || 'chatbot'
    };
    
    data.orders.push(newOrder);
    
    if (writeJSON(ORDERS_FILE, data)) {
        res.status(201).json(newOrder);
    } else {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// PUT /api/orders/:id - Update order status (Admin)
app.put('/api/orders/:id', (req, res) => {
    const data = readJSON(ORDERS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }
    
    const index = data.orders.findIndex(o => o.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    // Update order
    data.orders[index] = { ...data.orders[index], ...req.body };
    
    // If status changed to Delivered, set delivered date
    if (req.body.status === 'Delivered' && !data.orders[index].deliveredDate) {
        data.orders[index].deliveredDate = new Date().toISOString();
    }
    
    if (writeJSON(ORDERS_FILE, data)) {
        res.json(data.orders[index]);
    } else {
        res.status(500).json({ error: 'Failed to update order' });
    }
});

// DELETE /api/orders/:id - Cancel/Delete order
app.delete('/api/orders/:id', (req, res) => {
    const data = readJSON(ORDERS_FILE);
    if (!data) {
        return res.status(500).json({ error: 'Failed to read orders' });
    }
    
    const index = data.orders.findIndex(o => o.id === req.params.id);
    
    if (index === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }
    
    // Mark as cancelled instead of deleting
    data.orders[index].status = 'Cancelled';
    
    if (writeJSON(ORDERS_FILE, data)) {
        res.json({ message: 'Order cancelled successfully', order: data.orders[index] });
    } else {
        res.status(500).json({ error: 'Failed to cancel order' });
    }
});

// ===============================================
// CHAT API ROUTE (OpenRouter Integration)
// ===============================================

// System prompt for KAI
const KAI_SYSTEM_PROMPT = `You are KAI, a smart and friendly AI shopping assistant for a retail store. Your personality is helpful, knowledgeable, and enthusiastic about helping customers find the perfect products.

Your capabilities:
1. **Product Recommendations**: Suggest products based on user preferences, needs, or budget
2. **Product Information**: Provide detailed information about products including specs, features, and comparisons
3. **Deal Finder**: Highlight current deals and help users find the best prices
4. **Mock Ordering**: Create mock orders with realistic order IDs, prices, and delivery estimates
5. **General Assistance**: Answer questions about shipping, returns, and store policies

When recommending products, always be specific and include:
- Product name and key features
- Price information
- Why it's a good choice for the user

When creating mock orders, include:
- A realistic order ID (format: ORD-2024-XXX)
- Product name and price
- Estimated delivery date (3-5 business days from now)
- A confirmation message

Product Categories Available:
- Electronics (earbuds, speakers, headphones)
- Wearables (smartwatches, fitness trackers)
- Bags (backpacks, messenger bags)
- Accessories (belts, sunglasses)
- Shoes (athletic, casual)

If a user asks about a product not in the database, create a realistic sample product with appropriate pricing and features.

Always be conversational, helpful, and try to understand what the customer really needs. Use emojis occasionally to be friendly but not excessive.`;

app.post('/api/chat', async (req, res) => {
    const { message, history = [] } = req.body;
    
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get products data for context
    const productsData = readJSON(PRODUCTS_FILE);
    const products = productsData ? productsData.products : [];
    
    // Create product context
    const productContext = products.map(p => 
        `${p.name} (${p.category}): $${p.price} - ${p.description.substring(0, 100)}...`
    ).join('\n');
    
    const enhancedSystemPrompt = `${KAI_SYSTEM_PROMPT}

CURRENT PRODUCT CATALOG:
${productContext}

Remember to reference actual products when relevant, but feel free to create sample products if the user asks for something not in the catalog.`;

    // Prepare messages for OpenRouter
    const messages = [
        { role: 'system', content: enhancedSystemPrompt },
        ...history.map(h => ({
            role: h.role,
            content: h.content
        })),
        { role: 'user', content: message }
    ];
    
    // Check if OpenRouter API key is configured
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
        // Fallback to mock responses if no API key
        const mockResponse = generateMockResponse(message, products);
        return res.json({
            message: mockResponse,
            timestamp: new Date().toISOString()
        });
    }
    
    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'HTTP-Referer': 'http://localhost:3000',
                'X-Title': 'KAI Shopping Assistant',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'anthropic/claude-3.5-sonnet',
                messages: messages,
                max_tokens: 1024,
                temperature: 0.7
            })
        });
        
        if (!response.ok) {
            throw new Error(`OpenRouter API error: ${response.status}`);
        }
        
        const data = await response.json();
        const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I encountered an issue. Please try again.';
        
        res.json({
            message: aiMessage,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Chat API error:', error);
        
        // Fallback to mock response on error
        const mockResponse = generateMockResponse(message, products);
        res.json({
            message: mockResponse,
            timestamp: new Date().toISOString()
        });
    }
});

// ===============================================
// MOCK RESPONSE GENERATOR (Fallback)
// ===============================================

function generateMockResponse(message, products) {
    const lowerMessage = message.toLowerCase();
    
    // Greeting responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        return "👋 Hello! I'm KAI, your smart shopping assistant! I'm here to help you discover amazing products, find great deals, and make your shopping experience delightful. What are you looking for today?";
    }
    
    // Product recommendation
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('looking for')) {
        const featuredProducts = products.filter(p => p.featured).slice(0, 3);
        if (featuredProducts.length > 0) {
            let response = "🌟 Here are some of our top recommendations:\n\n";
            featuredProducts.forEach(p => {
                response += `**${p.name}** - $${p.price}\n${p.description.substring(0, 80)}...\n\n`;
            });
            response += "Would you like more details about any of these products?";
            return response;
        }
    }
    
    // Deals
    if (lowerMessage.includes('deal') || lowerMessage.includes('discount') || lowerMessage.includes('sale')) {
        const dealProducts = products.filter(p => p.deal).slice(0, 3);
        if (dealProducts.length > 0) {
            let response = "🔥 **Hot Deals Just For You!**\n\n";
            dealProducts.forEach(p => {
                const savings = (p.originalPrice - p.price).toFixed(2);
                response += `**${p.name}**\n~~$${p.originalPrice}~~ → **$${p.price}** (Save $${savings}!)\n\n`;
            });
            response += "These deals won't last long! Want me to create an order for any of these?";
            return response;
        }
    }
    
    // Popular items
    if (lowerMessage.includes('popular') || lowerMessage.includes('best') || lowerMessage.includes('top')) {
        const popularProducts = [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 3);
        if (popularProducts.length > 0) {
            let response = "⭐ **Our Most Popular Products:**\n\n";
            popularProducts.forEach(p => {
                response += `**${p.name}** - $${p.price}\n⭐ ${p.rating}/5 (${p.reviews.toLocaleString()} reviews)\n\n`;
            });
            response += "Our customers love these! Would you like to know more about any of them?";
            return response;
        }
    }
    
    // Order creation
    if (lowerMessage.includes('order') || lowerMessage.includes('buy') || lowerMessage.includes('purchase')) {
        const orderId = `ORD-2024-${String(Math.floor(Math.random() * 900) + 100).padStart(3, '0')}`;
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + Math.floor(Math.random() * 3) + 3);
        
        return `🛒 **Mock Order Created!**\n\n📦 **Order ID:** ${orderId}\n📅 **Estimated Delivery:** ${deliveryDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}\n\nTo complete a real order, please tell me which product you'd like, and I'll set everything up for you! You can browse our catalog or ask me for recommendations.`;
    }
    
    // Category queries
    const categories = ['electronics', 'wearables', 'bags', 'accessories', 'shoes'];
    for (const category of categories) {
        if (lowerMessage.includes(category)) {
            const categoryProducts = products.filter(p => 
                p.category.toLowerCase() === category
            ).slice(0, 3);
            
            if (categoryProducts.length > 0) {
                let response = `📦 **${category.charAt(0).toUpperCase() + category.slice(1)} Collection:**\n\n`;
                categoryProducts.forEach(p => {
                    response += `• **${p.name}** - $${p.price}\n`;
                });
                response += "\nWould you like details on any of these?";
                return response;
            }
        }
    }
    
    // Specific product search
    for (const product of products) {
        if (lowerMessage.includes(product.name.toLowerCase().split(' ')[0].toLowerCase())) {
            return `📱 **${product.name}**\n\n💰 **Price:** $${product.price} ${product.deal ? `(was $${product.originalPrice})` : ''}\n⭐ **Rating:** ${product.rating}/5 (${product.reviews.toLocaleString()} reviews)\n📦 **Stock:** ${product.stock} units available\n\n**Description:**\n${product.description}\n\n**Key Specs:**\n${Object.entries(product.specs || {}).map(([k, v]) => `• ${k}: ${v}`).join('\n')}\n\nWould you like me to create an order for this product?`;
        }
    }
    
    // Help
    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        return "🤖 **I'm KAI, and here's how I can help you:**\n\n• 🔍 **Find Products** - Tell me what you're looking for\n• 💡 **Get Recommendations** - I'll suggest items based on your needs\n• 🏷️ **Find Deals** - Discover the best discounts\n• ⭐ **Popular Items** - See what other customers love\n• 🛒 **Create Orders** - I can set up mock orders for you\n• ❓ **Answer Questions** - Ask me anything about our products!\n\nJust type what you need, and I'll help you find it!";
    }
    
    // Default response
    return "I'd be happy to help you with that! 😊 I can help you:\n\n• Find specific products\n• Get personalized recommendations\n• Discover today's best deals\n• Create mock orders\n• Compare products\n\nWhat would you like to explore?";
}

// ===============================================
// PAGE ROUTES
// ===============================================

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'chat.html'));
});

app.get('/products', (req, res) => {
    res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/product/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'product-details.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'orders.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// ===============================================
// START SERVER
// ===============================================

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🤖 KAI Shopping Assistant Server                        ║
║                                                           ║
║   Server running on http://localhost:${PORT}                 ║
║                                                           ║
║   Available Routes:                                       ║
║   • Homepage:     http://localhost:${PORT}/                  ║
║   • Chat:         http://localhost:${PORT}/chat              ║
║   • Products:     http://localhost:${PORT}/products          ║
║   • Orders:       http://localhost:${PORT}/orders            ║
║   • Admin:        http://localhost:${PORT}/admin             ║
║                                                           ║
║   API Endpoints:                                          ║
║   • GET  /api/products                                    ║
║   • GET  /api/products/:id                                ║
║   • POST /api/chat                                        ║
║   • GET  /api/orders                                      ║
║   • POST /api/orders                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});

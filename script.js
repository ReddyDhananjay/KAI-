// ===================================
// GLOBAL STATE & CONFIGURATION
// ===================================

const APP_STATE = {
    currentPage: 'home',
    chatHistory: [],
    userPreferences: {
        priceAlerts: true,
        dealNotifications: true,
        voiceShopping: false,
        personalizedRecommendations: true
    },
    searchHistory: [],
    isTyping: false
};

const PLATFORMS = ['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'Ajio'];

// Mock product database
const MOCK_PRODUCTS = {
    'shoes': [
        { name: 'Nike Air Max Running Shoes', category: 'footwear', price: 3999, originalPrice: 7999, rating: 4.5, reviews: 1234, platform: 'Amazon', discount: 50, emoji: '👟' },
        { name: 'Adidas Ultraboost Sneakers', category: 'footwear', price: 4499, originalPrice: 8999, rating: 4.7, reviews: 890, platform: 'Flipkart', discount: 50, emoji: '👟' },
        { name: 'Puma Sports Shoes', category: 'footwear', price: 2499, originalPrice: 4999, rating: 4.3, reviews: 567, platform: 'Myntra', discount: 50, emoji: '👟' }
    ],
    'phone': [
        { name: 'iPhone 15 Pro (128GB)', category: 'electronics', price: 129900, originalPrice: 134900, rating: 4.8, reviews: 3456, platform: 'Amazon', discount: 4, emoji: '📱' },
        { name: 'iPhone 15 Pro (128GB)', category: 'electronics', price: 128900, originalPrice: 134900, rating: 4.8, reviews: 2890, platform: 'Flipkart', discount: 4, emoji: '📱' },
        { name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price: 124999, originalPrice: 139999, rating: 4.7, reviews: 2134, platform: 'Amazon', discount: 11, emoji: '📱' }
    ],
    'laptop': [
        { name: 'MacBook Air M2', category: 'electronics', price: 99900, originalPrice: 119900, rating: 4.9, reviews: 1567, platform: 'Amazon', discount: 17, emoji: '💻' },
        { name: 'Dell XPS 13', category: 'electronics', price: 89990, originalPrice: 109990, rating: 4.6, reviews: 890, platform: 'Flipkart', discount: 18, emoji: '💻' },
        { name: 'HP Pavilion 15', category: 'electronics', price: 45999, originalPrice: 65999, rating: 4.4, reviews: 1234, platform: 'Amazon', discount: 30, emoji: '💻' }
    ],
    'watch': [
        { name: 'Noise ColorFit Pro 4', category: 'electronics', price: 2499, originalPrice: 4999, rating: 4.3, reviews: 8900, platform: 'Amazon', discount: 50, emoji: '⌚' },
        { name: 'boAt Wave Pro', category: 'electronics', price: 1999, originalPrice: 3999, rating: 4.2, reviews: 6700, platform: 'Flipkart', discount: 50, emoji: '⌚' },
        { name: 'Fire-Boltt Phoenix Ultra', category: 'electronics', price: 1799, originalPrice: 3499, rating: 4.1, reviews: 5600, platform: 'Meesho', discount: 49, emoji: '⌚' }
    ],
    'headphones': [
        { name: 'Sony WH-1000XM5', category: 'electronics', price: 26990, originalPrice: 34990, rating: 4.8, reviews: 2340, platform: 'Amazon', discount: 23, emoji: '🎧' },
        { name: 'JBL Tune 760NC', category: 'electronics', price: 5999, originalPrice: 9999, rating: 4.5, reviews: 1890, platform: 'Flipkart', discount: 40, emoji: '🎧' },
        { name: 'boAt Rockerz 550', category: 'electronics', price: 1499, originalPrice: 2990, rating: 4.2, reviews: 5670, platform: 'Amazon', discount: 50, emoji: '🎧' }
    ]
};

// Top deals data
const TOP_DEALS = [
    { id: 1, name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price: 124999, originalPrice: 139999, rating: 4.7, reviews: 2134, platform: 'Amazon', discount: 11, emoji: '📱' },
    { id: 2, name: 'Nike Air Max Running Shoes', category: 'fashion', price: 3999, originalPrice: 7999, rating: 4.5, reviews: 1234, platform: 'Amazon', discount: 50, emoji: '👟' },
    { id: 3, name: 'Sony WH-1000XM5 Headphones', category: 'electronics', price: 26990, originalPrice: 34990, rating: 4.8, reviews: 2340, platform: 'Amazon', discount: 23, emoji: '🎧' },
    { id: 4, name: 'Levi\'s Denim Jacket', category: 'fashion', price: 2499, originalPrice: 5999, rating: 4.4, reviews: 890, platform: 'Myntra', discount: 58, emoji: '🧥' },
    { id: 5, name: 'Prestige Induction Cooktop', category: 'home', price: 1899, originalPrice: 3499, rating: 4.3, reviews: 3456, platform: 'Flipkart', discount: 46, emoji: '🍳' },
    { id: 6, name: 'Lakme Makeup Kit', category: 'beauty', price: 999, originalPrice: 1999, rating: 4.5, reviews: 5678, platform: 'Meesho', discount: 50, emoji: '💄' },
    { id: 7, name: 'Noise ColorFit Pro 4 Smartwatch', category: 'electronics', price: 2499, originalPrice: 4999, rating: 4.3, reviews: 8900, platform: 'Amazon', discount: 50, emoji: '⌚' },
    { id: 8, name: 'Puma Sports T-Shirt', category: 'fashion', price: 599, originalPrice: 1299, rating: 4.2, reviews: 1567, platform: 'Ajio', discount: 54, emoji: '👕' },
    { id: 9, name: 'Philips Air Fryer', category: 'home', price: 5999, originalPrice: 10999, rating: 4.6, reviews: 2890, platform: 'Amazon', discount: 45, emoji: '🍟' },
    { id: 10, name: 'Himalaya Face Wash Combo', category: 'beauty', price: 299, originalPrice: 599, rating: 4.4, reviews: 12340, platform: 'Flipkart', discount: 50, emoji: '🧴' },
    { id: 11, name: 'Milton Water Bottle Set', category: 'daily', price: 499, originalPrice: 999, rating: 4.3, reviews: 4567, platform: 'Amazon', discount: 50, emoji: '🍶' },
    { id: 12, name: 'Surf Excel Detergent 4kg', category: 'daily', price: 399, originalPrice: 599, rating: 4.5, reviews: 8901, platform: 'Flipkart', discount: 33, emoji: '🧼' }
];

// AI Response Templates
const AI_RESPONSES = {
    greeting: [
        "Hello! I'm KAI, your personal shopping assistant. How can I help you find the perfect product today?",
        "Hi there! Ready to discover amazing deals? What are you looking for?",
        "Welcome! I'm here to help you shop smarter. What can I find for you?"
    ],
    searching: [
        "Let me search across all platforms for you... 🔍",
        "Comparing prices on Amazon, Flipkart, Myntra, and more... ⚡",
        "Finding the best deals for you... 💫"
    ],
    notFound: [
        "I couldn't find exact matches, but here are some similar products you might like!",
        "No exact results found. Let me show you some alternatives that might interest you."
    ],
    recommendation: [
        "Based on your preferences, I recommend these products:",
        "Here are my top picks for you:",
        "These are currently trending and highly rated:"
    ]
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    attachEventListeners();
    loadDeals();
});

function initializeApp() {
    // Show home page by default
    navigateToPage('home');
    
    // Load user preferences from localStorage if available
    const savedPreferences = localStorage.getItem('kai_preferences');
    if (savedPreferences) {
        APP_STATE.userPreferences = JSON.parse(savedPreferences);
    }
    
    // Load search history
    const savedHistory = localStorage.getItem('kai_search_history');
    if (savedHistory) {
        APP_STATE.searchHistory = JSON.parse(savedHistory);
    }
}

// ===================================
// EVENT LISTENERS
// ===================================

function attachEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Hero CTA buttons
    document.getElementById('startChatBtn')?.addEventListener('click', () => navigateToPage('chat'));
    document.getElementById('viewDealsBtn')?.addEventListener('click', () => navigateToPage('deals'));
    
    // Chat functionality
    document.getElementById('sendBtn')?.addEventListener('click', sendMessage);
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
    
    // Suggestion chips
    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const query = chip.dataset.query;
            document.getElementById('chatInput').value = query;
            sendMessage();
        });
    });
    
    // Voice button
    document.getElementById('voiceBtn')?.addEventListener('click', handleVoiceInput);
    
    // Clear chat
    document.getElementById('clearChatBtn')?.addEventListener('click', clearChat);
    
    // New chat
    document.getElementById('newChatBtn')?.addEventListener('click', clearChat);
    
    // Deals filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            filterDeals(category);
        });
    });
    
    // Compare search
    document.getElementById('compareSearchBtn')?.addEventListener('click', performComparison);
    document.getElementById('compareSearchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performComparison();
        }
    });
}

// ===================================
// NAVIGATION
// ===================================

function navigateToPage(pageName) {
    // Update state
    APP_STATE.currentPage = pageName;
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // Update navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === pageName) {
            link.classList.add('active');
        }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
}

// ===================================
// CHAT FUNCTIONALITY
// ===================================

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    
    // Clear input
    input.value = '';
    
    // Add to search history
    addToSearchHistory(message);
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process message and generate AI response
    setTimeout(() => {
        hideTypingIndicator();
        processUserQuery(message);
    }, 1500);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = sender === 'ai' ? '🤖' : '👤';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.innerHTML = message;
    
    const time = document.createElement('div');
    time.className = 'message-time';
    time.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    content.appendChild(bubble);
    content.appendChild(time);
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    APP_STATE.isTyping = true;
    const chatMessages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="message-bubble">
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function hideTypingIndicator() {
    APP_STATE.isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function processUserQuery(query) {
    const lowerQuery = query.toLowerCase();
    
    // Detect intent
    if (lowerQuery.includes('deal') || lowerQuery.includes('offer') || lowerQuery.includes('discount')) {
        showDealsResponse();
    } else if (lowerQuery.includes('compare') && (lowerQuery.includes('price') || lowerQuery.includes('iphone'))) {
        const searchTerm = extractSearchTerm(lowerQuery);
        showComparisonResponse(searchTerm || 'phone');
    } else if (lowerQuery.includes('recommend') || lowerQuery.includes('suggest')) {
        const searchTerm = extractSearchTerm(lowerQuery);
        showRecommendationResponse(searchTerm || 'watch');
    } else {
        // General product search
        const searchTerm = extractSearchTerm(lowerQuery);
        if (searchTerm) {
            showProductSearchResponse(searchTerm);
        } else {
            addMessageToChat(getRandomResponse(AI_RESPONSES.greeting), 'ai');
        }
    }
}

function extractSearchTerm(query) {
    const keywords = ['shoes', 'phone', 'laptop', 'watch', 'headphones', 'iphone'];
    for (const keyword of keywords) {
        if (query.includes(keyword)) {
            return keyword === 'iphone' ? 'phone' : keyword;
        }
    }
    return null;
}

function showProductSearchResponse(searchTerm) {
    const products = MOCK_PRODUCTS[searchTerm] || MOCK_PRODUCTS['shoes'];
    
    let response = `${getRandomResponse(AI_RESPONSES.searching)}<br><br>`;
    response += `I found ${products.length} great options for you! Here are the best deals:<br>`;
    
    addMessageToChat(response, 'ai');
    
    // Add product cards
    products.forEach(product => {
        addProductCard(product);
    });
    
    // Add follow-up message
    setTimeout(() => {
        addMessageToChat('Would you like me to show you more options or help you with anything else? 😊', 'ai');
    }, 500);
}

function showComparisonResponse(searchTerm) {
    const products = MOCK_PRODUCTS[searchTerm] || MOCK_PRODUCTS['phone'];
    
    let response = 'I\'ve compared prices across all major platforms! Here\'s what I found:<br><br>';
    const bestDeal = products.reduce((min, p) => p.price < min.price ? p : min);
    response += `💡 <strong>Best Deal:</strong> ${bestDeal.name} on ${bestDeal.platform} for ₹${bestDeal.price.toLocaleString('en-IN')}<br>`;
    
    addMessageToChat(response, 'ai');
    
    // Add product cards
    products.forEach(product => {
        addProductCard(product);
    });
}

function showRecommendationResponse(searchTerm) {
    const products = MOCK_PRODUCTS[searchTerm] || MOCK_PRODUCTS['watch'];
    
    let response = `${getRandomResponse(AI_RESPONSES.recommendation)}<br>`;
    
    addMessageToChat(response, 'ai');
    
    // Add product cards
    products.slice(0, 3).forEach(product => {
        addProductCard(product);
    });
}

function showDealsResponse() {
    let response = '🔥 Here are today\'s hottest deals across all platforms:<br>';
    
    addMessageToChat(response, 'ai');
    
    // Show top 4 deals
    TOP_DEALS.slice(0, 4).forEach(product => {
        addProductCard(product);
    });
    
    setTimeout(() => {
        addMessageToChat('Want to see more deals? Click on "Top Deals" in the navigation! 🎯', 'ai');
    }, 500);
}

function addProductCard(product) {
    const chatMessages = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai-message';
    
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content">
            <div class="product-card">
                <div class="product-header">
                    <div class="product-image">${product.emoji}</div>
                    <div class="product-info">
                        <div class="product-title">${product.name}</div>
                        <div class="product-rating">
                            ⭐ ${product.rating} (${product.reviews.toLocaleString('en-IN')} reviews)
                        </div>
                        <div class="product-price">
                            ₹${product.price.toLocaleString('en-IN')}
                            <span class="product-original-price">₹${product.originalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
                <div class="product-platforms">
                    <span class="platform-chip">${product.platform}</span>
                    <span class="platform-chip">${product.discount}% OFF</span>
                </div>
                <div class="product-actions">
                    <button class="btn-small primary" onclick="handleBuyNow('${product.name}', '${product.platform}')">
                        Buy on ${product.platform}
                    </button>
                    <button class="btn-small secondary" onclick="handleAddToCompare('${product.name}')">
                        Compare
                    </button>
                </div>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleQuickAction(action) {
    const actions = {
        'deals': 'Show me today\'s top deals',
        'trending': 'What\'s trending right now?',
        'recommend': 'Give me personalized recommendations'
    };
    
    const query = actions[action];
    document.getElementById('chatInput').value = query;
    sendMessage();
}

function handleVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.lang = 'en-IN';
        recognition.continuous = false;
        
        recognition.onstart = () => {
            showToast('🎤 Listening...');
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
            sendMessage();
        };
        
        recognition.onerror = () => {
            showToast('❌ Voice recognition failed. Please try again.');
        };
        
        recognition.start();
    } else {
        showToast('❌ Voice input not supported in this browser');
    }
}

function clearChat() {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = `
        <div class="message ai-message">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
                <div class="message-bubble">
                    Hello! I'm KAI, your personal shopping assistant. I can help you:
                    <ul>
                        <li>🔍 Find and compare products across platforms</li>
                        <li>💰 Discover the best deals</li>
                        <li>🎯 Get personalized recommendations</li>
                        <li>🛒 Complete your purchase</li>
                    </ul>
                    What would you like to shop for today?
                </div>
                <div class="message-time">Just now</div>
            </div>
        </div>
    `;
    APP_STATE.chatHistory = [];
}

// ===================================
// DEALS FUNCTIONALITY
// ===================================

function loadDeals() {
    const dealsGrid = document.getElementById('dealsGrid');
    if (!dealsGrid) return;
    
    dealsGrid.innerHTML = '';
    
    TOP_DEALS.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

function createDealCard(deal) {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.innerHTML = `
        <div class="deal-image">
            ${deal.emoji}
            <div class="deal-badge">${deal.discount}% OFF</div>
        </div>
        <div class="deal-content">
            <div class="deal-platform">${deal.platform}</div>
            <h3 class="deal-title">${deal.name}</h3>
            <div class="deal-rating">
                ⭐ ${deal.rating} (${deal.reviews.toLocaleString('en-IN')})
            </div>
            <div class="deal-price-section">
                <span class="deal-price">₹${deal.price.toLocaleString('en-IN')}</span>
                <span class="deal-original-price">₹${deal.originalPrice.toLocaleString('en-IN')}</span>
            </div>
            <button class="deal-cta" onclick="handleBuyNow('${deal.name}', '${deal.platform}')">
                Shop Now on ${deal.platform}
            </button>
        </div>
    `;
    
    return card;
}

function filterDeals(category) {
    const dealsGrid = document.getElementById('dealsGrid');
    dealsGrid.innerHTML = '';
    
    const filtered = category === 'all' 
        ? TOP_DEALS 
        : TOP_DEALS.filter(deal => deal.category === category);
    
    if (filtered.length === 0) {
        dealsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <h3>No deals found in this category</h3>
                <p>Check back soon for amazing offers!</p>
            </div>
        `;
        return;
    }
    
    filtered.forEach(deal => {
        const dealCard = createDealCard(deal);
        dealsGrid.appendChild(dealCard);
    });
}

// ===================================
// COMPARE FUNCTIONALITY
// ===================================

function performComparison() {
    const input = document.getElementById('compareSearchInput');
    const query = input.value.trim().toLowerCase();
    
    if (!query) {
        showToast('Please enter a product to compare');
        return;
    }
    
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        const searchTerm = extractSearchTerm(query) || 'phone';
        displayComparisonResults(searchTerm);
        addToSearchHistory(query);
    }, 1000);
}

function displayComparisonResults(searchTerm) {
    const products = MOCK_PRODUCTS[searchTerm] || MOCK_PRODUCTS['phone'];
    const compareResults = document.getElementById('compareResults');
    
    // Find best deal
    const bestDeal = products.reduce((min, p) => p.price < min.price ? p : min);
    
    compareResults.innerHTML = `
        <div class="compare-table">
            <div class="compare-table-header">
                Comparison Results - ${products.length} platforms found
            </div>
            <div class="compare-items">
                ${products.map(product => `
                    <div class="compare-item">
                        <div class="compare-item-image">${product.emoji}</div>
                        <div class="compare-item-details">
                            <h3>${product.name}</h3>
                            <div class="compare-item-meta">
                                <div class="compare-meta-item">
                                    <span class="compare-meta-label">Platform</span>
                                    <span class="compare-meta-value">${product.platform}</span>
                                </div>
                                <div class="compare-meta-item">
                                    <span class="compare-meta-label">Rating</span>
                                    <span class="compare-meta-value">⭐ ${product.rating}</span>
                                </div>
                                <div class="compare-meta-item">
                                    <span class="compare-meta-label">Discount</span>
                                    <span class="compare-meta-value">${product.discount}%</span>
                                </div>
                                <div class="compare-meta-item">
                                    <span class="compare-meta-label">Delivery</span>
                                    <span class="compare-meta-value">${Math.floor(Math.random() * 3) + 1} days</span>
                                </div>
                            </div>
                        </div>
                        <div class="compare-item-actions">
                            ${product.id === bestDeal.id ? '<div class="best-deal-badge">🏆 Best Deal</div>' : ''}
                            <div class="compare-item-price">₹${product.price.toLocaleString('en-IN')}</div>
                            <button class="btn-small primary" onclick="handleBuyNow('${product.name}', '${product.platform}')">
                                Buy Now
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

function addToSearchHistory(query) {
    APP_STATE.searchHistory.unshift({
        query: query,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 searches
    if (APP_STATE.searchHistory.length > 50) {
        APP_STATE.searchHistory = APP_STATE.searchHistory.slice(0, 50);
    }
    
    localStorage.setItem('kai_search_history', JSON.stringify(APP_STATE.searchHistory));
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.querySelector('.toast-message').textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===================================
// ACTION HANDLERS
// ===================================

function handleBuyNow(productName, platform) {
    showToast(`🛒 Redirecting to ${platform} for ${productName}...`);
    
    // In a real implementation, this would redirect to the actual platform
    setTimeout(() => {
        addMessageToChat(`Great choice! I'm preparing your order for "${productName}" on ${platform}. Would you like to:<br>
        • Add to cart<br>
        • Buy now with UPI/Card<br>
        • Save for later`, 'ai');
        navigateToPage('chat');
    }, 1500);
}

function handleAddToCompare(productName) {
    showToast(`✅ Added ${productName} to comparison`);
    navigateToPage('compare');
}

// ===================================
// EXPORTS (for onclick handlers)
// ===================================

window.handleBuyNow = handleBuyNow;
window.handleAddToCompare = handleAddToCompare;

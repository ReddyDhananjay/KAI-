"""
Worker Agents for KAI Platform
Each agent handles specific aspects of the shopping experience
"""

from typing import Dict, Any, List, Optional
from langchain.chat_models import ChatOpenAI
import asyncio
import random
from datetime import datetime, timedelta


class BaseAgent:
    """Base class for all worker agents"""
    
    def __init__(self, openai_api_key: str):
        self.llm = ChatOpenAI(
            temperature=0.7,
            model="gpt-3.5-turbo",
            openai_api_key=openai_api_key
        )


class RecommendationAgent(BaseAgent):
    """
    Recommendation Agent
    Suggests products based on user preferences, history, and trends
    """
    
    async def search_products(
        self,
        query: str,
        category: Optional[str] = None,
        budget: Optional[float] = None,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Search for products across platforms"""
        
        # Mock product search (In production, integrate with real APIs)
        products = self._mock_product_search(query, category, budget)
        
        return {
            "products": products,
            "query": query,
            "total_count": len(products)
        }
    
    async def get_recommendations(
        self,
        user_context: Optional[Dict[str, Any]] = None,
        category: Optional[str] = None,
        budget: Optional[float] = None
    ) -> Dict[str, Any]:
        """Get personalized product recommendations"""
        
        # Mock recommendations based on trends and preferences
        recommendations = self._mock_recommendations(category, budget, user_context)
        
        return {
            "recommendations": recommendations,
            "personalized": bool(user_context),
            "reason": "Based on your preferences and trending products"
        }
    
    def _mock_product_search(
        self,
        query: str,
        category: Optional[str],
        budget: Optional[float]
    ) -> List[Dict[str, Any]]:
        """Generate mock product search results"""
        
        platforms = ["amazon", "flipkart", "meesho", "myntra", "ajio"]
        categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"]
        
        products = []
        for i in range(8):
            platform = random.choice(platforms)
            price = random.randint(500, 5000) if not budget else random.randint(int(budget * 0.5), int(budget * 1.5))
            original_price = price * random.uniform(1.1, 1.5)
            discount = ((original_price - price) / original_price) * 100
            
            product = {
                "id": i + 1,
                "external_id": f"{platform}_{i}",
                "name": f"{query.title()} - Model {i+1}",
                "description": f"High-quality {query} with excellent features",
                "category": category or random.choice(categories),
                "brand": f"Brand-{chr(65 + i % 5)}",
                "price": round(price, 2),
                "original_price": round(original_price, 2),
                "discount_percentage": round(discount, 1),
                "rating": round(random.uniform(3.5, 5.0), 1),
                "reviews_count": random.randint(50, 5000),
                "image_url": f"https://via.placeholder.com/300x300?text={query.replace(' ', '+')}+{i+1}",
                "product_url": f"https://{platform}.com/product/{i}",
                "platform": platform,
                "availability": True,
                "delivery_time": f"{random.randint(1, 7)} days",
                "specifications": {
                    "color": random.choice(["Black", "Blue", "Red", "White"]),
                    "warranty": f"{random.randint(6, 24)} months"
                }
            }
            products.append(product)
        
        # Sort by price
        products.sort(key=lambda x: x["price"])
        return products
    
    def _mock_recommendations(
        self,
        category: Optional[str],
        budget: Optional[float],
        user_context: Optional[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Generate mock product recommendations"""
        
        queries = ["Smartphone", "Laptop", "Headphones", "Watch", "Shoes", "Shirt", "Bag"]
        query = random.choice(queries)
        
        return self._mock_product_search(query, category, budget)[:6]


class ComparisonAgent(BaseAgent):
    """
    Comparison Agent
    Compares products across different platforms
    """
    
    async def compare_products(
        self,
        query: str,
        platforms: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Compare products across multiple platforms"""
        
        if not platforms:
            platforms = ["amazon", "flipkart", "meesho", "myntra", "ajio"]
        
        # Mock comparison data
        comparison_results = []
        for platform in platforms[:3]:  # Compare top 3 platforms
            price = random.randint(1000, 5000)
            original_price = price * random.uniform(1.1, 1.5)
            
            product = {
                "id": len(comparison_results) + 1,
                "name": f"{query.title()} - Premium Edition",
                "platform": platform,
                "price": round(price, 2),
                "original_price": round(original_price, 2),
                "discount_percentage": round(((original_price - price) / original_price) * 100, 1),
                "rating": round(random.uniform(3.8, 5.0), 1),
                "reviews_count": random.randint(100, 3000),
                "delivery_time": f"{random.randint(1, 7)} days",
                "availability": True,
                "image_url": f"https://via.placeholder.com/300x300?text={query.replace(' ', '+')}",
                "product_url": f"https://{platform}.com/product/{query}"
            }
            comparison_results.append(product)
        
        # Determine best options
        best_price = min(comparison_results, key=lambda x: x["price"])
        best_rated = max(comparison_results, key=lambda x: x["rating"])
        fastest_delivery = min(comparison_results, key=lambda x: int(x["delivery_time"].split()[0]))
        
        return {
            "comparison": comparison_results,
            "best_price": best_price,
            "best_rated": best_rated,
            "fastest_delivery": fastest_delivery,
            "recommended": best_price  # Recommend best price by default
        }


class DealsAgent(BaseAgent):
    """
    Deals Agent
    Fetches and manages top deals of the day
    """
    
    async def get_top_deals(
        self,
        category: Optional[str] = None,
        limit: int = 10
    ) -> Dict[str, Any]:
        """Get top deals of the day"""
        
        deals = self._mock_top_deals(category, limit)
        
        return {
            "deals": deals,
            "category": category,
            "total_count": len(deals),
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def _mock_top_deals(self, category: Optional[str], limit: int) -> List[Dict[str, Any]]:
        """Generate mock top deals"""
        
        categories = ["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Sports"]
        platforms = ["amazon", "flipkart", "meesho", "myntra", "ajio"]
        
        deals = []
        for i in range(limit):
            original_price = random.randint(1000, 10000)
            discount = random.uniform(30, 70)
            deal_price = original_price * (1 - discount / 100)
            
            deal = {
                "id": i + 1,
                "title": f"Amazing Deal on {random.choice(['Smartphone', 'Laptop', 'Shoes', 'Watch', 'Headphones'])}",
                "description": f"Limited time offer with {discount:.0f}% discount",
                "deal_price": round(deal_price, 2),
                "original_price": round(original_price, 2),
                "savings_percentage": round(discount, 1),
                "category": category or random.choice(categories),
                "platform": random.choice(platforms),
                "featured": i < 3,
                "valid_until": (datetime.utcnow() + timedelta(days=random.randint(1, 7))).isoformat(),
                "is_active": True,
                "image_url": f"https://via.placeholder.com/300x300?text=Deal+{i+1}",
                "product_url": f"https://example.com/deal/{i+1}"
            }
            deals.append(deal)
        
        # Sort by savings percentage
        deals.sort(key=lambda x: x["savings_percentage"], reverse=True)
        return deals


class InventoryAgent(BaseAgent):
    """
    Inventory Agent
    Checks product availability across platforms
    """
    
    async def check_availability(
        self,
        product_id: str,
        platform: str
    ) -> Dict[str, Any]:
        """Check product availability"""
        
        # Mock availability check
        available = random.choice([True, True, True, False])  # 75% available
        
        return {
            "product_id": product_id,
            "platform": platform,
            "available": available,
            "stock_level": random.randint(1, 100) if available else 0,
            "estimated_restock": None if available else (datetime.utcnow() + timedelta(days=3)).isoformat()
        }


class PaymentAgent(BaseAgent):
    """
    Payment Agent
    Manages checkout and payment processing
    """
    
    async def process_checkout(
        self,
        items: List[Dict[str, Any]],
        payment_method: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Process checkout and payment"""
        
        total_amount = sum(item.get("price", 0) * item.get("quantity", 1) for item in items)
        
        # Mock payment processing
        order_number = f"ORD-{datetime.utcnow().strftime('%Y%m%d')}-{random.randint(1000, 9999)}"
        
        return {
            "success": True,
            "order_number": order_number,
            "total_amount": round(total_amount, 2),
            "payment_method": payment_method,
            "payment_status": "confirmed",
            "message": f"Order {order_number} confirmed! You'll receive tracking details soon."
        }


class FulfillmentAgent(BaseAgent):
    """
    Fulfillment Agent
    Handles delivery and order tracking
    """
    
    async def track_order(
        self,
        order_id: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Track order status and delivery"""
        
        statuses = ["confirmed", "packed", "shipped", "out_for_delivery"]
        current_status = random.choice(statuses)
        
        return {
            "order": {
                "order_number": order_id,
                "status": current_status,
                "estimated_delivery": (datetime.utcnow() + timedelta(days=3)).strftime("%B %d, %Y")
            },
            "tracking_updates": [
                {"status": "confirmed", "timestamp": (datetime.utcnow() - timedelta(days=2)).isoformat()},
                {"status": "packed", "timestamp": (datetime.utcnow() - timedelta(days=1)).isoformat()},
            ],
            "message": f"Your order is currently {current_status.replace('_', ' ')}."
        }


class SupportAgent(BaseAgent):
    """
    Support Agent
    Handles customer queries and support
    """
    
    async def handle_query(
        self,
        query: str,
        user_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Handle customer support query"""
        
        # Use LLM to generate helpful response
        prompt = f"""You are a helpful customer support agent for KAI, a conversational commerce platform.
        
User query: {query}

Provide a helpful, friendly, and professional response. If the query is about:
- Returns/Refunds: Explain the return policy (30 days, full refund)
- Delivery: Mention typical delivery times (2-7 days depending on location)
- Payment: Explain payment methods accepted (UPI, Cards, Wallets)
- Product quality: Assure that all products are quality-checked
- Order issues: Offer to help track or resolve issues

Keep the response concise and actionable.
"""
        
        try:
            response = self.llm.predict(prompt)
        except:
            response = "I'm here to help! Could you please provide more details about your query so I can assist you better?"
        
        return {
            "response": response,
            "query": query,
            "resolved": True
        }

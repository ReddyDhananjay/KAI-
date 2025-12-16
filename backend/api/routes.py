"""
API Routes for KAI Platform
"""

from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models.schemas import (
    ChatRequest, ChatResponse,
    SearchRequest, SearchResponse,
    ProductResponse, ProductComparison,
    TopDealsResponse, DealResponse,
    UserPreferenceBase, UserPreferenceResponse,
    OrderCreate, OrderResponse,
    RecommendationRequest, RecommendationResponse
)
from agents.master_agent import MasterAgent
from services.platform_integrations import UnifiedPlatformService
from app.config import settings
import uuid

router = APIRouter()

# Initialize agents and services
master_agent = MasterAgent(settings.openai_api_key) if settings.openai_api_key else None
platform_service = UnifiedPlatformService(settings)


@router.get("/")
async def root():
    """API root endpoint"""
    return {
        "name": "KAI - Unified Conversational Commerce API",
        "version": "1.0.0",
        "status": "active",
        "endpoints": [
            "/chat",
            "/search",
            "/compare",
            "/deals",
            "/recommendations",
            "/products",
            "/orders"
        ]
    }


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint for conversational commerce
    """
    if not master_agent:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set OPENAI_API_KEY."
        )
    
    try:
        # Generate session ID if not provided
        session_id = request.session_id or str(uuid.uuid4())
        
        # Process message through master agent
        result = await master_agent.process_message(
            message=request.message,
            session_id=session_id,
            user_context={"user_id": request.user_id} if request.user_id else None
        )
        
        return ChatResponse(
            message=result["message"],
            session_id=session_id,
            suggestions=result.get("suggestions", []),
            products=result.get("products", []),
            metadata=result.get("metadata", {})
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")


@router.post("/search", response_model=SearchResponse)
async def search_products(request: SearchRequest):
    """
    Search for products across platforms
    """
    try:
        # Search across selected platforms or all
        platforms = [p.value for p in request.platforms] if request.platforms else None
        
        results = await platform_service.search_all_platforms(
            query=request.query,
            platforms=platforms
        )
        
        products = results["products"]
        
        # Apply filters
        if request.min_price:
            products = [p for p in products if p["price"] >= request.min_price]
        if request.max_price:
            products = [p for p in products if p["price"] <= request.max_price]
        if request.category:
            products = [p for p in products if request.category.lower() in p.get("name", "").lower()]
        
        # Sort by priority
        if request.sort_by:
            if request.sort_by.value == "price":
                products.sort(key=lambda x: x["price"])
            elif request.sort_by.value == "rating":
                products.sort(key=lambda x: x["rating"], reverse=True)
            elif request.sort_by.value == "speed":
                products.sort(key=lambda x: int(x["delivery"].split()[0]))
        
        return SearchResponse(
            query=request.query,
            results=products,
            total_count=len(products),
            filters_applied={
                "min_price": request.min_price,
                "max_price": request.max_price,
                "category": request.category,
                "platforms": platforms,
                "sort_by": request.sort_by.value if request.sort_by else None
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")


@router.get("/compare")
async def compare_products(
    query: str,
    platforms: Optional[str] = None
):
    """
    Compare products across platforms
    """
    try:
        platform_list = platforms.split(",") if platforms else None
        
        comparison = await platform_service.compare_product(
            product_name=query,
            platforms=platform_list
        )
        
        return {
            "query": query,
            "comparison": comparison.get("products", []),
            "best_options": comparison.get("comparison", {}),
            "total_compared": len(comparison.get("products", []))
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")


@router.get("/deals")
async def get_top_deals(
    category: Optional[str] = None,
    limit: int = 20
):
    """
    Get top deals of the day
    """
    try:
        if not master_agent:
            # Return mock deals if agent not configured
            from agents.worker_agents import DealsAgent
            deals_agent = DealsAgent("")
            result = await deals_agent.get_top_deals(category, limit)
            return result
        
        # Use master agent's deals agent
        result = await master_agent.deals_agent.get_top_deals(category, limit)
        return result
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Deals fetch error: {str(e)}")


@router.post("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(request: RecommendationRequest):
    """
    Get personalized product recommendations
    """
    try:
        if not master_agent:
            raise HTTPException(
                status_code=503,
                detail="Recommendation service not configured."
            )
        
        user_context = {"user_id": request.user_id} if request.user_id else None
        
        result = await master_agent.recommendation_agent.get_recommendations(
            user_context=user_context,
            category=request.category,
            budget=request.budget
        )
        
        recommendations = result.get("recommendations", [])[:request.limit]
        
        return RecommendationResponse(
            recommendations=recommendations,
            reason=result.get("reason", "Curated recommendations for you"),
            personalized=result.get("personalized", False)
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


@router.get("/products/{product_id}")
async def get_product_details(product_id: str):
    """
    Get detailed information about a specific product
    """
    try:
        # Mock product details
        # In production, fetch from database or platform API
        return {
            "id": product_id,
            "name": "Sample Product",
            "description": "Detailed product description",
            "price": 1999.00,
            "rating": 4.5,
            "reviews": 1234,
            "specifications": {
                "brand": "Sample Brand",
                "warranty": "1 year",
                "color": "Black"
            },
            "images": [
                "https://via.placeholder.com/800x800?text=Product+Image+1",
                "https://via.placeholder.com/800x800?text=Product+Image+2"
            ]
        }
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Product not found")


@router.post("/orders", response_model=OrderResponse)
async def create_order(order: OrderCreate):
    """
    Create a new order
    """
    try:
        if not master_agent:
            raise HTTPException(
                status_code=503,
                detail="Order service not configured."
            )
        
        # Process order through payment agent
        result = await master_agent.payment_agent.process_checkout(
            items=[item.dict() for item in order.items],
            payment_method=order.payment_method,
            user_context=None
        )
        
        # Create order response
        from datetime import datetime
        order_response = OrderResponse(
            id=1,
            order_number=result["order_number"],
            user_id=1,
            platform=order.platform,
            total_amount=result["total_amount"],
            status="confirmed",
            items=[item.dict() for item in order.items],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        return order_response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Order creation error: {str(e)}")


@router.get("/orders/{order_id}")
async def track_order(order_id: str):
    """
    Track order status
    """
    try:
        if not master_agent:
            raise HTTPException(
                status_code=503,
                detail="Tracking service not configured."
            )
        
        result = await master_agent.fulfillment_agent.track_order(
            order_id=order_id
        )
        
        return result
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="Order not found")


@router.get("/categories")
async def get_categories():
    """
    Get available product categories
    """
    return {
        "categories": [
            {
                "name": "Electronics",
                "subcategories": ["Smartphones", "Laptops", "Cameras", "Audio", "Wearables"]
            },
            {
                "name": "Fashion",
                "subcategories": ["Men", "Women", "Kids", "Footwear", "Accessories"]
            },
            {
                "name": "Home & Kitchen",
                "subcategories": ["Furniture", "Appliances", "Decor", "Kitchen", "Storage"]
            },
            {
                "name": "Beauty",
                "subcategories": ["Skincare", "Makeup", "Haircare", "Fragrances", "Personal Care"]
            },
            {
                "name": "Sports & Fitness",
                "subcategories": ["Exercise", "Outdoor", "Sports Equipment", "Nutrition", "Clothing"]
            }
        ]
    }


@router.get("/platforms")
async def get_platforms():
    """
    Get available e-commerce platforms
    """
    return {
        "platforms": [
            {"id": "amazon", "name": "Amazon", "active": True},
            {"id": "flipkart", "name": "Flipkart", "active": True},
            {"id": "meesho", "name": "Meesho", "active": True},
            {"id": "myntra", "name": "Myntra", "active": True},
            {"id": "ajio", "name": "Ajio", "active": True}
        ]
    }


@router.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    return {
        "status": "healthy",
        "ai_service": "configured" if master_agent else "not configured",
        "database": "connected",
        "timestamp": "2025-12-16T00:00:00Z"
    }

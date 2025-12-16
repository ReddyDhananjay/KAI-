from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# Enums
class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class Platform(str, Enum):
    AMAZON = "amazon"
    FLIPKART = "flipkart"
    MEESHO = "meesho"
    MYNTRA = "myntra"
    AJIO = "ajio"


class Priority(str, Enum):
    PRICE = "price"
    SPEED = "speed"
    RATING = "rating"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


# Chat Schemas
class ChatMessage(BaseModel):
    role: MessageRole
    content: str
    metadata: Optional[Dict[str, Any]] = None


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    user_id: Optional[int] = None


class ChatResponse(BaseModel):
    message: str
    session_id: str
    suggestions: Optional[List[str]] = None
    products: Optional[List[Dict[str, Any]]] = None
    metadata: Optional[Dict[str, Any]] = None


# Product Schemas
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: str
    brand: Optional[str] = None
    price: float
    original_price: Optional[float] = None
    discount_percentage: Optional[float] = None
    rating: Optional[float] = None
    reviews_count: Optional[int] = 0
    image_url: Optional[str] = None
    product_url: str
    platform: Platform
    availability: bool = True
    delivery_time: Optional[str] = None


class ProductResponse(ProductBase):
    id: int
    external_id: str
    specifications: Optional[Dict[str, Any]] = None
    cached_at: datetime
    
    class Config:
        from_attributes = True


class ProductComparison(BaseModel):
    query: str
    products: List[ProductResponse]
    best_price: Optional[ProductResponse] = None
    best_rated: Optional[ProductResponse] = None
    fastest_delivery: Optional[ProductResponse] = None
    recommended: Optional[ProductResponse] = None


# Search Schemas
class SearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    platforms: Optional[List[Platform]] = None
    sort_by: Optional[Priority] = Priority.PRICE


class SearchResponse(BaseModel):
    query: str
    results: List[ProductResponse]
    total_count: int
    filters_applied: Dict[str, Any]


# Deal Schemas
class DealBase(BaseModel):
    title: str
    description: Optional[str] = None
    deal_price: float
    original_price: float
    savings_percentage: float
    category: str
    featured: bool = False


class DealResponse(DealBase):
    id: int
    valid_from: datetime
    valid_until: datetime
    is_active: bool
    product: Optional[ProductResponse] = None
    
    class Config:
        from_attributes = True


class TopDealsResponse(BaseModel):
    deals: List[DealResponse]
    categories: List[str]
    total_count: int


# User Preferences Schemas
class UserPreferenceBase(BaseModel):
    preferred_platforms: Optional[List[Platform]] = None
    budget_range: Optional[Dict[str, float]] = None
    favorite_categories: Optional[List[str]] = None
    priority: Priority = Priority.PRICE
    deal_alerts: bool = True
    price_drop_alerts: bool = True


class UserPreferenceResponse(UserPreferenceBase):
    id: int
    user_id: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Order Schemas
class OrderItem(BaseModel):
    product_id: int
    product_name: str
    quantity: int
    price: float
    platform: Platform


class OrderCreate(BaseModel):
    items: List[OrderItem]
    platform: Platform
    shipping_address: Dict[str, str]
    billing_address: Optional[Dict[str, str]] = None
    payment_method: str


class OrderResponse(BaseModel):
    id: int
    order_number: str
    user_id: int
    platform: Platform
    total_amount: float
    status: OrderStatus
    items: List[Dict[str, Any]]
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


# Agent Schemas
class AgentAction(BaseModel):
    agent_type: str
    action: str
    parameters: Dict[str, Any]
    result: Optional[Any] = None


class AgentResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    actions_taken: List[AgentAction] = []


# Analytics Schemas
class UserAnalytics(BaseModel):
    user_id: int
    total_searches: int
    total_orders: int
    favorite_categories: List[str]
    preferred_platforms: List[Platform]
    average_order_value: float
    last_active: datetime


# Recommendation Schemas
class RecommendationRequest(BaseModel):
    user_id: Optional[int] = None
    category: Optional[str] = None
    budget: Optional[float] = None
    limit: int = 10


class RecommendationResponse(BaseModel):
    recommendations: List[ProductResponse]
    reason: str
    personalized: bool

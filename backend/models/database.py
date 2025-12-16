from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, JSON, Boolean, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()


class User(Base):
    """User model for storing user information"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversations = relationship("Conversation", back_populates="user")
    preferences = relationship("UserPreference", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="user")


class UserPreference(Base):
    """User preferences and settings"""
    __tablename__ = "user_preferences"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Shopping preferences
    preferred_platforms = Column(JSON)  # List of preferred e-commerce platforms
    budget_range = Column(JSON)  # {"min": 0, "max": 10000}
    favorite_categories = Column(JSON)  # List of categories
    priority = Column(String, default="price")  # price, speed, rating
    
    # Notification preferences
    deal_alerts = Column(Boolean, default=True)
    price_drop_alerts = Column(Boolean, default=True)
    
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="preferences")


class Conversation(Base):
    """Conversation history for chat sessions"""
    __tablename__ = "conversations"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    session_id = Column(String, unique=True, index=True)
    
    # Conversation metadata
    title = Column(String)
    context = Column(JSON)  # Store conversation context
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="conversations")
    messages = relationship("Message", back_populates="conversation")


class Message(Base):
    """Individual messages in a conversation"""
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"))
    
    # Message content
    role = Column(String)  # user, assistant, system
    content = Column(Text)
    metadata = Column(JSON)  # Additional metadata like products shown, actions taken
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    conversation = relationship("Conversation", back_populates="messages")


class Product(Base):
    """Product information cache"""
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Product identifiers
    external_id = Column(String, index=True)
    platform = Column(String, index=True)  # amazon, flipkart, etc.
    
    # Product details
    name = Column(String)
    description = Column(Text)
    category = Column(String, index=True)
    brand = Column(String)
    
    # Pricing
    price = Column(Float)
    original_price = Column(Float)
    discount_percentage = Column(Float)
    
    # Additional info
    rating = Column(Float)
    reviews_count = Column(Integer)
    image_url = Column(String)
    product_url = Column(String)
    availability = Column(Boolean, default=True)
    
    # Metadata
    specifications = Column(JSON)
    delivery_time = Column(String)
    
    # Cache management
    cached_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Deal(Base):
    """Top deals of the day"""
    __tablename__ = "deals"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Deal information
    product_id = Column(Integer, ForeignKey("products.id"))
    title = Column(String)
    description = Column(Text)
    
    # Deal specifics
    deal_price = Column(Float)
    original_price = Column(Float)
    savings_percentage = Column(Float)
    
    # Validity
    valid_from = Column(DateTime)
    valid_until = Column(DateTime)
    is_active = Column(Boolean, default=True)
    
    # Categorization
    category = Column(String)
    featured = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class Order(Base):
    """Order tracking"""
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Order details
    order_number = Column(String, unique=True, index=True)
    platform = Column(String)
    total_amount = Column(Float)
    status = Column(String)  # pending, confirmed, shipped, delivered, cancelled
    
    # Order items
    items = Column(JSON)
    
    # Addresses
    shipping_address = Column(JSON)
    billing_address = Column(JSON)
    
    # Payment
    payment_method = Column(String)
    payment_status = Column(String)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="orders")


class SearchHistory(Base):
    """User search history for personalization"""
    __tablename__ = "search_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    query = Column(String)
    category = Column(String)
    filters = Column(JSON)
    results_count = Column(Integer)
    
    created_at = Column(DateTime, default=datetime.utcnow)


# Database initialization
def init_db(database_url: str):
    """Initialize database and create tables"""
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    return engine


def get_session_local(engine):
    """Get database session"""
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal

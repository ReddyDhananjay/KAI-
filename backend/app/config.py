from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # API Configuration
    app_name: str = "KAI - Unified Conversational Commerce"
    version: str = "1.0.0"
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # OpenAI Configuration
    openai_api_key: str = ""
    
    # Database Configuration
    database_url: str = "sqlite:///./kai.db"
    
    # Redis Configuration
    redis_url: str = "redis://localhost:6379"
    
    # Security
    secret_key: str = "your-secret-key-change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # E-commerce API Keys
    amazon_api_key: str = "mock_amazon_key"
    flipkart_api_key: str = "mock_flipkart_key"
    meesho_api_key: str = "mock_meesho_key"
    myntra_api_key: str = "mock_myntra_key"
    ajio_api_key: str = "mock_ajio_key"
    
    # CORS Origins
    cors_origins: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()

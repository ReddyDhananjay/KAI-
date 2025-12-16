"""
KAI - Unified Conversational Commerce Platform
Main FastAPI Application
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config import settings
from api.routes import router
from models.database import init_db
import uvicorn

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    description="AI-powered unified conversational commerce platform",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix="/api/v1", tags=["KAI API"])


@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting KAI Platform...")
    print(f"📍 API running on {settings.api_host}:{settings.api_port}")
    print(f"📚 Docs available at http://{settings.api_host}:{settings.api_port}/api/docs")
    
    # Initialize database
    try:
        init_db(settings.database_url)
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
    
    if not settings.openai_api_key:
        print("⚠️  Warning: OPENAI_API_KEY not set. AI features will be limited.")
        print("   Please set OPENAI_API_KEY in .env file to enable full AI functionality.")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    print("👋 Shutting down KAI Platform...")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": settings.app_name,
        "version": settings.version,
        "status": "running",
        "message": "Welcome to KAI - Your AI Shopping Assistant",
        "api_docs": "/api/docs",
        "health": "/api/v1/health"
    }


@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": "The requested resource was not found",
            "docs": "/api/docs"
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Custom 500 handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later."
        }
    )


if __name__ == "__main__":
    # Run the application
    uvicorn.run(
        "main:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=settings.debug
    )

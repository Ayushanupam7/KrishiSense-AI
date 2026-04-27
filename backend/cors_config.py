"""
Production-ready CORS configuration for KrishiSense AI
"""
import os
from typing import List

def get_allowed_origins() -> List[str]:
    """
    Get allowed origins for CORS based on environment
    """
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        # Production - restrict to specific domains
        allowed = os.getenv(
            "ALLOWED_ORIGINS",
            "https://krishisense.vercel.app,https://www.krishisense.com"
        ).split(",")
        return [origin.strip() for origin in allowed if origin.strip()]
    
    elif env == "staging":
        # Staging - allow multiple test domains
        return [
            "https://staging.krishisense.vercel.app",
            "https://krishisense-staging.vercel.app",
            "http://localhost:3000",
        ]
    
    else:
        # Development - allow all
        return ["*"]

def get_cors_config() -> dict:
    """
    Get complete CORS configuration
    """
    return {
        "allow_origins": get_allowed_origins(),
        "allow_credentials": True,
        "allow_methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization", "Accept"],
        "max_age": 600,  # 10 minutes
    }

# Example usage in main.py:
# from cors_config import get_cors_config
# app.add_middleware(CORSMiddleware, **get_cors_config())

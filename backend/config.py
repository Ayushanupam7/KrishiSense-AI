"""
Configuration settings for KrishiSense AI Backend
"""
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

# API Keys
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "demo_key")
TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY", "demo_key")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyDscNOtY3lXVAMCNpU9qZzsMVbd6xMolrU")

# Firebase
FIREBASE_CONFIG_PATH = os.getenv("FIREBASE_CONFIG_PATH", "./firebase_config.json")

# API Endpoints
OPENWEATHER_API = "https://api.openweathermap.org/data/3.0/onecall"
AGMARKNET_API = "https://agmarknet.gov.in/SearchCmmMkt.aspx"

# Model paths
MODEL_PATH = "../ml_model/models/crop_predictor.pkl"
SCALER_PATH = "../ml_model/models/scaler.pkl"

# Default location
DEFAULT_LOCATION = {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "name": "Delhi"
}

# Supported languages
SUPPORTED_LANGUAGES = ["en", "hi", "mr"]

# Supported crops (Phase 1)
SUPPORTED_CROPS = [
    "Rice", "Wheat", "Maize", "Cotton",
    "Sugarcane", "Potato", "Onion",
    "Tomato", "Chilli", "Turmeric",
    "Soybean", "Arhar", "Urad",
    "Banana", "Ginger", "Garlic",
    "Mustard", "Cabbage", "Cauliflower",
    "Brinjal"
]

# Soil types
SOIL_TYPES = {
    "alluvial": {"pH_range": (6.5, 7.5), "nitrogen": "medium"},
    "black": {"pH_range": (7.5, 8.5), "nitrogen": "low"},
    "red": {"pH_range": (5.5, 6.5), "nitrogen": "low"},
    "laterite": {"pH_range": (4.5, 5.5), "nitrogen": "very_low"},
    "sandy": {"pH_range": (6.0, 7.0), "nitrogen": "very_low"},
}

# Crop Metadata for Risk & Decision Logic
CROP_METADATA = {
    "Rice": {"category": "Grains", "season": "Kharif", "water": "High", "duration": "Medium", "volatility": "Low", "perishability": "Low"},
    "Wheat": {"category": "Grains", "season": "Rabi", "water": "Medium", "duration": "Medium", "volatility": "Low", "perishability": "Low"},
    "Maize": {"category": "Grains", "season": "Kharif", "water": "Medium", "duration": "Short", "volatility": "Medium", "perishability": "Low"},
    "Cotton": {"category": "Commercial", "season": "Kharif", "water": "Medium", "duration": "Long", "volatility": "High", "perishability": "Low"},
    "Sugarcane": {"category": "Commercial", "season": "All", "water": "High", "duration": "Long", "volatility": "Low", "perishability": "Medium"},
    "Potato": {"category": "Vegetables", "season": "Rabi", "water": "Medium", "duration": "Short", "volatility": "High", "perishability": "Medium"},
    "Onion": {"category": "Vegetables", "season": "Rabi", "water": "Low", "duration": "Medium", "volatility": "High", "perishability": "Medium"},
    "Tomato": {"category": "Vegetables", "season": "All", "water": "Medium", "duration": "Short", "volatility": "Very High", "perishability": "High"},
    "Chilli": {"category": "Vegetables", "season": "Kharif", "water": "Low", "duration": "Medium", "volatility": "Medium", "perishability": "Medium"},
    "Turmeric": {"category": "Spices", "season": "Kharif", "water": "Medium", "duration": "Long", "volatility": "Low", "perishability": "Low"},
    "Soybean": {"category": "Oilseeds", "season": "Kharif", "water": "Low", "duration": "Short", "volatility": "Medium", "perishability": "Low"},
    "Arhar": {"category": "Pulses", "season": "Kharif", "water": "Low", "duration": "Long", "volatility": "Low", "perishability": "Low"},
    "Urad": {"category": "Pulses", "season": "Kharif", "water": "Low", "duration": "Short", "volatility": "Low", "perishability": "Low"},
    "Banana": {"category": "Fruits", "season": "All", "water": "High", "duration": "Long", "volatility": "Medium", "perishability": "High"},
    "Ginger": {"category": "Spices", "season": "Kharif", "water": "Medium", "duration": "Long", "volatility": "Medium", "perishability": "Medium"},
    "Garlic": {"category": "Vegetables", "season": "Rabi", "water": "Medium", "duration": "Medium", "volatility": "Medium", "perishability": "Medium"},
    "Mustard": {"category": "Oilseeds", "season": "Rabi", "water": "Low", "duration": "Short", "volatility": "Medium", "perishability": "Low"},
    "Cabbage": {"category": "Vegetables", "season": "Rabi", "water": "Medium", "duration": "Medium", "volatility": "Medium", "perishability": "Medium"},
    "Cauliflower": {"category": "Vegetables", "season": "Rabi", "water": "Medium", "duration": "Medium", "volatility": "Medium", "perishability": "Medium"},
    "Brinjal": {"category": "Vegetables", "season": "All", "water": "Medium", "duration": "Medium", "volatility": "Medium", "perishability": "Medium"}
}

# Profit margins (typical, in %)
PROFIT_MARGINS = {
    "Rice": 25,
    "Wheat": 22,
    "Maize": 28,
    "Cotton": 35,
    "Sugarcane": 40,
    "Potato": 45,
    "Onion": 50,
    "Tomato": 55,
    "Chilli": 60,
    "Turmeric": 40,
    "Soybean": 30,
    "Arhar": 32,
    "Urad": 33,
    "Banana": 48,
    "Ginger": 35,
    "Garlic": 35,
    "Mustard": 28,
    "Cabbage": 35,
    "Cauliflower": 38,
    "Brinjal": 42
}

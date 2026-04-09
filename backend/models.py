"""
Pydantic models for request/response validation
"""
from pydantic import BaseModel
from typing import Optional, Dict, List, Any

class SoilInput(BaseModel):
    """Soil data input model"""
    pH: float
    nitrogen: float  # N percentage
    phosphorus: float  # P percentage
    potassium: float  # K percentage
    soil_type: Optional[str] = None
    moisture: Optional[float] = None

class WeatherInput(BaseModel):
    """Weather data input model"""
    temperature: float
    humidity: float
    rainfall: float
    wind_speed: Optional[float] = None
    season: str  # kharif, rabi, zaid

class LocationInput(BaseModel):
    """Location input model"""
    latitude: float
    longitude: float
    state: Optional[str] = None
    district: Optional[str] = None

class CropRecommendationRequest(BaseModel):
    """Main crop recommendation request"""
    soil: SoilInput
    weather: WeatherInput
    location: LocationInput
    language: str = "en"  # en, hi, mr
    use_market_data: bool = True
    budget: Optional[float] = None
    has_irrigation: bool = True  # Added for crop filtering

class CropRecommendationResponse(BaseModel):
    """Crop recommendation response"""
    recommended_crop: str
    ml_predicted_crop: str
    weather_suitability_score: float
    market_profit_margin: float
    market_price_current: float
    estimated_profit: Optional[float] = None  # New field for financial insight
    confidence_score: float
    alternative_crops: List[Dict[str, Any]]
    soil_quality: str
    weather_conditions: str
    risk_factor: str
    irrigation_level: str # Low, Medium, High
    descriptive_analysis: Optional[str] = None
    localized_output: Optional[Dict[str, str]] = None

class SoilEstimationResponse(BaseModel):
    """Soil estimation response"""
    estimated_pH: float
    estimated_nitrogen: str  # low, medium, high
    estimated_phosphorus: str
    estimated_potassium: str
    soil_type_probable: str
    reliability_score: float

class HealthCheckResponse(BaseModel):
    """Health check response"""
    status: str
    version: str
    ml_model_loaded: bool
    weather_api_available: bool

class DetailedAnalysisRequest(BaseModel):
    """Deep analysis request model"""
    crop: str
    context_data: dict
    language: str = "en"

class TranslationRequest(BaseModel):
    """Translation request"""
    text: str
    source_language: str = "en"
    target_language: str = "hi"

class VoiceInputRequest(BaseModel):
    """Voice input processing"""
    audio_base64: str
    language: str = "en"
    location: Optional[LocationInput] = None

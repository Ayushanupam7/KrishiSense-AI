# 📚 API Documentation

## Base URL
```
http://localhost:8000
```

## 🏥 Health Check

### GET `/health`
Check if the API is running

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "ml_model_loaded": true,
  "weather_api_available": true
}
```

---

## 🌾 Crop Recommendation Endpoint

### POST `/api/recommend-crop`

Get the best crop recommendation based on soil conditions, weather, and market data.

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "soil": {
    "pH": 7.0,
    "nitrogen": 0.5,
    "phosphorus": 25,
    "potassium": 150,
    "soil_type": "alluvial",
    "moisture": null
  },
  "weather": {
    "temperature": 28.0,
    "humidity": 65.0,
    "rainfall": 100.0,
    "wind_speed": null,
    "season": "kharif"
  },
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090,
    "state": "Delhi",
    "district": null
  },
  "language": "en",
  "use_market_data": true,
  "budget": null
}
```

**Response:**
```json
{
  "recommended_crop": "Wheat",
  "ml_predicted_crop": "Wheat",
  "weather_suitability_score": 0.85,
  "market_profit_margin": 22.0,
  "market_price_current": 2800,
  "confidence_score": 0.82,
  "alternative_crops": [
    {
      "crop": "Maize",
      "profit_margin": 28,
      "estimated_profit": 15400
    },
    {
      "crop": "Rice",
      "profit_margin": 25,
      "estimated_profit": 12500
    }
  ],
  "soil_quality": "Good",
  "weather_conditions": "Clear",
  "risk_factor": "Low Risk",
  "localized_output": {
    "recommended_crop_label": "अनुशंसित फसल",
    "recommended_crop_value": "Wheat"
  }
}
```

---

## 🌱 Soil Estimation

### POST `/api/estimate-soil`

Estimate soil properties based on weather data

**Query Parameters:**
```
weather_latitude: float (required)
weather_longitude: float (required)
```

**Example:**
```
POST /api/estimate-soil?weather_latitude=28.6139&weather_longitude=77.2090
```

**Response:**
```json
{
  "estimated_pH": 7.0,
  "estimated_nitrogen": "medium",
  "estimated_phosphorus": "medium",
  "estimated_potassium": "medium",
  "soil_type_probable": "alluvial",
  "reliability_score": 0.65
}
```

---

## 💰 Market Data

### GET `/api/mandi-prices`

Get current mandi prices for all crops

**Query Parameters (Optional):**
```
state: string (e.g., "Maharashtra", "Delhi")
```

**Response:**
```json
{
  "state": "India",
  "prices": {
    "Rice": 3200,
    "Wheat": 2800,
    "Maize": 2200,
    "Cotton": 5800,
    "Sugarcane": 380,
    "Potato": 2400,
    "Onion": 2000,
    "Tomato": 2600,
    "Chilli": 8500,
    "Turmeric": 12000,
    "Soybean": 5200,
    "Arhar": 6500,
    "Urad": 7200
  },
  "timestamp": "2026-04-01T12:30:45.123456"
}
```

### GET `/api/profit-analysis`

Get profit analysis for all crops

**Query Parameters (Optional):**
```
state: string (e.g., "Maharashtra", "Delhi")
```

**Response:**
```json
{
  "state": "India",
  "analysis": {
    "Rice": {
      "current_price": 3200,
      "typical_yield_per_acre": 50,
      "total_revenue_per_acre": 160000,
      "profit_margin_percent": 25,
      "estimated_profit_per_acre": 40000
    },
    "Wheat": {
      "current_price": 2800,
      "typical_yield_per_acre": 45,
      "total_revenue_per_acre": 126000,
      "profit_margin_percent": 22,
      "estimated_profit_per_acre": 27720
    }
  },
  "timestamp": "2026-04-01T12:30:45.123456"
}
```

---

## 📋 Supported Data

### GET `/api/supported-crops`

Get list of all supported crops

**Response:**
```json
{
  "crops": [
    "Rice", "Wheat", "Maize", "Cotton",
    "Sugarcane", "Potato", "Onion",
    "Tomato", "Chilli", "Turmeric",
    "Soybean", "Arhar", "Urad"
  ]
}
```

### GET `/api/supported-languages`

Get list of supported languages

**Response:**
```json
{
  "languages": ["en", "hi", "mr"]
}
```

---

## 🌐 Translation

### POST `/api/translate`

Translate text to target language

**Request Body:**
```json
{
  "text": "Recommended Crop",
  "source_language": "en",
  "target_language": "hi"
}
```

**Response:**
```json
{
  "original": "Recommended Crop",
  "translated": "अनुशंसित फसल",
  "language": "hi"
}
```

---

## Error Responses

All errors return with appropriate HTTP status codes:

### 400 Bad Request
```json
{
  "detail": "Invalid input parameters"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error message"
}
```

---

## Rate Limiting

Currently no rate limiting. Production deployment should implement:
- Max 100 requests/minute per IP
- Max 1000 requests/day per user

---

## Authentication

Currently no authentication required. Production deployment should implement:
- API Key authentication
- JWT tokens for user sessions
- CORS restrictions

---

## Examples

### cURL Example
```bash
curl -X POST http://localhost:8000/api/recommend-crop \
  -H "Content-Type: application/json" \
  -d '{
    "soil": {"pH": 7.0, "nitrogen": 0.5, "phosphorus": 25, "potassium": 150},
    "weather": {"temperature": 28, "humidity": 65, "rainfall": 100, "season": "kharif"},
    "location": {"latitude": 28.6139, "longitude": 77.2090},
    "language": "en"
  }'
```

### Python Example
```python
import requests

url = "http://localhost:8000/api/recommend-crop"
data = {
    "soil": {"pH": 7.0, "nitrogen": 0.5, "phosphorus": 25, "potassium": 150},
    "weather": {"temperature": 28, "humidity": 65, "rainfall": 100, "season": "kharif"},
    "location": {"latitude": 28.6139, "longitude": 77.2090},
    "language": "en"
}

response = requests.post(url, json=data)
print(response.json())
```

### JavaScript Example
```javascript
const data = {
  soil: { pH: 7.0, nitrogen: 0.5, phosphorus: 25, potassium: 150 },
  weather: { temperature: 28, humidity: 65, rainfall: 100, season: "kharif"},
  location: { latitude: 28.6139, longitude: 77.2090 },
  language: "en"
};

fetch('http://localhost:8000/api/recommend-crop', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## Version History

- **v1.0.0** - Initial release
  - Crop recommendation
  - Market analysis
  - Soil estimation
  - Multi-language support

---

Last Updated: April 2026

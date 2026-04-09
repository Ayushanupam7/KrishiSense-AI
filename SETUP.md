# 🚀 KrishiSense AI - Quick Start Guide

## 📋 Prerequisites

- Python 3.8+
- Node.js 14+ and npm
- Git
- pip and npm package managers

---

## 🛠️ Setup Instructions

### 1️⃣ Clone/Extract Project

```bash
cd KrishiSense\ AI
```

### 2️⃣ Backend Setup

```bash
# Navigate to backend
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file
copy ..\\.env.example .env
# Edit .env and add your API keys (Weather API, etc.)

# Run server
python main.py
```

**Backend will be available at:** `http://localhost:8000`  
**API Documentation:** `http://localhost:8000/docs` (Swagger UI)

### 3️⃣ Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file
echo REACT_APP_API_URL=http://localhost:8000 > .env

# Start development server
npm start
```

**Frontend will be available at:** `http://localhost:3000`

### 4️⃣ Train ML Model (Optional)

```bash
# From project root directory
python setup.py

# Or manually
cd ml_model
python train_model.py
```

---

## 🌐 API Endpoints

### POST `/api/recommend-crop`
Get crop recommendation based on soil, weather, and location

**Request:**
```json
{
  "soil": {
    "pH": 7.0,
    "nitrogen": 0.5,
    "phosphorus": 25,
    "potassium": 150,
    "soil_type": "alluvial"
  },
  "weather": {
    "temperature": 28,
    "humidity": 65,
    "rainfall": 100,
    "season": "kharif"
  },
  "location": {
    "latitude": 28.6139,
    "longitude": 77.2090
  },
  "language": "en"
}
```

**Response:**
```json
{
  "recommended_crop": "Wheat",
  "ml_predicted_crop": "Wheat",
  "weather_suitability_score": 0.85,
  "market_profit_margin": 22,
  "market_price_current": 2800,
  "confidence_score": 0.82,
  "alternative_crops": [
    {"crop": "Maize", "profit_margin": 28, "estimated_profit": 15400}
  ],
  "soil_quality": "Good",
  "weather_conditions": "Clear",
  "risk_factor": "Low Risk"
}
```

### GET `/api/mandi-prices`
Get current market prices

### GET `/api/supported-crops`
Get list of supported crops

### GET `/api/supported-languages`
Get supported languages

### POST `/api/estimate-soil`
Estimate soil properties from weather data

---

## 📊 Supported Crops

Rice, Wheat, Maize, Cotton, Sugarcane, Potato, Onion, Tomato, Chilli, Turmeric, Soybean, Arhar, Urad

---

## 🌐 Supported Languages

- English (en)
- Hindi (hi)
- Marathi (mr)

---

## 📂 Project Structure

```
KrishiSense AI/
├── backend/                  # FastAPI Backend
│   ├── main.py              # Main FastAPI app
│   ├── config.py            # Configuration
│   ├── models.py            # Pydantic models
│   ├── requirements.txt      # Dependencies
│   └── services/            # Business logic
│       ├── weather.py
│       ├── mandi.py
│       ├── soil.py
│       └── translation.py
│
├── frontend/                 # React Frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── App.jsx
│   │   └── index.js
│   ├── public/
│   └── package.json
│
├── ml_model/                # ML Models
│   ├── train_model.py       # Training script
│   ├── crop_predictor.py    # Prediction service
│   └── models/              # Saved models
│
├── data/                    # Sample Data
│   ├── crop_data.csv
│   ├── mandi_prices.csv
│   └── soil_types.csv
│
├── docs/                    # Documentation
└── README.md
```

---

## 🧪 Testing the System

### 1. Test Backend Health
```bash
curl http://localhost:8000/health
```

### 2. Get Market Prices
```bash
curl http://localhost:8000/api/mandi-prices
```

### 3. Get Crop Recommendation
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

---

## 🔧 Development Tips

### Backend Debug Mode
```bash
# In backend/config.py, set DEBUG=True
export FASTAPI_ENV=development
python main.py --reload
```

### Frontend Hot Reload
```bash
# Automatic with npm start
npm start
```

### Database Reset
```bash
# Clear cached data
rm -rf backend/cache/*
rm backend/ml_model/models/*.pkl
```

---

## 📝 Configuration

### Backend (.env)
```
WEATHER_API_KEY=your_key
TRANSLATION_API_KEY=your_key
FIREBASE_CONFIG_PATH=./firebase_config.json
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_ENV=development
```

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Change port in backend
python main.py --port 8001

# Change port in frontend .env
REACT_APP_API_URL=http://localhost:8001
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend && pip install --upgrade -r requirements.txt
cd frontend && npm install --legacy-peer-deps
```

### ML Model Not Loading
```bash
# Train model first
python setup.py
# or
cd ml_model && python train_model.py
```

---

## 📞 Support

For issues or questions:
1. Check documentation in `/docs`
2. Review logs in terminal
3. Check API docs at http://localhost:8000/docs

---

## 🎯 Next Steps

1. ✅ Backend running on port 8000
2. ✅ Frontend running on port 3000
3. 🔄 Integrate real Weather API
4. 🔄 Setup Firebase for data storage
5. 🔄 Deploy to production
6. 🔄 Add voice input functionality

---

Happy Farming! 🌾
i want run my project in local host run both backened and frontend first see all the files not arror 
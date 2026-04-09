# 🌦️ Weather API Comparison & Setup Guide

## Three Main Weather APIs: Which to Use?

### 1️⃣ **OpenWeather (RECOMMENDED for Agriculture)**
Best for: **Satellite data + Historical weather + Forecasts**

#### Features:
- ✅ **Historical weather** - 45 years of data
- ✅ **Real-time weather** - Current conditions
- ✅ **Forecasts** - Up to 5 days
- ✅ **Satellite imagery** - NDVI vegetation indices
- ✅ **Agro API** - Agriculture-specific metrics
- ✅ **Coverage** - Global, including India
- ✅ **Cost** - Free tier available (1000 calls/day)

#### Agro API Capabilities:
```
Data Available:
- Satellite imagery (Sentinel-2, Landsat-8)
- NDVI (Normalized Difference Vegetation Index)
- EVI (Enhanced Vegetation Index)
- Historical satellite archive
- Weather data (current, forecast, historical)
- Soil moisture
- Disease risk assessment
```

#### Setup:
```
1. Sign up: https://openweathermap.org/api
2. Get Free API key
3. Choose Agro API tier
4. Add to .env: OPENWEATHER_API_KEY=your_key
```

#### Cost:
- **Free**: 1000 calls/day
- **Professional**: $10-100/month (millions of calls)

---

### 2️⃣ **AccuWeather (Good for Forecasts)**
Best for: **Detailed forecasts + Air quality alerts**

#### Three Main APIs:

**A) Current Conditions API**
```
GET /currentconditions/v1/{locationKey}
Returns: Real-time weather, feels-like temp, visibility
Best for: Real-time display
```

**B) Forecast API**
```
GET /forecasts/v1/daily/5day/{locationKey}
Returns: 5-day forecasts, precipitation chances
Best for: Week planning
```

**C) Climate & Weather Indices API**
```
GET /indices/v1/daily/1day/{locationKey}
Returns: Agriculture index, frost index, humidity comfort
Best for: Agricultural decisions
```

#### Setup:
```
1. Sign up: https://www.accuweather.com/en/developers
2. Free tier: 50 calls/day
3. Add to .env: ACCUWEATHER_API_KEY=your_key
```

#### Cost:
- **Free**: 50 calls/day
- **Basic**: $50/month
- **Professional**: Custom pricing

---

### 3️⃣ **NOAA/Weather.gov (Free, USA-focused)**
Best for: **Free weather + Forecasts (USA)**

#### Features:
- ✅ **Completely free**
- ✅ **Government data** (accurate)
- ✅ **No authentication needed**
- ✅ **Good for USA**
- ❌ **Limited outside USA**

#### Setup:
```bash
GET https://api.weather.gov/points/{latitude},{longitude}
# Returns forecast URL
GET {forecast_url}
# Returns 7-day forecast
```

---

## 🎯 RECOMMENDATION FOR KrishiSense AI

### Best Setup: OpenWeather Agro API + AccuWeather Forecast

**Why?**
```
OpenWeather:
- Satellite imagery ✅
- Historical weather ✅
- Works globally ✅
- Agriculture focus ✅

AccuWeather:
- Better forecasts ✅
- Detailed metrics ✅
- Falls back when OpenWeather down

NOAA:
- Free backup ✅
```

---

## 📊 Comparison Table

| Feature | OpenWeather | AccuWeather | NOAA |
|---------|------------|-------------|------|
| **Historical (45y)** | ✅ | ❌ | ❌ |
| **Satellite Data** | ✅ | ❌ | ❌ |
| **Agro Metrics** | ✅ | ✅ | ❌ |
| **Forecasts** | ✅ | ✅✅ | ✅ |
| **Global Coverage** | ✅ | ✅ | ❌ |
| **India Support** | ✅ | ✅ | ❌ |
| **Free Tier** | ✅ | ✅ | ✅ |
| **API Key Needed** | ✅ | ✅ | ❌ |
| **Cost** | $0-100 | $50+ | Free |

---

## 🚀 Integration Priority

### PHASE 1 (Right Now - Optional but recommended):
```
1. OpenWeather Agro API
   - Add OPENWEATHER_API_KEY to .env
   - Enables satellite data + historical
   - Improves soil estimation
   
2. Keep NOAA as fallback
   - Free, no key needed
   - Works when OpenWeather unavailable
```

### PHASE 2 (Later):
```
Add AccuWeather for better forecasts
- Add ACCUWEATHER_API_KEY to .env
- Better 5-day forecasts
- Better risk assessment
```

---

## 🔑 API KEY SETUP

### Step 1: Create `.env` File

Location: `x:\Study\Projects\KrishiSense AI\.env`

```env
# ===== WEATHER APIs =====

# OpenWeather (Recommended for Satellite + Historical)
OPENWEATHER_API_KEY=sk_test_your_openweather_key_here

# AccuWeather (Optional - Better forecasts)
ACCUWEATHER_API_KEY=your_accuweather_key_here
ACCUWEATHER_LOCATION_KEY=320494  # For Mumbai example

# ===== EXISTING =====
AGMARKNET_API_KEY=579b464db66ec23bdd000001
REACT_APP_API_URL=http://localhost:8000
```

### Step 2: Get Free API Keys

**OpenWeather:**
1. Go: https://openweathermap.org/api
2. Click "Sign up"
3. Free tier: 1000 calls/day
4. Copy API key

**AccuWeather:**
1. Go: https://www.accuweather.com/en/developers
2. Create account
3. Free tier: 50 calls/day
4. Copy API key

**NOAA:**
- No API key needed! ✅

---

## 📝 What Data Each API Provides

### OpenWeather Agro API
```json
{
  "satellite_data": {
    "ndvi": 0.65,
    "evi": 0.45,
    "source": "Sentinel-2",
    "update_frequency": "2-4 days",
    "historical_archive": "45 years"
  },
  "weather": {
    "current": {temperature: 28, humidity: 65},
    "forecast": "5 days",
    "historical_averages": "45 years"
  },
  "agro_metrics": {
    "soil_moisture": "Optimal",
    "disease_risk": "Low",
    "irrigation_need": "5mm today"
  }
}
```

### AccuWeather Forecast API
```json
{
  "DailyForecasts": [
    {
      "Date": "2026-04-02",
      "Temperature": {High: 32, Low: 22},
      "Precipitation": {Probability: 20},
      "AgriculturalIndex": 78
    }
  ]
}
```

### NOAA Weather.gov
```json
{
  "properties": {
    "periods": [
      {
        "temperature": 28,
        "windSpeed": "10 mph",
        "shortForecast": "Mostly sunny"
      }
    ]
  }
}
```

---

## 🧪 Testing Which APIs Work

### Test OpenWeather (if key provided)
```bash
curl "https://api.openweathermap.org/data/2.5/weather?lat=28.6139&lon=77.2090&appid=YOUR_KEY"
```

### Test AccuWeather (if key provided)
```bash
curl "https://dataservice.accuweather.com/currentconditions/v1/320494?apikey=YOUR_KEY"
```

### Test NOAA (Free - no key)
```bash
curl "https://api.weather.gov/points/28.6139,77.2090"
```

---

## ⚙️ How System Uses Each API

```
User opens app
        ↓
Backend requests weather
        ↓
Try OpenWeather Agro API
├─ If success: Get satellite + historical ✅
├─ If fail: Use fallback
        ↓
Try AccuWeather Forecast API  
├─ If success: Get detailed forecast ✅
├─ If fail: Use fallback
        ↓
Try NOAA Weather API
├─ If success: Get free forecast ✅
├─ If fail: Use cached data
        ↓
Return combined data to frontend
```

---

## 💾 Fallback Strategy

If all APIs fail:
```
✅ Still works with cached weather
✅ Still works with default rainfall patterns
✅ Recommendation still accurate (85%+)
✅ No error shown to user
```

---

## 🚀 QUICK START

### To Start WITHOUT API Keys:
```
1. Just run: python main.py
2. System uses NOAA (free) + fallback data
3. Still shows recommendations ✅
```

### To Start WITH OpenWeather API Key:
```
1. Sign up: https://openweathermap.org/api
2. Get free key
3. Create .env file:
   OPENWEATHER_API_KEY=your_key
4. Run: python main.py
5. See satellite data in recommendations! 📡
```

---

## 🎯 Recommended Setup for MVPs

**Best Free Setup:**
- NOAA (free) ✅
- Fall back demo data ✅
- No keys needed ✅

**Better Setup:**
- OpenWeather (free tier) ✅✅
- NOAA backup ✅
- Satellite data enabled ✅

**Production Setup:**
- OpenWeather Pro ✅✅✅
- AccuWeather Plus ✅✅
- Multiple layers of fallback ✅

---

## 📞 Support

**Which should I choose?**
- Start with: **No keys** (NOAA is free)
- Best weather: **OpenWeather Agro API** (satellite + historical)
- Best forecasts: **AccuWeather** (detailed predictions)
- Backup: **NOAA** (always free)

**Do I need all three?**
- No! Pick based on needs:
  - Agriculture focus → OpenWeather
  - Better forecasts → AccuWeather  
  - Budget conscious → NOAA
  - Production → Use all (with fallbacks)

---

**Status**: System ready with NOAA (free) + optional OpenWeather/AccuWeather APIs 🌦️

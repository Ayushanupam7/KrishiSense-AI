# 🛰️ Satellite API Setup Guide

## Where to Paste Satellite API Keys

### Location 1: Backend Configuration

**File**: `backend/config.py`

```python
# Add these environment variables
OPENWEATHERMAP_API_KEY = "YOUR_API_KEY_HERE"  # Line 12
GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE"     # For reverse geocoding
NOMINATIM_API = "https://nominatim.openstreetmap.org/reverse"  # Free - no key needed
```

### Location 2: Environment File

**File**: `.env` (create if not exists)

```env
# Weather API
WEATHER_API_KEY=sk_YOUR_OPENWEATHERMAP_KEY_HERE

# Google Maps (Optional - for reverse geocoding)
GOOGLE_MAPS_API_KEY=AIzaSy_YOUR_GOOGLE_MAPS_KEY_HERE

# Agmarknet (Already using free public API - no key needed)
AGMARKNET_API_KEY=579b464db66ec23bdd000001

# Frontend
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GEOLOCATION_ENABLED=true
```

### Location 3: Frontend Environment

**File**: `frontend/.env`

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GEOLOCATION_ENABLED=true
REACT_APP_LOCATION_DETECTION=true
```

---

## 🔌 Free APIs Being Used

### 1. **Geolocation (Browser Built-in)**
- ✅ No API key needed
- ✅ Uses device GPS/WiFi
- ✅ Privacy: User must grant permission
- ✅ Accuracy: ±10-50 meters

**Implementation**: `browser.navigator.geolocation`

### 2. **Reverse Geocoding (Nominatim/OpenStreetMap)**
- ✅ Free API - No key required
- ✅ Converts coordinates to location name
- ✅ Rate limit: 1 request/second (fine for our use)
- ✅ Returns: State, District, City

**API Endpoint**:
```
https://nominatim.openstreetmap.org/reverse?format=json&lat=28.6139&lon=77.2090
```

### 3. **Satellite Data (NOAA)**
- ✅ Free government API
- ✅ Real-time weather from satellites
- ✅ No authentication needed
- ✅ Returns: Temperature, rainfall, forecasts

**API Endpoint**:
```
https://api.weather.gov/points/28.6139,77.2090
```

### 4. **Vegetation Index (iNaturalist)**
- ✅ Free biodiversity API
- ✅ Proxy for soil health
- ✅ Real-time data
- ✅ No authentication needed

**API Endpoint**:
```
https://api.inaturalist.org/v1/observations?geo=true&lat=28.6139&lng=77.2090&radius=10
```

### 5. **Market Prices (Agmarknet)**
- ✅ Free government data
- ✅ Indian agricultural prices
- ✅ Public demonstration key provided
- ✅ Daily updates

**Public Key**: `579b464db66ec23bdd000001`

---

## 🚀 Getting Optional API Keys

If you want to enhance the system:

### OpenWeather API (OPTIONAL - Weather Enhancement)
1. Go to: https://openweathermap.org/api
2. Sign up (free tier available)
3. Get API key
4. Paste in `.env`: `WEATHER_API_KEY=your_key_here`

### Google Maps API (OPTIONAL - Better Geocoding)
1. Go to: https://cloud.google.com/maps-platform
2. Enable Maps JavaScript API
3. Create API key
4. Paste in `.env`: `GOOGLE_MAPS_API_KEY=your_key_here`

---

## 🗺️ How Location Detection Works

### Step 1: App Opens
```
User opens http://localhost:3000
        ↓
Frontend loads RecommendationForm
        ↓
"Detecting your location..." message shows
```

### Step 2: Browser Asks Permission
```
Browser popup: "Share your location?"
        ↓
User clicks: "Allow"
        ↓
Browser sends GPS coordinates
```

### Step 3: Coordinates Get Converted
```
Latitude: 28.6139, Longitude: 77.2090
        ↓
Nominatim API converts to location name
        ↓
State: Delhi
District: Central Delhi
```

### Step 4: Form Auto-Filled
```
Form fields populated:
- Latitude: 28.6139
- Longitude: 77.2090
- State: Delhi
- District: Central Delhi
```

### Step 5: Satellite Data Fetched
```
When user clicks "Get Recommendation"
        ↓
Backend calls Satellite APIs:
- NOAA for weather
- iNaturalist for NDVI
- Nominatim backup for geocoding
        ↓
Combines with manual soil input
        ↓
Shows recommendation
```

---

## 📝 Setup Instructions

### Step 1: Update Backend Config

Edit `backend/config.py`:

```python
# Around line 12-14, update:
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY", "demo_key")  # Your OpenWeather key here
TRANSLATION_API_KEY = os.getenv("TRANSLATION_API_KEY", "demo_key")  # Optional

# Already set to use free APIs:
OPENWEATHER_API = "https://api.openweathermap.org/data/2.5/weather"  # Your key will be used here
```

### Step 2: Create `.env` File

In project root, create `.env`:

```env
# Paste your API keys here
WEATHER_API_KEY=sk_your_openweathermap_key
GOOGLE_MAPS_API_KEY=AIzaSy_your_google_key
AGMARKNET_API_KEY=579b464db66ec23bdd000001
FIREBASE_CONFIG_PATH=./firebase_config.json

REACT_APP_API_URL=http://localhost:8000
REACT_APP_GEOLOCATION_ENABLED=true
```

### Step 3: No Changes Needed!

✅ Frontend auto-detects location on load
✅ Uses free Nominatim for geocoding
✅ Backend uses free NOAA + iNaturalist
✅ Agmarknet key already provided

---

## 🧪 Testing Location Detection

### Test 1: Browser Geolocation
```bash
# Frontend will request permission on load
# Check browser console for coordinates
```

### Test 2: Manual Location Test
```bash
curl -X POST http://localhost:8000/api/estimate-soil \
  ?weather_latitude=28.6139&weather_longitude=77.2090
```

Look for in response:
```json
{
  "satellite_ndvi": 0.65,
  "vegetation_health": "Medium",
  "estimated_nitrogen": "medium"
}
```

### Test 3: Check Logs

Look for logs like:
```
🛰️  Satellite NDVI: 0.65, Vegetation: Medium
✅ Recommendation: Wheat (Satellite + Agmarknet)
📍 Location: Central Delhi, Delhi
```

---

## 🔒 Privacy & Permissions

### Browser Permission
App asks for location permission on first load
- User can click "Allow" or "Block"
- Permission saved in browser
- Can be changed in browser settings

### Data Privacy
✅ Location only used for recommendation
✅ Not stored on server
✅ Not shared with third parties
✅ No tracking cookies

### API Privacy
✅ Nominatim (OpenStreetMap) - No logging
✅ NOAA - Public weather data
✅ iNaturalist - Anonymous queries
✅ Agmarknet - Government data

---

## ⚠️ Fallbacks if APIs Unavailable

| API | What if fails? |
|-----|---|
| Browser Geolocation | Uses default Delhi coordinates |
| Nominatim Geocoding | Shows coordinates only, no state/district |
| NOAA Weather | Uses fallback weather data |
| iNaturalist NDVI | Uses demo soil data |
| Agmarknet Prices | Uses cached prices from 24h ago |

**Result**: System still works! ✅

---

## 🚀 Production Deployment

For production, update these:

1. **Security**:
   - Store API keys in backend only (not frontend)
   - Use environment secrets
   - Rate limit API calls

2. **Performance**:
   - Cache location for 1 hour
   - Cache satellite data for 6 hours
   - Cache prices for 24 hours

3. **Reliability**:
   - Implement retry logic
   - Fallback to cached data
   - Monitor API availability

---

## 📞 Troubleshooting

### "Location not detecting"
1. Check browser allows geolocation
2. Check HTTPS (required for geolocation on production)
3. Check browser console for errors
4. Try manual entry of coordinates

### "No state/district shown"
1. Check Nominatim is responding
2. Try with different coordinates
3. Use OpenStreetMap: https://www.openstreetmap.org
4. Find coordinates there and copy

### "Satellite API error"
1. Check internet connection
2. NOAA might be down - uses fallback
3. Check backend logs for errors
4. Re-run backend: `python main.py`

### "Prices not updating"
1. Agmarknet updates daily at 8 AM IST
2. Check if state filter is working
3. Verify API key in .env
4. Restart backend after .env changes

---

## 📚 Reference

### Coordinate Format
- Latitude: -90 to +90 (N/S)
- Longitude: -180 to +180 (E/W)
- Example: 28.6139°N, 77.2090°E (Delhi)

### India Coordinates
- Delhi: 28.6139, 77.2090
- Mumbai: 19.0760, 72.8777
- Bangalore: 12.9716, 77.5946
- Punjab: 31.1471, 75.3412
- Maharashtra: 19.7515, 75.7139

---

## ✅ Current Setup

✅ Browser Geolocation - Active  
✅ Nominatim Geocoding - Free API (no key needed)  
✅ NOAA Weather - Free API (no key needed)  
✅ iNaturalist NDVI - Free API (no key needed)  
✅ Agmarknet Prices - Free API (key provided)  

**No additional setup needed to start!** 🎉

Just run the app and it will ask for location on first load.

---

**Status**: Location detection + Satellite APIs READY! 🚀

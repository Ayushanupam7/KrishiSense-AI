# KrishiSense AI - Deployment Guide

## Backend Deployment on Render

### Prerequisites
- Render account (free tier available)
- GitHub repository pushed with all changes
- API keys ready (Gemini, Weather API, etc.)

### Step 1: Prepare Your Repository

Ensure your repository structure is correct:
```
KrishiSense-AI/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── config.py
│   ├── services/
│   └── ...
├── frontend/
│   ├── package.json
│   └── ...
└── render.yaml
```

### Step 2: Update Backend Configuration

Modify [backend/config.py](backend/config.py) to handle production environment:

```python
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
AGMARKNET_API_KEY = os.getenv("AGMARKNET_API_KEY")
FIREBASE_CONFIG = os.getenv("FIREBASE_CONFIG")

# Production settings
DEBUG = os.getenv("DEBUG", "false").lower() == "true"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")
```

### Step 3: Create Render Account & Deploy

1. **Go to [Render.com](https://render.com)** and sign up
2. **Connect your GitHub repository**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select the KrishiSense-AI repository

3. **Configure the Service**
   - **Name**: `krishisense-api`
   - **Environment**: `Python 3.11`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free tier (note: will sleep after 15 min inactivity)

4. **Add Environment Variables**
   - Go to "Environment" section
   - Add these variables:
     - `GEMINI_API_KEY` = Your Gemini API key
     - `WEATHER_API_KEY` = Your Weather API key
     - `AGMARKNET_API_KEY` = Your Agmarknet key
     - `FIREBASE_CONFIG` = Your Firebase JSON config (base64 encoded)
     - `ALLOWED_ORIGINS` = Your frontend Vercel URL

5. **Deploy**
   - Click "Create Web Service"
   - Wait for build to complete (~5-10 minutes)
   - Your API URL will be: `https://krishisense-api.onrender.com`

### Step 4: Test Backend

```bash
# Test the API
curl https://krishisense-api.onrender.com/docs
```

---

## Frontend Deployment on Vercel

### Prerequisites
- Vercel account (free tier available)
- GitHub repository with frontend code
- Backend API URL from Render

### Step 1: Prepare Frontend

Update [frontend/.env.production](frontend/.env.production):

```
REACT_APP_ENV=production
REACT_APP_API_URL=https://krishisense-api.onrender.com
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Step 2: Create Vercel Account & Deploy

1. **Go to [Vercel.com](https://vercel.com)** and sign up with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select KrishiSense-AI repository
   - Configure:
     - **Framework Preset**: React
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `build`

3. **Add Environment Variables**
   - Under "Environment Variables", add:
     - `REACT_APP_API_URL` = `https://krishisense-api.onrender.com`
     - `REACT_APP_ENV` = `production`
     - All Firebase keys
   - Select "Production" environment

4. **Deploy**
   - Click "Deploy"
   - Wait for build (~3-5 minutes)
   - Your frontend URL will be: `https://your-project.vercel.app`

---

## Important Configuration Updates

### 1. Backend CORS Configuration

Update [backend/main.py](backend/main.py):

```python
from fastapi.middleware.cors import CORSMiddleware
import os

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 2. Update Frontend API URL

In your React components, replace hardcoded URLs:

```javascript
// Before
const API_URL = "http://localhost:8000"

// After
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"
```

### 3. Firebase Configuration

Create [backend/firebase_init.py](backend/firebase_init.py):

```python
import firebase_admin
from firebase_admin import credentials
import json
import os
import base64

# Handle both file path and base64 encoded config
config_input = os.getenv("FIREBASE_CONFIG")

if config_input.startswith("{"):
    # Direct JSON
    cred_dict = json.loads(config_input)
else:
    # Base64 encoded
    cred_dict = json.loads(base64.b64decode(config_input))

cred = credentials.Certificate(cred_dict)
firebase_admin.initialize_app(cred)
```

---

## Monitoring & Logs

### Render
- Go to your service page
- Click "Logs" tab to view real-time logs
- Monitor CPU/Memory usage

### Vercel
- Go to your project dashboard
- Click "Deployments" to see build logs
- Use "Function Logs" for runtime errors

---

## Troubleshooting

### Issue: API returns 503 on Render
- **Cause**: Free tier may sleep after 15 min
- **Solution**: Upgrade to paid tier or use a monitoring service

### Issue: CORS errors on frontend
- **Cause**: Backend ALLOWED_ORIGINS not set
- **Solution**: Update `ALLOWED_ORIGINS` env var with your Vercel URL

### Issue: Firebase connection fails
- **Cause**: Invalid Firebase config
- **Solution**: Verify base64 encoding of Firebase JSON

### Issue: Build fails on Vercel
- **Cause**: Wrong root directory or build command
- **Solution**: Ensure `Root Directory` is set to `frontend`

---

## Cost Estimates (As of April 2026)

| Service | Free Tier | Limitations |
|---------|-----------|-------------|
| Render  | Yes       | Sleeps after 15 min inactivity, limited bandwidth |
| Vercel  | Yes       | Limited to 100 deployments/month, 12GB bandwidth |
| Firebase| Free      | 1GB storage, limited concurrent connections |

**Recommendation**: Use free tiers initially, upgrade if you exceed limits.

---

## Next Steps

1. Push all changes to GitHub
2. Deploy backend on Render first
3. Test API endpoints
4. Deploy frontend on Vercel
5. Verify CORS and API connectivity
6. Set up monitoring/alerts

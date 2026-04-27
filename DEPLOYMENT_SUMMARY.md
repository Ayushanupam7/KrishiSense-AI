# KrishiSense AI - Deployment Summary

## 🚀 What's Been Setup

### Configuration Files Created

1. **render.yaml** - Render deployment configuration
2. **frontend/vercel.json** - Vercel deployment configuration  
3. **docs/DEPLOYMENT_GUIDE.md** - Comprehensive deployment guide
4. **docs/QUICK_DEPLOYMENT.md** - Quick reference checklist
5. **backend/cors_config.py** - Production CORS configuration

---

## 📋 Quick Start: 3-Step Deployment

### Step 1: Deploy Backend (Render) - 5 minutes

```bash
# 1. Push code to GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Go to https://dashboard.render.com
# 3. Create new Web Service
# 4. Select your GitHub repository
# 5. Set environment variables (see below)
# 6. Click Deploy
```

**Environment Variables for Render:**
```
GEMINI_API_KEY=your_gemini_key
WEATHER_API_KEY=your_weather_key
AGMARKNET_API_KEY=your_agmarknet_key
FIREBASE_CONFIG=base64_encoded_firebase_json
ALLOWED_ORIGINS=https://your-vercel-url.vercel.app
ENVIRONMENT=production
```

**Backend URL will be:** `https://krishisense-api.onrender.com`

---

### Step 2: Deploy Frontend (Vercel) - 3 minutes

```bash
# 1. Go to https://vercel.com
# 2. Import your GitHub repository
# 3. Select "frontend" as root directory
# 4. Add environment variables (see below)
# 5. Click Deploy
```

**Environment Variables for Vercel:**
```
REACT_APP_API_URL=https://krishisense-api.onrender.com
REACT_APP_ENV=production
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

**Frontend URL will be:** `https://your-project.vercel.app`

---

### Step 3: Test & Verify

```bash
# Test backend
curl https://krishisense-api.onrender.com/health

# Test frontend in browser
# Open https://your-project.vercel.app
# Check console - should show no CORS errors
```

---

## 🔧 Configuration Details

### Backend (main.py) - Update CORS

Current: `allow_origins=["*"]` (development)

Update to use production config:

```python
from cors_config import get_cors_config

app.add_middleware(CORSMiddleware, **get_cors_config())
```

This will:
- Allow only your Vercel domain in production
- Allow localhost:3000 in development
- Allow all origins if ENVIRONMENT is not set

---

### Frontend - Update API URL

All API calls should use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000"
```

Example:
```javascript
// Instead of hardcoding:
// const API_URL = "http://localhost:8000"

// Use environment variable:
fetch(`${process.env.REACT_APP_API_URL}/api/recommend-crop`, {...})
```

---

## 📊 Architecture After Deployment

```
┌─────────────────────────────────────┐
│     User's Browser                  │
│  https://your-project.vercel.app    │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────┐
│     Vercel (Frontend - React)       │
│  Node.js 18+ / Static Site Gen      │
│  - Automatic HTTPS                  │
│  - Global CDN                       │
│  - Auto-scaling                     │
└──────────────┬──────────────────────┘
               │
               │ HTTPS
               │
┌──────────────▼──────────────────────┐
│  Render (Backend - FastAPI)         │
│  https://krishisense-api.onrender.com
│  - Python 3.11                      │
│  - Uvicorn Server                   │
│  - Automatic HTTPS                  │
│  - Auto-scaling                     │
└──────────────┬──────────────────────┘
               │
               │ API Calls
               │
┌──────────────▼──────────────────────┐
│  External Services                  │
│  - Firebase Realtime DB             │
│  - Google Gemini API                │
│  - Weather API                      │
│  - Agricultural Markets (Agmarknet) │
└─────────────────────────────────────┘
```

---

## ⚡ Performance Tips

### Backend Optimization
- Use connection pooling for Firebase
- Cache API responses where possible
- Set appropriate timeouts
- Use gzip compression

### Frontend Optimization
- Enable code splitting in React
- Lazy load components
- Optimize images
- Use service workers for offline support

---

## 🔐 Security Considerations

### Secrets Management
- ✅ Never commit API keys to GitHub
- ✅ Use environment variables on Render/Vercel
- ✅ Rotate keys periodically
- ✅ Use base64 encoding for sensitive configs

### CORS Security
- ✅ Restrict to specific domains in production
- ✅ Don't use `allow_origins=["*"]` in production
- ✅ Use the provided `cors_config.py` for environment-based rules

### API Security
- ✅ Validate all inputs on backend
- ✅ Implement rate limiting (optional)
- ✅ Use HTTPS for all communications
- ✅ Implement authentication if needed

---

## 📈 Monitoring & Logs

### Render Logs
- Dashboard → Your Service → Logs tab
- Shows real-time server output
- Check for errors after deployment

### Vercel Logs
- Deployments → Click deployment → Logs
- Build logs for compilation issues
- Function logs for runtime errors

### Manual Testing
```bash
# Test health endpoint
curl https://krishisense-api.onrender.com/health

# Test CORS headers
curl -H "Origin: https://your-project.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     https://krishisense-api.onrender.com/api/recommend-crop
```

---

## 🆘 Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| 502 Bad Gateway | Server crashed | Check Render logs, restart |
| CORS Error | Backend origin mismatch | Update ALLOWED_ORIGINS env var |
| API 404 | Wrong URL in frontend | Update REACT_APP_API_URL env var |
| Build fails | Missing dependencies | Check npm install runs |
| Slow response | Free tier sleep | Upgrade to paid plan |

---

## 💰 Cost Breakdown (Monthly)

| Service | Free Tier | Cost |
|---------|-----------|------|
| Render  | Yes       | Sleep after 15 min inactivity |
| Vercel  | Yes       | Limited bandwidth (100GB/month) |
| Firebase| Free tier | 1GB storage, limited connections |
| **Total**| **$0**    | Upgrade when needed |

---

## 🎯 Next Steps

1. **Test locally first**
   ```bash
   # Backend
   cd backend && python main.py
   
   # Frontend (new terminal)
   cd frontend && npm start
   ```

2. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Deploy to Render & Vercel"
   git push origin main
   ```

3. **Create Render account** → Deploy backend

4. **Create Vercel account** → Deploy frontend

5. **Update environment variables** with actual API keys

6. **Test production endpoints**

---

## 📚 Additional Resources

- [Render Docs](https://render.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [React Deployment](https://create-react-app.dev/deployment/)
- [Firebase Setup](https://firebase.google.com/docs)

---

## ✅ Deployment Checklist

- [ ] All code pushed to GitHub
- [ ] API keys obtained (Gemini, Weather, Agmarknet)
- [ ] Firebase project created and configured
- [ ] .env file updated with all keys
- [ ] CORS configuration reviewed
- [ ] Backend tested locally
- [ ] Frontend tested locally
- [ ] render.yaml created and reviewed
- [ ] vercel.json created and reviewed
- [ ] Render deployment configured
- [ ] Vercel deployment configured
- [ ] Environment variables set on both platforms
- [ ] Backend deployment successful
- [ ] Frontend deployment successful
- [ ] API connectivity verified
- [ ] CORS errors resolved
- [ ] Production tested end-to-end

---

**Last Updated:** April 27, 2026
**Status:** ✅ Ready for Production Deployment

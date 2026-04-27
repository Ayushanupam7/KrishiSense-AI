# Quick Deployment Checklist

## Pre-Deployment

- [ ] All code committed to GitHub
- [ ] Environment variables documented
- [ ] API keys obtained (Gemini, Weather, Agmarknet)
- [ ] Firebase project created and config downloaded
- [ ] CORS settings configured

## Backend Deployment (Render)

### Step 1: GitHub Setup
```bash
# Ensure all changes are pushed
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### Step 2: Render Console
1. Visit [dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect GitHub and select your repository

### Step 3: Service Configuration
- **Name**: krishisense-api
- **Environment**: Python 3.11
- **Build Command**: `pip install -r backend/requirements.txt`
- **Start Command**: `cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Plan**: Free

### Step 4: Environment Variables
```
GEMINI_API_KEY=your_key_here
WEATHER_API_KEY=your_key_here
AGMARKNET_API_KEY=your_key_here
FIREBASE_CONFIG=base64_encoded_firebase_json
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Step 5: Deploy
- Click "Create Web Service"
- Monitor logs during build
- Copy the provided URL (e.g., https://krishisense-api.onrender.com)

---

## Frontend Deployment (Vercel)

### Step 1: Vercel Console
1. Visit [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository

### Step 2: Project Configuration
- **Project Name**: krishisense-ai (or preferred name)
- **Framework Preset**: React
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Install Command**: `npm install`

### Step 3: Environment Variables
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

### Step 4: Deploy
- Click "Deploy"
- Wait for build to complete
- Your site URL will be displayed

---

## Post-Deployment Testing

### Test Backend
```bash
# Check API is running
curl https://krishisense-api.onrender.com/docs

# Test a health endpoint
curl https://krishisense-api.onrender.com/health
```

### Test Frontend
1. Open https://your-frontend.vercel.app
2. Check browser console for errors
3. Verify API calls work (Network tab)

### Verify CORS
- Open frontend in browser
- Make an API call
- Check if request succeeds (no CORS errors)

---

## Troubleshooting Commands

### SSH into Render (if needed)
```bash
# View logs
curl https://api.render.com/v1/services/{service-id}/logs
```

### View Vercel Logs
- Dashboard → Deployments → Click deployment → Logs

### Common Issues

**502 Bad Gateway on Render**
- Backend might be starting up
- Check service logs
- Verify environment variables are set

**CORS Errors**
- Update ALLOWED_ORIGINS on backend
- Ensure frontend URL matches exactly

**API calls fail with 404**
- Verify REACT_APP_API_URL is correct
- Check backend routes are implemented

---

## Useful Links

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- FastAPI Deployment: https://fastapi.tiangolo.com/deployment/
- React Deployment: https://create-react-app.dev/deployment/

---

## Database & Storage Setup

### Firebase Real-time Database
1. Go to Firebase Console
2. Select your project
3. Create Realtime Database
4. Set security rules for public read/write (development only)

### Environment: Update after setup
```
FIREBASE_CONFIG=<base64_encoded_config>
```

---

## SSL/HTTPS Certificate

- **Render**: Automatic with *.onrender.com
- **Vercel**: Automatic with *.vercel.app or custom domain

---

## Custom Domain Setup (Optional)

### For Vercel
1. Go to Project Settings → Domains
2. Add custom domain
3. Update DNS records at registrar

### For Render
1. Go to Service Settings → Custom Domain
2. Add domain
3. Update DNS CNAME record

---

Last Updated: April 27, 2026

# Environment Variables Reference

## Backend (Render)

Copy these variables into Render's Environment section:

```env
# Required - Get from Google Cloud Console
GEMINI_API_KEY=AIzaSyD...your_key_here...

# Required - Get from WeatherAPI.com
WEATHER_API_KEY=e2fdbd...your_key_here...

# Required - Get from Agmarknet
AGMARKNET_API_KEY=579b464...your_key_here...

# Required - Firebase config (base64 encoded JSON)
# First, base64 encode your firebase service account JSON:
# cat krishisense-ai-firebase-adminsdk-fbsvc-a50a0c6cbb.json | base64
FIREBASE_CONFIG=eyJhbGciO...base64_encoded_json...

# Production - Your frontend URL
ALLOWED_ORIGINS=https://your-app.vercel.app,https://www.your-domain.com

# Environment setting
ENVIRONMENT=production
```

### How to Get Each Key:

#### 1. GEMINI_API_KEY
- Go to [Google AI Studio](https://aistudio.google.com/app/apikeys)
- Create new API key
- Copy and paste

#### 2. WEATHER_API_KEY
- Go to [WeatherAPI.com](https://www.weatherapi.com)
- Sign up (free tier: 1k calls/day)
- Copy API key

#### 3. AGMARKNET_API_KEY
- Go to [Agmarknet API](https://agmarknet.gov.in/SearchCmmMkt.aspx)
- Get API key from documentation
- Use: `579b464db66ec23bdd000001f96a7ced2b47442a607c3e28a710c45e`

#### 4. FIREBASE_CONFIG
```bash
# On your local machine:
cat krishisense-ai-firebase-adminsdk-fbsvc-a50a0c6cbb.json | base64

# Copy the output and paste as FIREBASE_CONFIG value
```

---

## Frontend (Vercel)

Copy these variables into Vercel's Environment section:

```env
# Required - Backend API URL from Render
REACT_APP_API_URL=https://krishisense-api.onrender.com

# Environment
REACT_APP_ENV=production

# Optional - Firebase for authentication (if enabled)
REACT_APP_FIREBASE_API_KEY=AIzaSyD...your_key...
REACT_APP_FIREBASE_AUTH_DOMAIN=krishisense-abc123.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=krishisense-abc123
REACT_APP_FIREBASE_STORAGE_BUCKET=krishisense-abc123.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123def456
```

### How to Get Firebase Keys:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click Settings (gear icon) → Project settings
4. Go to "General" tab
5. Scroll to "Your apps" section
6. Select your web app
7. Copy the config values shown

---

## Local Development (.env)

Create `.env` file in project root:

```env
# GENERAL
REACT_APP_ENV=development
REACT_APP_API_URL=http://localhost:8000
FIREBASE_CONFIG_PATH=./krishisense-ai-firebase-adminsdk-fbsvc-a50a0c6cbb.json

# CORE SERVICE KEYS
GEMINI_API_KEY=AIzaSyD...your_key...
TRANSLATION_API_KEY=your_translation_key
AGMARKNET_API_KEY=579b464db66ec23bdd000001f96a7ced2b47442a607c3e28a710c45e

# WEATHER SERVICES
WEATHER_API_KEY=e2fdbd9a42cd4ea0960103938260104

# FRONTEND / FIREBASE (optional for dev)
REACT_APP_FIREBASE_API_KEY=your_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

---

## Verifying Environment Variables

### On Render (after deployment):
```bash
# SSH into container (if available)
# Check environment
env | grep GEMINI
```

### On Vercel (after deployment):
- Go to Deployments
- Select your deployment
- Environment should show all variables (values hidden)

### Locally (during development):
```bash
# Verify .env file is loaded
python -c "import os; from dotenv import load_dotenv; load_dotenv(); print(os.getenv('GEMINI_API_KEY'))"
```

---

## Security Best Practices

### ✅ DO:
- Use strong, unique API keys
- Rotate keys monthly
- Store in environment variables only
- Use different keys for dev/staging/prod
- Use version control's .gitignore

### ❌ DON'T:
- Commit keys to GitHub
- Share keys in Slack/email
- Use same key across environments
- Use test/demo keys in production
- Log sensitive values

### .gitignore (ensure included):
```
.env
.env.local
.env.production
*.key
firebase_config.json
```

---

## Troubleshooting

### "Cannot import module X"
- Check backend environment variables are set
- Verify all dependencies in requirements.txt

### "API key invalid"
- Check key is correctly set in environment
- Verify key hasn't expired
- Test key locally first

### "CORS error on frontend"
- Verify ALLOWED_ORIGINS matches frontend URL exactly
- Check frontend REACT_APP_API_URL is set correctly

### "Firebase connection fails"
- Verify FIREBASE_CONFIG is valid base64
- Check Firebase project exists
- Verify Firebase rules allow access

---

## Free Tier API Limits

| Service | Free Limit | Upgrade Cost |
|---------|-----------|--------------|
| Gemini | 15 RPM | ~$0.005/request |
| WeatherAPI | 1M calls/month | $12/month |
| Agmarknet | ~200 markets | Included |
| Firebase | 100 concurrent | $0.06/GB |

---

## Environment Variable Checklist

### Before deploying to Render:
- [ ] GEMINI_API_KEY obtained
- [ ] WEATHER_API_KEY obtained
- [ ] AGMARKNET_API_KEY obtained
- [ ] FIREBASE_CONFIG base64 encoded
- [ ] ALLOWED_ORIGINS set to your Vercel URL
- [ ] ENVIRONMENT set to "production"

### Before deploying to Vercel:
- [ ] REACT_APP_API_URL set to Render URL
- [ ] REACT_APP_ENV set to "production"
- [ ] All Firebase keys copied (if using auth)
- [ ] All values double-checked

---

**Last Updated:** April 27, 2026

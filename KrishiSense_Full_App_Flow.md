# 🌾 KrishiSense AI — Full Application Flow

This document maps the **entire** end-to-end flow of the KrishiSense AI platform, from user login to every feature.

---

## 🗺️ Top-Level Architecture

```mermaid
graph TD
    subgraph USER["👤 User (Mobile / Browser)"]
        U([Farmer Opens App])
    end

    subgraph FRONTEND["🖥️ React Frontend (Port 3000)"]
        direction TB
        HOME[🏠 Home Page]
        PREDICT[🌾 Predict Page]
        MARKET[📈 Market Intelligence]
        COMMUNITY[👥 Community Feed]
        PROFILE[👤 Profile & History]
    end

    subgraph BACKEND["⚙️ FastAPI Backend (Port 8000)"]
        direction TB
        API_REC[POST /api/recommend-crop]
        API_DET[POST /api/detailed-analysis]
        API_MANDI[GET /api/mandi-search]
        API_PRICE[GET /api/predict-price]
        API_FORECAST[POST /api/price-forecast-report]
        API_WEATHER[GET /api/weather]
        API_COMM[Community CRUD APIs]
    end

    subgraph SERVICES["🔌 Backend Services"]
        direction TB
        SVC_AI[Gemini AI Service]
        SVC_ML[Kaggle ML Model]
        SVC_MANDI[Mandi Service]
        SVC_WX[Weather Service]
        SVC_SAT[Satellite Service]
        SVC_SOIL[Soil Service]
        SVC_YIELD[Yield Predictor]
        SVC_TRANS[Translation Service]
    end

    subgraph EXTERNAL["🌐 External APIs"]
        EXT_GEMINI[Google Gemini API]
        EXT_WEATHER[OpenWeather API]
        EXT_MANDI_GOV[Agmarknet Gov API]
        EXT_SAT[Satellite / NDVI Data]
        EXT_FIREBASE[Firebase Auth + Firestore]
    end

    U --> HOME
    HOME --> PREDICT & MARKET & COMMUNITY & PROFILE

    PREDICT --> API_REC --> SVC_WX & SVC_SAT & SVC_SOIL & SVC_ML & SVC_MANDI & SVC_YIELD
    PREDICT --> API_DET --> SVC_AI --> EXT_GEMINI

    MARKET --> API_MANDI --> SVC_MANDI
    MARKET --> API_PRICE & API_FORECAST
    API_FORECAST --> SVC_AI

    SVC_WX --> EXT_WEATHER
    SVC_SAT --> EXT_SAT
    SVC_MANDI --> EXT_MANDI_GOV
    SVC_TRANS --> EXT_GEMINI

    COMMUNITY --> API_COMM --> EXT_FIREBASE
    PROFILE --> EXT_FIREBASE
```

---

## 🌾 Crop Recommendation — Detailed Flow

```mermaid
flowchart TD
    A([Farmer taps Predict]) --> B[GPS Location Detected]
    B --> C{Manual Soil Data?}
    C -- Yes --> D[Use User NPK & pH]
    C -- No --> E[Estimate from Soil Type Map]
    D & E --> F[Scale & Normalize N/P/K values]

    F --> G[🌦️ OpenWeather API\nTemp · Humidity · Rainfall]
    F --> H[🛰️ Satellite NDVI\nVegetation Health Score]
    F --> I[💰 Mandi Service\nLive + Mock Market Prices]
    F --> J[📈 Yield Predictor\nWeather-adjusted yield estimate]

    G & H & I & J --> K[🤖 Kaggle Random Forest ML Model\ncrop_model.pkl — 99.36% accuracy\nReturns: Predicted Crop + Confidence %]

    K --> L{Confidence Score?}
    L -- "> 65%" --> M[✅ Trust ML Prediction directly]
    L -- "40–65%" --> N[Hybrid: Check market + ML top-3 overlap]
    L -- "< 40% or Off-Season" --> O[🛡️ Fallback to Stable Safe Crop\nfrom Kharif/Rabi whitelist]

    M & N & O --> P[Risk Assessment Engine\nWater · Duration · Volatility · Perishability]
    P --> Q[Smart Alternative Ranking\nML suitability + profit + irrigation score]
    Q --> R[Localization\nTranslates to Hindi / Marathi / Gujarati]
    R --> S([🏆 Final Result Shown on UI])
```

---

## 📈 Market Intelligence — Detailed Flow

```mermaid
flowchart TD
    A([User opens Market tab]) --> B[Mandi Service Called]
    B --> C{Agmarknet Gov API\nReachable?}
    C -- ✅ Yes --> D[fetch 500 records\nFilter by State & District]
    C -- ❌ 403 / 0 records --> E[🔧 Mock Data Generator\nRealistic prices for user's region]
    D & E --> F[Display Market Table\nCrop · Price · Market · Date]

    F --> G[User selects a Crop]
    G --> H[Price Prediction Service\n3-month price forecast]
    H --> I{AI Report requested?}
    I -- Yes --> J[Gemini Flash\nMarket Analysis in native language]
    J --> K([AI Forecast Report displayed])
```

---

## 👥 Community Feed — Detailed Flow

```mermaid
flowchart TD
    A([User opens Community]) --> B{Logged In?}
    B -- No --> C[Redirect to Login\nFirebase Google Auth]
    C --> D[Firebase Auth Token]
    B -- Yes --> D
    D --> E[Load Posts from Firestore]
    E --> F[Display Filtered Feed\nCrop Category Tabs]

    F --> G{User Action}
    G -- Post --> H[Create New Post\nText + Crop Tag + Image]
    H --> I[Save to Firestore Community Collection]
    G -- Like --> J[Toggle Heart on Post\nUpdate Firestore likes array]
    G -- Comment --> K[Add Comment to Post subcollection]
    G -- My Posts --> L[UserPosts.jsx\nUser's own post history]
```

---

## 👤 Profile & History — Detailed Flow

```mermaid
flowchart TD
    A([User opens Profile]) --> B[Load from Firebase\nUser display name / email / photo]
    B --> C[Load Recent Predictions\nfrom localStorage max 10]
    C --> D[Display History Cards\nCrop · Date · Confidence · Profit]
    D --> E{User clicks a past result}
    E --> F[Show full RecommendationResult\nincluding Risk Breakdown card]
    F --> G{Click Risk card?}
    G --> H[Expand 4-factor breakdown\nWater · Duration · Volatility · Perishability]
    F --> I{Click Expert Analysis?}
    I --> J[POST /api/detailed-analysis\nGemini generates AI narrative]
```

---

## 🔑 Key Technology Summary

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 · i18next · Axios · CSS Glassmorphism |
| **Backend** | FastAPI · Python 3.11 |
| **Core Prediction** | Scikit-Learn Random Forest (Kaggle 99.36% accuracy) |
| **AI Analysis** | Google Gemini 2.5 Flash / gemini-flash-latest |
| **Yield Estimation** | Custom Regression Engine (Kaggle Crop-Yield-99 patterns) |
| **Market Data** | Agmarknet Gov API + Dynamic Mock Fallback |
| **Weather** | OpenWeather API + Satellite NDVI |
| **Authentication** | Firebase Auth (Google Sign-In) |
| **Database** | Firebase Firestore (Community) + localStorage (History) |
| **Caching** | requests-cache (2hr Mandi TTL) |
| **Languages** | English · हिंदी · मराठी · ગુજરાતી |

# 🌾 KrishiSense AI - Smart Data-Driven Farming Platform

An intelligent, AI-powered decision support system designed to help farmers optimize their crop selection, maximize market profitability, and engage with a collaborative agricultural community.

## 🎯 Key Features

- **🤖 Intelligent Crop Recommendation Engine**: A risk-aware ML model (Random Forest) that processes user-provided soil metrics (NPK), irrigation status, and real-time weather. It features strict seasonal filtering (Kharif vs. Rabi) and intelligent fallback logic to minimize risks when ML confidence is low.
- **💰 Advanced Market Intelligence**: Real-time Mandi price analysis with crop-specific harvest cycle predictions, robust price flooring, and toggleable regional vs. Pan-India views. Includes deep-dive AI market reports for complete transparency.
- **📱 Farmer Community Dashboard**: A premium, responsive social feed allowing farmers to share insights. Includes interactive post cards, inline commenting, dynamic crop-based filtering, and smooth-scroll navigation.
- **✨ Step-by-Step AI Visualization**: A transparent user experience that visually breaks down the backend processing logic (soil analysis $\rightarrow$ climate $\rightarrow$ market $\rightarrow$ final recommendation).
- **🌓 Premium UI & Dark Mode**: A state-of-the-art frontend featuring a comprehensive dark mode, dynamic micro-animations, glassmorphism aesthetics, and a mobile-first philosophy.
- **🌐 Localization & Offline Support**: Multi-lingual interface (Hindi, Marathi, English) with voice input support (Web Speech API) and cached offline capabilities.

## 🏗️ System Architecture

```text
User Input (React UI / Voice / Sensor Data)
    ↓
Language Translation & Processing
    ↓
Backend Decision Engine (FastAPI)
    ├── Soil & NPK Unit Normalization
    ├── Real-Time Weather Integration
    └── Mandi Market Data & Price Forecasting
    ↓
ML Model (Random Forest Crop Predictor)
    ↓
Risk-Aware Profit & Seasonal Filtering (Kharif/Rabi)
    ↓
Step-by-step Visual Analysis Output
    ↓
Result Delivery (Responsive UI / Voice / Text)
```

## 💻 Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React.js, Context API (Theme Management), Vanilla CSS |
| **Backend** | Python FastAPI |
| **AI/ML Engine** | scikit-learn, Random Forest |
| **Database & Auth** | Firebase (Firestore, Auth, Storage) |
| **Integrations** | Weather API, Agmarknet (Mandi Data), Web Speech API |

## 🚀 Quick Start

### Backend Environment
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Environment
```bash
cd frontend
npm install
npm start
```

### ML Model Training
```bash
cd ml_model
python train_model.py
```

## 📂 Project Structure

```text
KrishiSense AI/
├── backend/              # FastAPI server (Endpoints, Decision Engine)
│   ├── main.py
│   ├── requirements.txt
│   ├── config.py
│   ├── models.py
│   └── services/         # MandiService, WeatherService, etc.
├── frontend/             # React App (Themeable, Mobile-first)
│   ├── public/
│   ├── src/              # Components, Context, Pages (Community, Dashboard)
│   └── package.json
├── ml_model/             # Scikit-learn Pipelines
│   ├── train_model.py
│   ├── crop_predictor.py
│   └── model_data/
├── data/                 # Training sets & Reference metadata
└── README.md
```

## 🔄 Decision Logic & Risk Assessment

KrishiSense AI doesn't just guess; it evaluates tradeoffs:
```text
Final Recommendation Metric =
  (ML Soil & Climate Suitability Weight)
+ (Irrigation & Water Requirement Match)
+ (Seasonal Suitability: Kharif/Rabi)
+ (Market Profitability Rank & Price Volatility)
```
*Note: The platform features dynamic safety thresholds. It actively suppresses recommendations when analytical confidence falls beneath pre-defined limits, ensuring highly reliable, farmer-first advice.*

## 🎤 Hackathon Pitch & Value Proposition

> *"KrishiSense AI transforms raw agricultural data into actionable, risk-aware decisions. By compounding soil analysis with real-time weather, harvest cycle market predictions, and a collaborative knowledge-sharing community, we are building a localized, resilient ecosystem for the modern Indian farmer."*

## 📝 License

MIT License

---

**Made with 🌾 for Indian Farmers**

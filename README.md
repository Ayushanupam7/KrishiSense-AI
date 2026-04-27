# 🌾 KrishiSense AI  
### Smart Data-Driven Farming Platform  

🚀 Developed for **AIXplore Hackathon** | TGPCET, Nagpur  

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)
![ML](https://img.shields.io/badge/Model-RandomForest-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Overview  

**KrishiSense AI** is an AI-powered decision support system designed to help farmers:  
- 🌱 Choose the best crop  
- 💰 Maximize profitability  
- 📊 Make data-driven decisions  

It transforms **soil, climate, and market data** into actionable insights — bringing AI directly to the roots of India 🇮🇳  

---

## 🎯 Key Features  

### 🤖 Intelligent Crop Recommendation  
- Random Forest ML model  
- Inputs: NPK, irrigation, weather  
- Season-aware filtering (Kharif / Rabi)  

### 💰 Market Intelligence  
- Real-time mandi price insights  
- Harvest cycle predictions  
- Pan-India comparison  

### 📱 Farmer Community  
- Social dashboard for farmers  
- Share insights & posts  

### 🔍 Transparent AI (Glass Box)  
**Soil → Climate → Market → Final Decision**  

### 🎨 Premium UI  
- Glassmorphism design  
- Dark mode 🌙  
- Mobile-first  

### 🌐 Accessibility  
- Multi-language: Hindi, Marathi, English  
- Voice input 🎤  
- Offline support  

---

## 🏗️ System Architecture  

```mermaid
graph TD
    A[User Input: React UI / Voice / Sensors] --> B[Language Processing]
    B --> C[FastAPI Backend]
    C --> D[Random Forest Model]
    D --> E[Soil Analysis]
    D --> F[Weather API]
    D --> G[Market Data]
    E & F & G --> H[Risk Filtering]
    H --> I[Final Recommendation]
    I --> J[Frontend Output]
💻 Tech Stack
Layer	Technology
Frontend	React.js, Context API, CSS
Backend	FastAPI
AI/ML	Scikit-learn (Random Forest)
Database	Firebase
APIs	OpenWeather, Agmarknet
Features	Speech API, Offline Caching
🧠 Decision Logic
FinalScore=S
soil
	​

+C
climate
	​

+W
water
	​

+V
season
	​

+P
market
	​


⚠️ If confidence is low → Safety Fallback Triggered

🚀 Getting Started
🔧 Backend
cd backend
pip install -r requirements.txt
python main.py
🎨 Frontend
cd frontend
npm install
npm start
🧠 Train Model
cd ml_model
python train_model.py
📂 Project Structure
KrishiSense-AI/
├── backend/
├── frontend/
├── ml_model/
├── data/
└── README.md
🎤 Hackathon Pitch

"KrishiSense AI converts agricultural data into smart decisions.
By combining soil intelligence, climate insights, and market predictions,
we empower farmers to farm smarter, safer, and more profitably."

👨‍💻 Team
Ayush Anupam (AIML, 3rd Year)
Sanket Bhende (CSE, 2nd Year)
Avijeet Jha (CSE, 3rd Year)
Vipul Pradesi
📜 License

MIT License © 2026

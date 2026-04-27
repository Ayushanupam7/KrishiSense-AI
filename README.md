# 🌾 KrishiSense AI  
### Smart Data-Driven Farming Platform  

🚀 Developed for **AIXplore Hackathon** | TGPCET, Nagpur  

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-green?logo=fastapi)
![ML](https://img.shields.io/badge/Model-RandomForest-orange)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 🌟 Problem Statement  

Farmers often struggle with:
- ❌ Wrong crop selection  
- ❌ Unpredictable market prices  
- ❌ Lack of data-driven insights  
- ❌ Limited access to modern technology  

👉 Result: Low profitability & high risk  

---

## 💡 Solution  

**KrishiSense AI** provides an intelligent decision support system that combines:  
- Soil analysis 🌱  
- Weather insights 🌦️  
- Market intelligence 💰  

➡️ To recommend the **most profitable and safe crop choices**  

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

### 🔍 Transparent AI (Glass Box)  
**Soil → Climate → Market → Final Recommendation**  

### 📱 Farmer Community  
- Social dashboard for farmers  
- Share posts & experiences  

### 🎨 Premium UI  
- Glassmorphism design  
- Dark mode 🌙  
- Mobile-first  

### 🌐 Accessibility  
- Multi-language (Hindi, Marathi, English)  
- Voice input 🎤  
- Offline support  

---

## 🏗️ System Architecture  

```mermaid
graph TD
    A[User Input] --> B[Language Processing]
    B --> C[FastAPI Backend]
    C --> D[Random Forest Model]
    D --> E[Soil Data]
    D --> F[Weather Data]
    D --> G[Market Data]
    E --> H[Decision Engine]
    F --> H
    G --> H
    H --> I[Final Recommendation]
    I --> J[Frontend Output]


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


⚠️ Safety fallback triggers if model confidence is low

💻 Tech Stack
Layer	Technology
Frontend	React.js, Context API, CSS
Backend	FastAPI
AI/ML	Scikit-learn (Random Forest)
Database	Firebase
APIs	OpenWeather, Agmarknet
Features	Web Speech API, Offline Support
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

“KrishiSense AI transforms agricultural data into actionable intelligence.
From soil to solution, we empower farmers to make smarter, safer, and more profitable decisions.”

👨‍💻 Team
Ayush Anupam – AIML, 3rd Year
Sanket Bhende – CSE, 2nd Year
Avijeet Jha – CSE, 3rd Year
Vipul Pradesi
🔮 Future Scope
📡 IoT sensor integration
🤖 Advanced AI models (Deep Learning)
📊 Predictive analytics dashboard
🌍 Expansion to global markets
📜 License

MIT License © 2026


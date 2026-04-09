# 🎨 Frontend Integration Guide

## Component Architecture

### Pages
- **Home** - Main landing page with form and results

### Components
- **RecommendationForm** - Input form for soil, weather, location
- **RecommendationResult** - Display recommendation results

### Services
- API communication layer

---

## Component Details

### RecommendationForm
Collects user input for:
- Soil parameters (pH, NPK)
- Weather data (Temperature, Humidity, Rainfall)
- Location (Latitude, Longitude)
- Language preference

### RecommendationResult
Displays:
- Primary recommendation with confidence
- Profit margin and market price
- Weather suitability score
- Soil quality assessment
- Risk factor
- Alternative crop suggestions
- Localized output (if not English)

---

## State Management
Currently using React local state. For larger projects, consider:
- Redux
- Zustand
- React Context API

---

## API Integration
- Base URL from `REACT_APP_API_URL` env variable
- Axios for HTTP requests
- Error handling with user-friendly messages

---

## Styling
- CSS Modules for component-specific styles
- Green color scheme (#2d5016, #4a7c2c)
- Responsive design with mobile support

---

## Future Enhancements
- Voice input using Web Speech API
- Map integration for location picking
- Charts for historical data
- User authentication
- Firebase integration for data storage
- Progressive Web App (PWA) features

import React, { useState } from 'react';
import RecommendationForm from '../components/RecommendationForm';
import CurrentWeather from '../components/CurrentWeather';
import PricePredictor from '../components/PricePredictor';
import './Home.css';

const Predict = () => {
  const [location, setLocation] = useState(null);
  const [location, setLocation] = useState(null);
  const [liveWeather, setLiveWeather] = useState(null);

  return (
    <div className="home-container animate-fade-in">
      <main className="main-platform container" style={{ marginTop: '30px', maxWidth: '1300px' }}>
        {location && (
          <div className="weather-overview-section animate-fade-in" style={{ marginBottom: '20px' }}>
            <CurrentWeather
              latitude={location.latitude}
              longitude={location.longitude}
              state={location.state}
              district={location.district}
              onWeatherUpdate={setLiveWeather}
            />
          </div>
        )}
        <div className="single-column-layout">
          <div className="form-wrapper glass-card">
            <h2 className="section-title">Analyze Your Farm</h2>
            <RecommendationForm
              onRecommendation={setResult}
              onLocationUpdate={setLocation}
              externalWeather={liveWeather}
            />
          </div>

          <div style={{ marginTop: '40px' }}>
             <h2 className="section-title">Market Forecast</h2>
             <PricePredictor 
                state={location?.state} 
                district={location?.district} 
             />
          </div>
        </div>
      </main>

      <footer className="footer-premium">
        <div className="footer-content">
          <p>🌾 KRISHISENSE AI &copy; 2026 | Powered by Smart ML Models</p>
        </div>
      </footer>
    </div>
  );
};

export default Predict;

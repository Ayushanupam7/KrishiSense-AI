import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiChevronDown, HiChevronUp, HiRefresh } from 'react-icons/hi';
import './CurrentWeather.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const CurrentWeather = ({ latitude, longitude, state, district, onWeatherUpdate }) => {
  const [weather, setWeather] = useState(null);
  const [fullData, setFullData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isForecastExpanded, setIsForecastExpanded] = useState(false);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });
  const [lastFetchTime, setLastFetchTime] = useState(() => {
    const cachedTime = localStorage.getItem('ks_weather_time');
    return cachedTime ? new Date(cachedTime) : null;
  });
  const sliderRef = React.useRef(null);

  // Load from cache on init
  useEffect(() => {
    const cachedWeather = localStorage.getItem('ks_weather_data');
    const cachedFullData = localStorage.getItem('ks_full_weather_data');
    if (cachedFullData) {
      setFullData(JSON.parse(cachedFullData));
    }
    if (cachedWeather) {
      const parsedWeather = JSON.parse(cachedWeather);
      setWeather(parsedWeather);
      setLoading(false);
      if (onWeatherUpdate) {
        onWeatherUpdate(parsedWeather);
      }
    }
  }, [onWeatherUpdate]);

  const checkScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScroll({
        left: scrollLeft > 5,
        right: scrollLeft + clientWidth < scrollWidth - 5
      });
    }
  };

  useEffect(() => {
    if (isForecastExpanded) {
      // Give time for layout to settle
      const timer = setTimeout(checkScroll, 300);
      window.addEventListener('resize', checkScroll);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [isForecastExpanded, fullData]);

  useEffect(() => {
    if (latitude && longitude) {
      const now = new Date();
      const age = lastFetchTime ? (now - lastFetchTime) / 1000 / 60 : 999;

      // Cache for 10 minutes
      if (age > 10) {
        fetchCurrentWeather();
      } else {
        setLoading(false); // We have valid cache
        // If we didn't trigger it in the init, ensure the active weather overrides
        if (weather && onWeatherUpdate) {
          onWeatherUpdate(weather);
        }
      }
    }
  }, [latitude, longitude, lastFetchTime, weather, onWeatherUpdate]);

  const fetchCurrentWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE}/api/current-weather`, {
        params: {
          latitude: latitude,
          longitude: longitude
        }
      });

      const weatherData = response.data.current;
      setFullData(response.data);
      setWeather(weatherData);

      const now = new Date();
      setLastFetchTime(now);
      localStorage.setItem('ks_weather_data', JSON.stringify(weatherData));
      localStorage.setItem('ks_full_weather_data', JSON.stringify(response.data));
      localStorage.setItem('ks_weather_time', now.toISOString());

      if (onWeatherUpdate) {
        onWeatherUpdate(weatherData);
      }
    } catch (err) {
      console.error('Error fetching weather:', err);
      setError('Failed to load weather data');

      const fallbackWeather = {
        temperature: null,
        feels_like: null,
        humidity: null,
        description: 'Not detected',
        wind_speed: null,
        rainfall: null,
        pressure: null,
        isDetected: false
      };

      setWeather(fallbackWeather);

      if (onWeatherUpdate) {
        onWeatherUpdate(fallbackWeather);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value, unit = '') => {
    if (value === null || value === undefined) return 'Not detected';
    return `${Math.round(value)}${unit}`;
  };

  const getWeatherIcon = (description) => {
    const desc = description?.toLowerCase() || '';
    const isNight = weather?.is_day === 0;

    if (desc.includes('patchy') || desc.includes('drizzle')) return '🌦️';
    if (desc.includes('rain')) return '🌧️';
    if (desc.includes('cloud')) return isNight ? '☁️🌙' : '☁️';
    if (desc.includes('sun') || desc.includes('clear')) return isNight ? '🌙' : '☀️';
    if (desc.includes('storm')) return '⛈️';
    if (desc.includes('snow')) return '❄️';
    return isNight ? '🌙' : '🌤️';
  };

  if (loading) {
    return (
      <div className="weather-skeleton skeleton"></div>
    );
  }

  if (!weather) {
    return (
      <div className="current-weather-container error">
        <div className="weather-error">⚠️ No weather data</div>
      </div>
    );
  }


  const getWeatherClass = (description) => {
    if (weather?.is_day === 0) return 'bg-night';
    const desc = description?.toLowerCase() || '';
    if (desc.includes('rain')) return 'bg-rainy';
    if (desc.includes('cloud')) return 'bg-cloudy';
    if (desc.includes('sun') || desc.includes('clear')) return 'bg-sunny';
    if (desc.includes('storm')) return 'bg-storm';
    return 'bg-default';
  };

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: direction * 150, behavior: 'smooth' });
      // Minor delay to update arrows after glide
      setTimeout(checkScroll, 400);
    }
  };

  return (
    <div className="weather-dashboard-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Primary Current Weather Card */}
      <div className={`weather-card-compact ${getWeatherClass(weather.description)} ${isExpanded ? 'expanded' : 'compact'}`}>
        <div className="weather-summary" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="summary-left">
            <div className="weather-icon-mini">
              {getWeatherIcon(weather.description)}
            </div>
            <div className="temp-compact">
              {formatValue(weather.temperature, '°C')}
            </div>
          </div>

          <div className="summary-center">
            <div className="location-compact">
              {district || state || 'Your Location'}
            </div>
            <div className="desc-compact">
              {weather.description || 'Clear'}
            </div>
          </div>

          <div className="summary-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              className="refresh-btn-compact" 
              onClick={(e) => { e.stopPropagation(); fetchCurrentWeather(); }}
              title="Refresh Weather"
            >
              <HiRefresh />
            </button>
            <button className="expand-toggle">
              {isExpanded ? <HiChevronUp /> : <HiChevronDown />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="weather-details-expanded animate-fade-in">
            <div className="details-grid-mini">
              <div className="mini-detail">
                <span className="mini-label">🌡️ Feels Like</span>
                <span className="mini-value">{formatValue(weather.feels_like, '°C')}</span>
              </div>
              <div className="mini-detail">
                <span className="mini-label">💧 Humidity</span>
                <span className="mini-value">{formatValue(weather.humidity, '%')}</span>
              </div>
              <div className="mini-detail">
                <span className="mini-label">💨 Wind</span>
                <span className="mini-value">{formatValue(weather.wind_speed, ' km/h')}</span>
              </div>
              <div className="mini-detail">
                <span className="mini-label">🌧️ Rainfall</span>
                <span className="mini-value">{formatValue(weather.rainfall, ' mm')}</span>
              </div>
              <div className="mini-detail">
                <span className="mini-label">☀️ UV Index</span>
                <span className="mini-value">{weather.uv || 'N/A'}</span>
              </div>
              <div className="mini-detail">
                <span className="mini-label">😷 Air Quality</span>
                <span className="mini-value">{weather.air_quality ? `EPA ${weather.air_quality}` : 'Good'}</span>
              </div>
              <div className="mini-detail highlight-astro">
                <span className="mini-label">🌅 Sunrise</span>
                <span className="mini-value">{weather.sunrise || 'N/A'}</span>
              </div>
              <div className="mini-detail highlight-astro">
                <span className="mini-label">🌇 Sunset</span>
                <span className="mini-value">{weather.sunset || 'N/A'}</span>
              </div>
            </div>

            {/* Integrated 7-Day Forecast Section */}
            {fullData?.forecast?.data && fullData.forecast.data.length > 0 && (
              <div style={{ marginTop: '20px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsForecastExpanded(!isForecastExpanded); }}
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', padding: '15px 0', fontSize: '1.05rem', fontWeight: '600', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', outline: 'none' }}
                >
                  <span style={{ opacity: 0.95 }}>📅 7-Day Predictor {isForecastExpanded ? 'View' : 'Hidden'}</span>
                  <span>{isForecastExpanded ? <HiChevronUp size={24} /> : <HiChevronDown size={24} />}</span>
                </button>

                {isForecastExpanded && (
                  <div className="animate-fade-in" style={{ paddingBottom: '10px' }}>
                    <div className="forecast-header" style={{ marginBottom: '15px', marginTop: '5px' }}>
                      <h4 className="forecast-title" style={{ visibility: 'hidden', height: 0, margin: 0 }}>
                        {/* Title removed since it's on the button */}
                      </h4>
                      <div className="forecast-controls">
                        {canScroll.left && (
                          <button
                            className="slider-btn"
                            onClick={(e) => { e.stopPropagation(); scrollSlider(-1); }}
                            title="Previous Day"
                          >
                            &#x276E;
                          </button>
                        )}
                        {canScroll.right && (
                          <button
                            className="slider-btn"
                            onClick={(e) => { e.stopPropagation(); scrollSlider(1); }}
                            title="Predict Another Day"
                          >
                            &#x276F;
                          </button>
                        )}
                      </div>
                    </div>

                    <div 
                      ref={sliderRef} 
                      className="forecast-horizontal-slider"
                      onScroll={checkScroll}
                    >
                      {fullData.forecast.data.map((day, idx) => (
                        <div key={idx} className="forecast-day-card">
                          <div className="forecast-day-name">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                          <div className="forecast-day-icon">{getWeatherIcon(day.description)}</div>
                          <div className="forecast-day-temp">{formatValue(day.temperature, '°C')}</div>
                          <div className="forecast-day-humidity">💧 {formatValue(day.humidity, '%')}</div>
                          <div className="forecast-day-rain">🌧️ {formatValue(day.rainfall, 'mm')}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeather;

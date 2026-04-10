import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiArrowRight, HiArrowLeft, HiCheck, HiRefresh } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import RecommendationResult from './RecommendationResult';
import './RecommendationForm.css';
import './AnalysisSequence.css';

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const RecommendationForm = ({ onRecommendation, onLocationUpdate, externalWeather }) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [localResult, setLocalResult] = useState(null);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    pH: 7.0, nitrogen: 0.5, phosphorus: 25, potassium: 150, soil_type: 'alluvial',
    temperature: '', humidity: '', rainfall: '', season: 'kharif',
    latitude: 28.6139, longitude: 77.2090, state: 'Delhi', district: '', language: 'en'
  });

  const [loading, setLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (externalWeather) {
      setFormData(prev => ({
        ...prev,
        temperature: externalWeather.temperature || prev.temperature,
        humidity: externalWeather.humidity || prev.humidity,
        rainfall: externalWeather.rainfall || prev.rainfall
      }));
    }
  }, [externalWeather]);

  useEffect(() => {
    detectUserLocation();
  }, [onLocationUpdate]);

  const detectUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const lat = parseFloat(latitude.toFixed(4));
          const lon = parseFloat(longitude.toFixed(4));
          setFormData(prev => ({ ...prev, latitude: lat, longitude: lon }));
          getLocationName(lat, lon);
        },
        (err) => {
          if (onLocationUpdate) {
            onLocationUpdate({ latitude: formData.latitude, longitude: formData.longitude, state: 'Delhi', district: '', status: 'Default Location' });
          }
        }
      );
    }
  };

  const getLocationName = async (lat, lon) => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const address = response.data.address || {};
      const state = address.state || 'Unknown';
      const district = address.county || address.district || '';
      
      setFormData(prev => ({ ...prev, state, district }));
      if (onLocationUpdate) onLocationUpdate({ latitude: lat, longitude: lon, state, district, status: '✅ Detected' });

      // Auto-fetch regional soil metrics
      if (state && state !== 'Unknown') {
        try {
          const soilRes = await axios.get(`${API_BASE}/api/regional-soil`, { 
            params: { state, district } 
          });
          if (soilRes.data) {
            setFormData(prev => ({
              ...prev,
              pH: soilRes.data.pH,
              nitrogen: soilRes.data.nitrogen,
              phosphorus: soilRes.data.phosphorus,
              potassium: soilRes.data.potassium,
              soil_type: soilRes.data.soil_type
            }));
          }
        } catch (sErr) {
          console.warn("Soil fetch failed, using defaults");
        }
      }
    } catch (err) {}
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: isNaN(value) ? value : (value === '' ? '' : parseFloat(value)) }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  const resetForm = () => {
    setCurrentStep(1);
    setLocalResult(null);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        soil: { pH: parseFloat(formData.pH) || 7.0, nitrogen: parseFloat(formData.nitrogen) || 0, phosphorus: parseFloat(formData.phosphorus) || 0, potassium: parseFloat(formData.potassium) || 0, soil_type: formData.soil_type },
        weather: { temperature: parseFloat(formData.temperature) || 25.0, humidity: parseFloat(formData.humidity) || 50.0, rainfall: parseFloat(formData.rainfall) || 0, season: formData.season },
        location: { latitude: formData.latitude, longitude: formData.longitude, state: formData.state, district: formData.district },
        language: formData.language, use_market_data: true
      };

      setAnalysisStep(1);
      const apiPromise = axios.post(`${API_BASE}/api/recommend-crop`, payload);

      await sleep(1200);
      setAnalysisStep(2);
      await sleep(1200);
      setAnalysisStep(3);
      await sleep(1200);
      setAnalysisStep(4);

      const response = await apiPromise;
      await sleep(1000);

      // Enrich result with original soil/weather inputs for Profile history
      const enrichedResult = {
        ...response.data,
        soil_data: {
          ph: formData.pH,
          nitrogen: formData.nitrogen,
          phosphorus: formData.phosphorus,
          potassium: formData.potassium,
          soil_type: formData.soil_type,
        },
        weather_context: {
          temp: formData.temperature,
          humidity: formData.humidity,
          rainfall: formData.rainfall,
        },
        season: formData.season,
      };

      setLocalResult(enrichedResult);
      setCurrentStep(4);
      if (onRecommendation) onRecommendation(enrichedResult);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(Array.isArray(detail) ? detail.map(d => d.msg).join(', ') : (typeof detail === 'string' ? detail : 'Error'));
    } finally {
      setLoading(false);
      setAnalysisStep(0);
    }
  };

  const renderStepIndicator = () => (
    currentStep <= 3 && !loading && (
      <div className="step-indicator">
        {[1, 2, 3].map(step => (
          <React.Fragment key={step}>
            <div className={`step-dot ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
              {currentStep > step ? <HiCheck /> : step}
            </div>
            {step < 3 && <div className={`step-line ${currentStep > step ? 'active' : ''}`} />}
          </React.Fragment>
        ))}
      </div>
    )
  );

  return (
    <div className="recommendation-form-stepper">
      {renderStepIndicator()}
      
      <form onSubmit={handleSubmit}>
        {loading && analysisStep > 0 && (
          <div className="analysis-sequence-container animate-fade-in">
            <h3 className="step-title" style={{ textAlign: 'center', marginBottom: '30px' }}>{t('anl_engine')}</h3>
            
            <div className="analysis-steps">
              <div className={`analysis-item ${analysisStep >= 1 ? 'active' : ''} ${analysisStep > 1 ? 'completed' : ''}`}>
                <div className="analysis-icon">🌱</div>
                <div className="analysis-text">
                  <h4>{t('anl_step1_title')}</h4>
                  <p>{t('anl_step1_desc')}</p>
                </div>
                {analysisStep > 1 && <HiCheck className="status-icon success" />}
                {analysisStep === 1 && <div className="spinner"></div>}
              </div>

              <div className={`analysis-item ${analysisStep >= 2 ? 'active' : ''} ${analysisStep > 2 ? 'completed' : ''}`}>
                <div className="analysis-icon">🌦️</div>
                <div className="analysis-text">
                  <h4>{t('anl_step2_title')}</h4>
                  <p>{t('anl_step2_desc')}</p>
                </div>
                {analysisStep > 2 && <HiCheck className="status-icon success" />}
                {analysisStep === 2 && <div className="spinner"></div>}
              </div>

              <div className={`analysis-item ${analysisStep >= 3 ? 'active' : ''} ${analysisStep > 3 ? 'completed' : ''}`}>
                <div className="analysis-icon">📈</div>
                <div className="analysis-text">
                  <h4>{t('anl_step3_title')}</h4>
                  <p>{t('anl_step3_desc')}</p>
                </div>
                {analysisStep > 3 && <HiCheck className="status-icon success" />}
                {analysisStep === 3 && <div className="spinner"></div>}
              </div>

              <div className={`analysis-item ${analysisStep >= 4 ? 'active' : ''} ${analysisStep > 4 ? 'completed' : ''}`}>
                <div className="analysis-icon">🧠</div>
                <div className="analysis-text">
                  <h4>{t('anl_step4_title')}</h4>
                  <p>{t('anl_step4_desc')}</p>
                </div>
                {analysisStep > 4 && <HiCheck className="status-icon success" />}
                {analysisStep === 4 && <div className="spinner"></div>}
              </div>
            </div>
          </div>
        )}

        {!loading && currentStep === 1 && (
          <div className="step-content animate-fade-in">
            <h3 className="step-title">🌱 {t('anl_metrics_title')}</h3>
            <p className="step-subtitle">{t('anl_metrics_sub')} {formData.state && <span className="auto-info">✨ {t('anl_auto_fill')} {formData.district ? `${formData.district}, ${formData.state}` : formData.state}</span>}</p>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('anl_ph')}</label>
                <input type="number" name="pH" value={formData.pH} onChange={handleInputChange} step="0.1" />
              </div>
              <div className="form-group">
                <label>{t('anl_n')}</label>
                <input type="number" name="nitrogen" value={formData.nitrogen} onChange={handleInputChange} step="0.1" />
              </div>
              <div className="form-group">
                <label>{t('anl_p')}</label>
                <input type="number" name="phosphorus" value={formData.phosphorus} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>{t('anl_k')}</label>
                <input type="number" name="potassium" value={formData.potassium} onChange={handleInputChange} />
              </div>
              <div className="form-group full-width">
                <label>{t('anl_soil_type')}</label>
                <select name="soil_type" value={formData.soil_type} onChange={handleInputChange}>
                  <option value="alluvial">Alluvial</option>
                  <option value="black">Black</option>
                  <option value="red">Red</option>
                  <option value="laterite">Laterite</option>
                  <option value="sandy">Sandy</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!loading && currentStep === 2 && (
          <div className="step-content animate-fade-in">
            <h3 className="step-title">🌦️ {t('anl_climate_title')}</h3>
            <p className="step-subtitle">{t('anl_climate_sub')}</p>
            <div className="form-grid">
              <div className="form-group">
                <label>{t('anl_temp')}</label>
                <input type="number" name="temperature" value={formData.temperature} onChange={handleInputChange} placeholder="Auto-filled" />
              </div>
              <div className="form-group">
                <label>{t('anl_hum')}</label>
                <input type="number" name="humidity" value={formData.humidity} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>{t('anl_rain')}</label>
                <input type="number" name="rainfall" value={formData.rainfall} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>{t('anl_season')}</label>
                <select name="season" value={formData.season} onChange={handleInputChange}>
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="zaid">Zaid</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {!loading && currentStep === 3 && (
          <div className="step-content animate-fade-in">
            <h3 className="step-title">🌍 {t('anl_pref_title')}</h3>
            <p className="step-subtitle">{t('anl_pref_sub')}</p>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>{t('anl_lang')}</label>
                <select name="language" value={formData.language} onChange={handleInputChange}>
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="mr">Marathi</option>
                </select>
              </div>
            </div>
            <div className="review-box" style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.03)', borderRadius: '10px' }}>
               <p style={{ fontSize: '0.85rem', color: '#666' }}>📍 Using location: <strong>{formData.district}, {formData.state}</strong></p>
            </div>
          </div>
        )}

        {currentStep === 4 && localResult && (
          <div className="step-content animate-fade-in result-step">
            <RecommendationResult data={localResult} />
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
               <button type="button" onClick={resetForm} className="btn-secondary">
                 <HiRefresh /> {t('anl_new_analysis')}
               </button>
            </div>
          </div>
        )}

        {error && <div className="error-message">❌ {error}</div>}

        {!loading && currentStep <= 3 && (
          <div className="step-actions">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="btn-secondary">
                <HiArrowLeft /> {t('anl_back')}
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button type="button" onClick={nextStep} className="btn-primary" style={{ marginLeft: 'auto' }}>
                {t('anl_next')} <HiArrowRight />
              </button>
            ) : (
              <button type="submit" disabled={loading} className="btn-submit" style={{ marginLeft: 'auto' }}>
                🚀 {t('anl_submit')}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default RecommendationForm;

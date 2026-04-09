import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import PricePredictor from './PricePredictor';
import './RecommendationResult.css';

// Client-side fallback: derive risk breakdown from known crop metadata
const CROP_RISK_META = {
  Cotton: { water: 'Medium', duration: 'Long', volatility: 'High', perishability: 'Low' },
  Rice: { water: 'High', duration: 'Medium', volatility: 'Low', perishability: 'Low' },
  Wheat: { water: 'Medium', duration: 'Medium', volatility: 'Low', perishability: 'Low' },
  Maize: { water: 'Medium', duration: 'Short', volatility: 'Medium', perishability: 'Low' },
  Tomato: { water: 'Medium', duration: 'Short', volatility: 'Very High', perishability: 'High' },
  Onion: { water: 'Low', duration: 'Medium', volatility: 'High', perishability: 'Medium' },
  Potato: { water: 'Medium', duration: 'Short', volatility: 'High', perishability: 'Medium' },
  Soybean: { water: 'Low', duration: 'Short', volatility: 'Medium', perishability: 'Low' },
  Sugarcane: { water: 'High', duration: 'Long', volatility: 'Low', perishability: 'Medium' },
  Arhar: { water: 'Low', duration: 'Long', volatility: 'Low', perishability: 'Low' },
  Banana: { water: 'High', duration: 'Long', volatility: 'Medium', perishability: 'High' },
  Turmeric: { water: 'Medium', duration: 'Long', volatility: 'Low', perishability: 'Low' },
};

const WATER_REASON = { High: 'Needs a reliable irrigation source or heavy monsoon', Medium: 'Moderate irrigation required', Low: 'Water-efficient, suitable for rainfed farming' };
const DURATION_REASONS = { 'Long': 'Long growing period = delayed income & prolonged weather exposure', 'Medium': 'Moderate growing cycle', 'Short': 'Quick harvest cycle reduces climate risk' };
const VOL_REASONS = { 'Very High': 'Prices can crash severely (e.g. Tomato glut years)', 'High': 'Significant market price swings expected', 'Medium': 'Moderate price fluctuations, manageable with storage', 'Low': 'Stable MSP-backed pricing from government' };
const PERISH_REASONS = { 'High': 'Spoils quickly — needs cold storage or fast market access', 'Medium': 'Has limited shelf life, requires prompt selling', 'Low': 'Can be stored for months, flexible selling timeline' };

const impactOf = (factor, val) => {
  if (factor === 'water') return val === 'High' ? 'negative' : val === 'Low' ? 'positive' : 'neutral';
  if (factor === 'duration') return val === 'Long' ? 'negative' : val === 'Short' ? 'positive' : 'neutral';
  if (factor === 'volatility') return val === 'Very High' || val === 'High' ? 'negative' : val === 'Low' ? 'positive' : 'neutral';
  if (factor === 'perishability') return val === 'High' ? 'negative' : val === 'Low' ? 'positive' : 'neutral';
  return 'neutral';
};

const getRiskBreakdown = (data) => {
  // Prefer server-sent breakdown
  if (data.risk_breakdown && data.risk_breakdown.length > 0) return data.risk_breakdown;
  // Generate client-side fallback from crop metadata
  const crop = data.recommended_crop || '';
  const meta = CROP_RISK_META[crop] || { water: 'Medium', duration: 'Medium', volatility: 'Medium', perishability: 'Low' };
  return [
    { factor: 'Water Requirement', value: meta.water, impact: impactOf('water', meta.water), reason: WATER_REASON[meta.water] || '' },
    { factor: 'Crop Duration', value: meta.duration === 'Long' ? 'Long (6+ months)' : meta.duration === 'Short' ? 'Short (<3 months)' : 'Medium (3-6 months)', impact: impactOf('duration', meta.duration), reason: DURATION_REASONS[meta.duration] || '' },
    { factor: 'Price Volatility', value: meta.volatility, impact: impactOf('volatility', meta.volatility), reason: VOL_REASONS[meta.volatility] || '' },
    { factor: 'Perishability', value: meta.perishability, impact: impactOf('perishability', meta.perishability), reason: PERISH_REASONS[meta.perishability] || '' },
  ];
};

const RecommendationResult = ({ data }) => {
  const { t, i18n } = useTranslation();
  const [isAnalysisExpanded, setIsAnalysisExpanded] = useState(false);
  const [geminiReport, setGeminiReport] = useState(null);
  const [reportLanguage, setReportLanguage] = useState('en');
  const [isProcessing, setIsProcessing] = useState(false);
  const [riskExpanded, setRiskExpanded] = useState(false);

  useEffect(() => {
    if (data && data.recommended_crop) {
      const savePrediction = () => {
        try {
          const existing = JSON.parse(localStorage.getItem('recent_predictions') || '[]');

          // Only block saving if the EXACT same result was stored in the last 60 seconds
          // (prevents double-save from React StrictMode double-render, not from new searches)
          const sixtySecondsAgo = Date.now() - 60_000;
          const isRecentDuplicate = existing.some(item =>
            item.recommended_crop === data.recommended_crop &&
            new Date(item.timestamp).getTime() > sixtySecondsAgo
          );

          if (!isRecentDuplicate) {
            const newItem = {
              ...data,
              timestamp: new Date().toISOString()
            };
            const updated = [newItem, ...existing].slice(0, 10);
            localStorage.setItem('recent_predictions', JSON.stringify(updated));
            console.log('✅ Prediction saved to history:', data.recommended_crop);

            // Notify Profile page (same tab) to reload history
            window.dispatchEvent(new Event('storage'));
          } else {
            console.log('⏩ Skipped duplicate save (within 60s):', data.recommended_crop);
          }
        } catch (e) {
          console.error('History Save Error:', e);
        }
      };
      savePrediction();
    }
  }, [data]);

  if (!data) {
    return null;
  }

  const analysisText = data.localized_output?.analysis || data.descriptive_analysis || "Analysis currently unavailable.";

  const renderFormattedText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let cleanLine = line.replace(/\*\*/g, '').trim();
      if (cleanLine.startsWith('### ') || cleanLine.startsWith('## ') || cleanLine.startsWith('# ')) {
        const headerText = cleanLine.replace(/^#+\s/, '');
        return <h4 key={i} style={{ color: '#1b5e20', marginTop: '18px', marginBottom: '8px', borderBottom: '1px solid #c8e6c9', paddingBottom: '4px' }}>{headerText}</h4>;
      }
      if (cleanLine.startsWith('* ') || cleanLine.startsWith('- ')) {
        const bulletText = cleanLine.replace(/^[*|-]\s/, '');
        return <div key={i} style={{ marginLeft: '15px', marginBottom: '6px', display: 'flex' }}>
          <span style={{ marginRight: '8px', color: '#4caf50' }}>•</span>
          <span>{bulletText}</span>
        </div>;
      }
      if (cleanLine === '') {
        return <div key={i} style={{ height: '10px' }}></div>;
      }
      return <div key={i} style={{ marginBottom: '6px' }}>{cleanLine}</div>;
    });
  };

  const handleDetailedAnalysis = async (forceLang = null) => {
    const targetLang = forceLang || i18n.language;
    
    // If report already exists in this language, just toggle
    if (geminiReport && reportLanguage === targetLang && !forceLang) {
        setIsAnalysisExpanded(!isAnalysisExpanded);
        return;
    }

    setIsProcessing(true);
    try {
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const payload = {
            crop: data.recommended_crop,
            context_data: data,
            language: targetLang
        };
        const response = await axios.post(`${API_BASE}/api/detailed-analysis`, payload);
        console.log("KrishiSense AI Response:", response.data);
        
        if (response.data && response.data.analysis) {
            setGeminiReport(response.data.analysis);
            setReportLanguage(targetLang);
            setIsAnalysisExpanded(true);
        } else {
            console.warn("Unexpected AI response structure:", response.data);
            setIsAnalysisExpanded(true); // Fall back to preview
        }
    } catch (err) {
        console.error("Gemini Detailed Error:", err);
        setIsAnalysisExpanded(true); 
    } finally {
        setIsProcessing(false);
    }
  };

  const getLanguageName = (code) => {
    const names = { hi: 'Hindi', mr: 'Marathi', gu: 'Gujarati', en: 'English' };
    return names[code] || code;
  };

  return (
    <div className="recommendation-result">
      <div className="main-recommendation">
        <div className="crop-card primary">
          <h3>🌾 {t('anl_res_title')}</h3>
          <div className="crop-name">{data.localized_output?.recommended_crop_value || data.recommended_crop}</div>
          <div className="confidence">
            {t('anl_confidence')}: {(data.confidence_score * 100).toFixed(1)}%
          </div>
        </div>

        <div className="analysis-card animate-slide-up">
          <div className="analysis-header-row">
            <h4>📑 {t('anl_why_crop', { crop: data.recommended_crop })}</h4>
            <div className="ai-badge">{t('anl_expert_badge')}</div>
          </div>
          
          <div className={`analysis-preview-box ${isAnalysisExpanded ? 'expanded' : 'collapsed'}`}>
            <div className="analysis-text-content">
                {isAnalysisExpanded && geminiReport ? renderFormattedText(geminiReport) : renderFormattedText(analysisText)}
            </div>
            {!isAnalysisExpanded && !isProcessing && <div className="analysis-fade-overlay"></div>}
          </div>
          
          <div className="analysis-actions-row" style={{ display: 'flex', gap: '10px' }}>
            <button 
              className={`analysis-toggle-btn ${isProcessing ? 'processing' : ''}`}
              onClick={() => handleDetailedAnalysis()}
              disabled={isProcessing}
              style={{ flex: 2 }}
            >
              {isProcessing ? (
                <><span className="spinner-mini"></span> {t('anl_analyzing')}</>
              ) : (
                isAnalysisExpanded ? t('anl_show_less') : t('anl_view_report')
              )}
            </button>

            {geminiReport && i18n.language !== reportLanguage && !isProcessing && (
              <button 
                className="analysis-toggle-btn secondary"
                onClick={() => handleDetailedAnalysis(i18n.language)}
                style={{ flex: 1, background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9' }}
              >
                🌐 {t('anl_btn_translate', { lang: getLanguageName(i18n.language) })}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="details-grid">
        <div className="detail-card">
          <h4>💰 {t('anl_profit')}</h4>
          <div className="detail-value" style={{ color: data.market_profit_margin > 0 ? '#2e7d32' : 'inherit' }}>
            {data.market_profit_margin > 0 ? '+' : ''}{data.market_profit_margin.toFixed(1)}%
          </div>
          <div className="detail-subtext">{t('anl_margin')}</div>
        </div>

        <div className="detail-card">
          <h4>💵 {t('anl_price')}</h4>
          <div className="detail-value">₹{data.market_price_current}</div>
          <div className="detail-subtext">{t('anl_quintal')}</div>
        </div>

        <div className="detail-card">
          <h4>🌡️ {t('anl_weather')}</h4>
          <div className="detail-value">{(data.weather_suitability_score * 100).toFixed(0)}%</div>
          <div className="detail-subtext">{data.weather_conditions}</div>
        </div>

        <div className="detail-card">
          <h4>🌱 {t('anl_soil')}</h4>
          <div className="detail-value">{data.soil_quality}</div>
          <div className="detail-subtext">{t('anl_soil_asmnt')}</div>
        </div>

        <div className="detail-card risk-detail-card" style={{ cursor: 'pointer' }} onClick={() => setRiskExpanded(r => !r)}>
          <h4>⚠️ {t('anl_risk')}</h4>
          <div className="detail-value" style={{
            color: data.risk_factor?.includes('High') ? '#ff6b6b' :
              data.risk_factor?.includes('Moderate') ? '#ffa500' : '#51cf66'
          }}>
            {data.risk_factor}
          </div>
          <div className="detail-subtext">{riskExpanded ? 'Click to collapse ▲' : 'Click for breakdown ▼'}</div>

          {riskExpanded && (
            <div className="risk-breakdown" style={{ marginTop: '12px', width: '100%' }}>
              {getRiskBreakdown(data).map((item, idx) => (
                <div key={idx} style={{
                  display: 'flex', flexDirection: 'column', gap: '2px',
                  padding: '8px 10px', borderRadius: '8px', marginBottom: '6px',
                  background: item.impact === 'negative' ? '#fff3f3' : item.impact === 'positive' ? '#f0fff4' : '#fafafa',
                  border: `1px solid ${item.impact === 'negative' ? '#ffcdd2' : item.impact === 'positive' ? '#c8e6c9' : '#e0e0e0'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.78rem', color: '#333' }}>{item.factor}</strong>
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 'bold', padding: '2px 8px', borderRadius: '12px',
                      background: item.impact === 'negative' ? '#ffcdd2' : item.impact === 'positive' ? '#c8e6c9' : '#eeeeee',
                      color: item.impact === 'negative' ? '#c62828' : item.impact === 'positive' ? '#2e7d32' : '#555'
                    }}>{item.value}</span>
                  </div>
                  <p style={{ fontSize: '0.74rem', color: '#666', margin: '2px 0 0 0' }}>{item.reason}</p>
                </div>
              ))}
              {data.risk_score !== undefined && (
                <div style={{ marginTop: '6px', fontSize: '0.75rem', color: '#888', textAlign: 'right' }}>
                  Risk Score: {data.risk_score}/10
                </div>
              )}
            </div>
          )}
        </div>

        <div className="detail-card">
          <h4>💧 {t('anl_irrigation')}</h4>
          <div className="detail-value" style={{
            color: data.irrigation_level === 'High' ? '#2196f3' :
              data.irrigation_level === 'Medium' ? '#4caf50' : '#8bc34a'
          }}>
            {data.irrigation_level}
          </div>
          <div className="detail-subtext">{t('anl_water_asmnt')}</div>
        </div>

        <div className="detail-card">
          <h4>🤖 {t('anl_ml')}</h4>
          <div className="detail-value">{data.ml_predicted_crop}</div>
          <div className="detail-subtext">{t('anl_ml_source')}</div>
        </div>
      </div>
      
      <h3 style={{ marginTop: '30px', marginBottom: '15px' }}>📈 {t('anl_finance')}</h3>
      <PricePredictor defaultCrop={data.recommended_crop} />

      {data.alternative_crops && data.alternative_crops.length > 0 && (
        <div className="alternatives-section mt-4">
          <h3 style={{ marginBottom: '15px' }}>🌱 {t('anl_alts')}</h3>
          <div className="alternatives-list">
            {data.alternative_crops.map((crop, idx) => (
              <div key={idx} className="alt-crop" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 15px', background: '#f1f8e9', borderRadius: '10px',
                marginBottom: '10px', border: '1px solid #c8e6c9'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <strong style={{ color: '#2e7d32', fontSize: '1.05rem' }}>{crop.crop}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#666' }}>💧 {t('anl_irrigation')}: {crop.irrigation}</span>
                </div>
                <span style={{
                  background: '#dcedc8', color: '#1b5e20', padding: '4px 12px',
                  borderRadius: '20px', fontSize: '0.9rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}>
                  +{crop.profit_margin.toFixed(1)}% {t('anl_margin_plus')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendationResult;

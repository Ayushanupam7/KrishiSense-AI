import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useTranslation } from 'react-i18next';
import { HiTrendingUp, HiTrendingDown, HiInformationCircle, HiLightBulb } from 'react-icons/hi';
import './PricePredictor.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const PricePredictor = ({ defaultCrop = 'Onion', state, district }) => {
    const { i18n } = useTranslation();
    const [crop, setCrop] = useState(defaultCrop);
    const [customCrop, setCustomCrop] = useState('');
    const [isCustom, setIsCustom] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPanIndia, setIsPanIndia] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [deepReport, setDeepReport] = useState(null);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const scrollRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const crops = ['Onion', 'Tomato', 'Wheat', 'Rice', 'Potato', 'Chilli', 'Garlic', 'Ginger'];

    const fetchPrediction = async (selectedCrop) => {
        try {
            setLoading(true);
            setError(null);
            setDeepReport(null); // Clear previous AI report
            const response = await axios.get(`${API_BASE}/api/predict-price`, {
                params: { 
                    crop: selectedCrop,
                    state: isPanIndia ? null : state,
                    district: isPanIndia ? null : district
                }
            });
            setPrediction(response.data);
        } catch (err) {
            console.error('Prediction error:', err);
            setError('Could not generate prediction. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const fetchDeepReport = async () => {
        if (!prediction) return;
        try {
            setIsReportLoading(true);
            const res = await axios.post(`${API_BASE}/api/price-forecast-report`, {
                crop: crop,
                prediction_data: prediction,
                language: i18n.language
            });
            setDeepReport(res.data.report);
        } catch (err) {
            console.error('Deep report error:', err);
            setDeepReport("Could not generate detailed analysis. Try again.");
        } finally {
            setIsReportLoading(false);
        }
    };

    useEffect(() => {
        fetchPrediction(crop);
    }, [state, district, isPanIndia]);

    const handleCropChange = (e) => {
        const val = e.target.value;
        if (val === 'CUSTOM') {
            setIsCustom(true);
        } else {
            setIsCustom(false);
            setCrop(val);
            fetchPrediction(val);
        }
    };

    const handleCustomSubmit = (e) => {
        if (e.key === 'Enter' && customCrop.trim()) {
            setCrop(customCrop);
            fetchPrediction(customCrop);
        }
    };

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 150 : scrollLeft + 150;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const getCropSubtitle = () => {
        const c = crop.toLowerCase();
        const duration = prediction?.prediction_period_months || 4;

        if (c.includes('onion')) return `Analyzing ${duration} mo. spring/autumn cycle`;
        if (c.includes('wheat')) return `Predicting ${duration} mo. post-Rabi harvest`;
        if (c.includes('tomato')) return `Tracking ${duration} mo. high-volatility cycle`;
        if (c.includes('rice')) return `Forecasting ${duration} mo. Kharif harvest entry`;
        if (c.includes('potato')) return `Analyzing ${duration} mo. cold-storage cycles`;
        return `Forecasting for ${duration} month harvest cycle`;
    };

    if (!prediction && loading) return <div className="predictor-skeleton skeleton"></div>;

    // Prepare chart data: history + future
    const chartData = prediction ? [
        ...prediction.historical_trend,
        {
            month: prediction.prediction_date.split(' ')[0], // Get month name
            price: prediction.predicted_price,
            is_prediction: true
        }
    ] : [];

    return (
        <div className={`price-predictor-container glass-card ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}>
            <div className="predictor-header" onClick={() => !isCustom && setIsExpanded(!isExpanded)}>
                <div className="header-text">
                    <h3>
                        <HiTrendingUp />
                        <span className="analysis-target">Forecasting: {crop}</span>
                        {!isExpanded && prediction && (
                            <span className={`mini-trend ${prediction.trend_direction}`}>
                                ₹{prediction.predicted_price} ({prediction.price_change_percentage}%)
                            </span>
                        )}
                    </h3>
                    <div className="header-meta-row">
                        <p>{isExpanded ? getCropSubtitle() : `Click to see 3-month ${crop} forecast`}</p>
                            <div className="meta-pills">
                                <span 
                                    className={`location-pill ${isPanIndia ? 'pan-india' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsPanIndia(!isPanIndia);
                                    }}
                                    title="Click to toggle Pan-India / Regional"
                                >
                                    📍 {isPanIndia ? 'Pan-India' : (district || state || 'Regional')}
                                </span>
                            </div>
                    </div>
                </div>
                <div className="header-controls" onClick={e => e.stopPropagation()}>
                    <button className="expand-toggle-btn">
                        {isExpanded ? <HiTrendingDown style={{transform: 'rotate(180deg)'}} /> : <HiTrendingUp />}
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div className="automatic-search-container animate-fade-in">
                    <div className="integrated-search">
                        <input 
                            type="text" 
                            className="search-input-field"
                            placeholder="🔍 Find any crop across India (e.g. Chilli)..."
                            value={customCrop}
                            onChange={(e) => setCustomCrop(e.target.value)}
                            onKeyDown={handleCustomSubmit}
                        />
                    </div>
                </div>
            )}
            
            {isExpanded && (
                <div className="unified-selection-area">
                    <div className="pill-scroll-wrapper">
                        <button className="nav-arrow left" onClick={() => scroll('left')}>‹</button>
                        <div className="crop-pills-scroll" ref={scrollRef}>
                            {crops.map(c => (
                                <button 
                                    key={c} 
                                    className={`crop-pill ${crop === c ? 'active' : ''}`}
                                    onClick={() => {
                                        setCrop(c);
                                        fetchPrediction(c);
                                        setCustomCrop('');
                                    }}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <button className="nav-arrow right" onClick={() => scroll('right')}>›</button>
                    </div>
                </div>
            )}

            {isExpanded && (
                <>
                    {loading ? (
                        <div className="predictor-loading">
                            <div className="spinner"></div>
                            <p>Analyzing Mandi Trends...</p>
                        </div>
                    ) : error ? (
                        <div className="predictor-error">{error}</div>
                    ) : prediction && (
                        <div className="predictor-content animate-fade-in">
                            <hr className="prediction-divider" />
                        
                            <div className="prediction-context-header">
                                <h4 className="harvest-title">
                                    📈 Harvest Forecast for <span className="highlight-crop">{crop}</span>
                                </h4>
                                <div className="context-meta">
                                📍 {isPanIndia ? 'Pan-India' : (district || state || 'Local')} Market
                            </div>
                        </div>

                            <div className="prediction-stats">
                                <div className="stat-main">
                                    <span className="label">Current Price</span>
                                    <span className="value">₹{prediction.current_price} <small>/q</small></span>
                                </div>
                                <div className="stat-divider"></div>
                                <div className="stat-prediction">
                                    <span className="label">
                                        Harvest Forecast ({prediction.prediction_date})
                                        <span className="duration-tag">{prediction.prediction_period_months} months</span>
                                    </span>
                                    <span className="value accent">₹{prediction.predicted_price} <small>/q</small></span>
                                    <span className={`trend-badge ${prediction.trend_direction}`}>
                                        {prediction.trend_direction === 'rise' ? <HiTrendingUp /> : <HiTrendingDown />}
                                        {prediction.price_change_percentage}%
                                    </span>
                                </div>
                            </div>

                            <div className="chart-wrapper">
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#2e7d32" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#2e7d32" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ffa000" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#ffa000" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                                        <YAxis hide domain={['dataMin - 500', 'dataMax + 500']} />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                                            formatter={(val) => [`₹${val}`, 'Mandi Price']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#2e7d32"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                            animationDuration={1500}
                                        />
                                        <ReferenceLine x={prediction.historical_trend[prediction.historical_trend.length - 1].month} stroke="#ddd" strokeDasharray="3 3" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="prediction-insight">
                                <div className="insight-icon"><HiLightBulb /></div>
                                <div className="insight-text">
                                    <strong>Contextual Analysis</strong>
                                    <p>{prediction.analysis}</p>

                                    {!deepReport && !isReportLoading ? (
                                        <button className="ask-ai-link" onClick={fetchDeepReport}>
                                            🔍 Ask AI for detailed market reasoning...
                                        </button>
                                    ) : isReportLoading ? (
                                        <div className="ai-thinking">⚙️ AI Market Engine Thinking...</div>
                                    ) : (
                                        <div className="deep-report-content animate-fade-in">
                                            <hr style={{ margin: '12px 0', opacity: 0.1 }} />
                                            <strong>Expert Market Report:</strong>
                                            <div className="report-markdown">
                                                {deepReport.split('\n').map((line, i) => (
                                                    <p key={i} style={{ marginBottom: '6px' }}>{line.replace(/\*/g, '')}</p>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="predictor-footer" style={{ marginTop: '25px', textAlign: 'center' }}>
                                <button className="collapse-action-btn" onClick={() => {
                                    setIsExpanded(false);
                                    window.scrollTo({ top: window.scrollY - 300, behavior: 'smooth' });
                                }}>
                                    ⬆️ Collapse Forecast
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default PricePredictor;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { HiArrowLeft, HiArrowRight, HiRefresh } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import CurrentWeather from '../components/CurrentWeather';
import RecommendationForm from '../components/RecommendationForm';
import LiveStatsTicker from '../components/LiveStatsTicker';
import { getCropImage } from '../utils/cropImages';
import './Home.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Home = () => {
    const { t } = useTranslation();
    const [location, setLocation] = useState(() => {
        const cached = localStorage.getItem('ks_location');
        return cached ? JSON.parse(cached) : null;
    });
    const [marketData, setMarketData] = useState(() => {
        const cached = localStorage.getItem('ks_market_data');
        return cached ? JSON.parse(cached) : [];
    });
    const [loadingMarket, setLoadingMarket] = useState(false);
    const [lastUpdatedMarket, setLastUpdatedMarket] = useState(() => {
        const cached = localStorage.getItem('ks_market_time');
        return cached ? new Date(cached) : null;
    });
    const scrollRef = useRef(null);
    const navigate = useNavigate();

    const scroll = (direction) => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth * 0.8
                : scrollLeft + clientWidth * 0.8;

            scrollRef.current.scrollTo({
                left: scrollTo,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        if (location) {
            localStorage.setItem('ks_location', JSON.stringify(location));

            // Check cache age for market data (15 mins)
            const now = new Date();
            const cacheAge = lastUpdatedMarket ? (now - lastUpdatedMarket) / 1000 / 60 : 999;

            if (marketData.length === 0 || cacheAge > 15) {
                if (location.state || location.district) {
                    fetchLocalMarket(location.state, location.district);
                }
            }
        }
    }, [location, lastUpdatedMarket, marketData.length]);

    const fetchLocalMarket = async (state, district) => {
        setLoadingMarket(true);
        try {
            const res = await axios.get(`${API_BASE}/api/mandi-search`, {
                params: { state, district, limit: 12 }
            });
            setMarketData(res.data.results);
            const now = new Date();
            setLastUpdatedMarket(now);
            localStorage.setItem('ks_market_data', JSON.stringify(res.data.results));
            localStorage.setItem('ks_market_time', now.toISOString());
        } catch (err) {
            console.error('Market fetch error:', err);
        } finally {
            setLoadingMarket(false);
        }
    };

    const handleMarketRefresh = () => {
        if (location && (location.state || location.district)) {
            fetchLocalMarket(location.state, location.district);
        }
    };

    return (
        <div className="home-container">
            <div style={{ display: 'none' }}>
                <RecommendationForm onLocationUpdate={setLocation} />
            </div>

            <section className="hero-section">
                <div className="hero-bg-overlay"></div>
                <div className="hero-content container">
                    <div className="badge ripple">{t('home_badge')}</div>
                    <h1>{t('home_title_1')}<span className="highlight">{t('home_title_2')}</span></h1>
                    <p>{t('home_subtitle')}</p>
                    <div className="hero-btns">
                        <button className="btn-primary main-cta" onClick={() => navigate('/analysis')}>
                            {t('home_start_pred')}
                        </button>
                        <button className="btn-secondary" onClick={() => navigate('/market')}>
                            {t('home_view_markets')}
                        </button>
                    </div>
                </div>
            </section>

            <main className="main-platform container">
                <LiveStatsTicker />
                {/* 1. Localized Weather (First) */}
                {location && (
                    <div className="weather-overview-section animate-fade-in section-group">
                        <div className="section-glass">
                            <h2 className="section-title">{t('home_local_weather')}<span className="active-loc">{location.district}</span></h2>
                            <CurrentWeather
                                latitude={location.latitude}
                                longitude={location.longitude}
                                state={location.state}
                                district={location.district}
                            />
                        </div>
                    </div>
                )}

                {/* 2. Live Market Updates (Second) */}
                {location && (
                    <section className="home-market-update animate-fade-in section-group">
                        <div className="section-glass">
                            <div className="section-header">
                                <h2 className="section-title">
                                    {t('home_live_market')}<span className="loc">{location.district || location.state}</span>
                                    {location.district && <span className="state-sub">, {location.state}</span>}
                                    {lastUpdatedMarket && (
                                        <span className="market-updated-label">
                                            {t('home_last_updated')}{lastUpdatedMarket.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                        </span>
                                    )}
                                </h2>
                                <div className="scroll-controls">
                                    <button
                                        className={`scroll-btn refresh-btn ${loadingMarket ? 'spinning' : ''}`}
                                        onClick={handleMarketRefresh}
                                        aria-label="Refresh Market"
                                        disabled={loadingMarket}
                                    >
                                        <HiRefresh />
                                    </button>
                                    <button className="scroll-btn" onClick={() => scroll('left')} aria-label="Scroll Left">
                                        <HiArrowLeft />
                                    </button>
                                    <button className="scroll-btn" onClick={() => scroll('right')} aria-label="Scroll Right">
                                        <HiArrowRight />
                                    </button>
                                    <button className="view-link" onClick={() => navigate('/market')}>{t('home_explore_all')}</button>
                                </div>
                            </div>
                            <div className="market-highlights-scroll" ref={scrollRef}>
                                {loadingMarket ? (
                                    <>
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <div key={i} className="market-skeleton-card skeleton">
                                                <div className="market-sk-img skeleton"></div>
                                                <div className="market-sk-content">
                                                    <div className="sk-line title skeleton"></div>
                                                    <div className="sk-line short skeleton"></div>
                                                    <div className="sk-line full skeleton"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                ) : marketData.length > 0 ? (
                                    marketData.map((m, idx) => (
                                        <div key={idx} className="market-card-mini glass-card" onClick={() => navigate('/market')}>
                                            <div className="crop-img">
                                                <img src={getCropImage(m.commodity)} alt="" />
                                                <div className="cat-badge">{m.category}</div>
                                            </div>
                                            <div className="content">
                                                <h4>{m.commodity}</h4>
                                                <div className="price">₹{m.price}<span>/qtl</span></div>
                                                <div className="mandi">📍 {m.mandi}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-data">{t('home_no_markets')}</div>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. Core Platforms (Third) */}
                <div className="platform-grid section-group">
                    <div className="glass-card feature-box" onClick={() => navigate('/market')}>
                        <div className="feat-icon">Graph</div>
                        <h3>{t('home_feat1_title')}</h3>
                        <p>{t('home_feat1_desc')}</p>
                        <div className="feat-arrow"><HiArrowRight /></div>
                    </div>
                    <div className="glass-card feature-box prediction-highlight" onClick={() => navigate('/analysis')}>
                        <div className="feat-icon">Advisior</div>
                        <h3>{t('home_feat2_title')}</h3>
                        <p>{t('home_feat2_desc')}</p>
                        <div className="feat-arrow"><HiArrowRight /></div>
                    </div>
                </div>
            </main>

            <footer className="footer-premium">
                <div className="footer-content">
                    <p>{t('home_footer')}</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;

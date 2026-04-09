import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { HiSearch, HiTrendingUp, HiLocationMarker, HiCalendar } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import PricePredictor from '../components/PricePredictor';
import './Market.css';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const Market = () => {
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ count: 0, location: 'All India' });
    const [viewMode, setViewMode] = useState('pan-india'); 
    const [userRegion, setUserRegion] = useState(null);
    const [category, setCategory] = useState('All');
    const [district, setDistrict] = useState('All Cities');

    useEffect(() => {
        detectLocation();
    }, []);

    useEffect(() => {
        fetchMarketData(search);
        // Sync stats location text with current view
        if (viewMode === 'pan-india') setStats(s => ({ ...s, location: 'All India' }));
        else if (userRegion) setStats(s => ({ ...s, location: userRegion }));
    }, [viewMode, userRegion, category, district]);

    const detectLocation = () => {
        if (!navigator.geolocation) return;
        
        navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
                const { latitude, longitude } = pos.coords;
                // Use Nominatim reverse geocoding for consistency across platform
                const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const address = res.data.address || {};
                const state = address.state || '';
                
                if (state) {
                    const city = address.city || address.district || address.county || address.suburb || '';
                    setUserRegion(state);
                    if (city) setDistrict(city);
                    setViewMode('location'); // Auto-switch to location view for better UX
                    setStats(prev => ({ ...prev, location: city ? `${city}, ${state}` : state }));
                }
            } catch (err) {
                console.error('Error detecting region:', err);
            }
        });
    };

    const fetchMarketData = async (query = '') => {
        try {
            setLoading(true);
            const params = { 
                commodity: query,
                limit: viewMode === 'pan-india' ? 200 : 15
            };

            if (viewMode === 'location' && userRegion) {
                params.state = userRegion;
            }
            if (district && district !== 'All Cities') {
                params.district = district;
            }
            
            if (category !== 'All') params.category = category;

            const response = await axios.get(`${API_BASE}/api/mandi-search`, { params });
            setPrices(response.data.results);
            setStats({
                count: response.data.results.length,
                location: viewMode === 'location' ? (district && district !== 'All Cities' ? `${district}, ${userRegion}` : userRegion) : 'Live Pan-India Markets'
            });
            setError(null);
        } catch (err) {
            console.error('Error fetching market data:', err);
            setError('Unable to load market data. Showing recent trends.');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchMarketData(search);
    };

    return (
        <div className="market-container animate-fade-in">
            <div className="market-header glass-card">
                <div className="market-intro">
                    <h1>{t('mkt_title')}</h1>
                    <p>{t('mkt_desc')}</p>
                    <div className="market-status-row">
                        <div className="status-pill source">{t('mkt_source')}</div>
                        <div className="status-pill location">
                            <HiLocationMarker /> {stats.location}
                        </div>
                        <div className="status-pill count">{stats.count} {t('mkt_results')}</div>
                    </div>
                </div>

                <div className="market-controls">
                    <div className="view-toggle glass-card">
                        <button 
                            className={viewMode === 'location' ? 'active' : ''} 
                            onClick={() => setViewMode('location')}
                            disabled={!userRegion}
                        >
                            {t('mkt_loc_btn')} {userRegion ? `(${userRegion})` : ''}
                        </button>
                        <button 
                            className={viewMode === 'pan-india' ? 'active' : ''} 
                            onClick={() => setViewMode('pan-india')}
                        >
                            {t('mkt_pan_btn')}
                        </button>
                    </div>

                    <div className="filter-scroll-container">
                        <div className="filter-bar categories">
                            {['All', 'Grains', 'Vegetables', 'Fruits', 'Spices', 'Oilseeds', 'Pulses', 'Commercial'].map(cat => (
                                <button 
                                    key={cat}
                                    className={category === cat ? 'active' : ''} 
                                    onClick={() => setCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        
                        <div className="filter-bar cities">
                            {['All Cities', ...new Set(prices.map(p => p.district))].slice(0, 10).map(city => (
                                <button 
                                    key={city}
                                    className={district === city ? 'active' : ''} 
                                    onClick={() => setDistrict(city)}
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <form className="search-bar" onSubmit={handleSearch}>
                        <HiSearch className="search-icon" />
                        <input 
                            type="text" 
                            placeholder={t('mkt_search_placeholder')}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button type="submit" className="search-btn">{t('mkt_search_btn')}</button>
                    </form>
                </div>
            </div>
            
            <PricePredictor 
                state={userRegion} 
                district={district !== 'All Cities' ? district : null} 
            />

            <div className="market-content">
                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>{t('mkt_loading')}</p>
                    </div>
                ) : error ? (
                    <div className="error-card">{error}</div>
                ) : (
                    <div className="prices-grid">
                        {prices.length > 0 ? (
                            prices.map((item, index) => (
                                <div key={index} className="price-card glass-card">
                                    <div className="card-header">
                                        <div className="commodity-badge">
                                            <HiTrendingUp /> {item.commodity}
                                            <span className="variety-text">({item.variety})</span>
                                        </div>
                                        <div className="price-modal">
                                            ₹{item.price} <span>{t('mkt_quintal')}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="card-body">
                                        <div className="detail-row">
                                            <HiLocationMarker />
                                            <span>{item.mandi}, {item.district}, {item.state}</span>
                                        </div>
                                        <div className="detail-row">
                                            <HiCalendar />
                                            <span>{t('mkt_update')} {item.date}</span>
                                        </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className="price-range">
                                            <div className="range-item">
                                                <label>{t('mkt_min')}</label>
                                                <span>₹{item.min_price}</span>
                                            </div>
                                            <div className="range-divider"></div>
                                            <div className="range-item">
                                                <label>{t('mkt_max')}</label>
                                                <span>₹{item.max_price}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-results glass-card animate-pulse-slow">
                                <HiTrendingUp className="no-results-icon" />
                                <h3>No Data Found</h3>
                                <p>
                                    {search 
                                        ? `We couldn't find any mandi records for "${search}".`
                                        : `No live mandi records available for ${stats.location === 'Live Pan-India Markets' ? 'all of India' : stats.location}.`}
                                </p>
                                <button className="retry-btn" onClick={() => {
                                    if (viewMode === 'location') setViewMode('pan-india');
                                    else fetchMarketData('');
                                }}>
                                    {viewMode === 'location' ? 'Show All India Data' : 'Refresh Market Data'}
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Market;

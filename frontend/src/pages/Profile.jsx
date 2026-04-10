import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    HiUser, HiCalendar, HiTranslate, HiSun, HiMoon, HiSearch, 
    HiAnnotation, HiCheckCircle, HiCamera, HiChevronDown, HiChevronUp,
    HiInformationCircle, HiCode, HiChip, HiLightningBolt, HiTrash, HiChevronRight
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import './Profile.css';

const Profile = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isDark, setIsDark] = useState(false);
    const [isSettingsExpanded, setIsSettingsExpanded] = useState(window.innerWidth > 900);
    
    // Auto-expand on desktop resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900) {
                setIsSettingsExpanded(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    // Map i18n codes back to string values
    const getLangString = (code) => {
        switch(code) {
            case 'hi': return 'Hindi';
            case 'mr': return 'Marathi';
            case 'gu': return 'Gujarati';
            default: return 'English';
        }
    };

    const [profile, setProfile] = useState({
        name: 'Farmer Ayush',
        dob: '1990-05-15',
        gender: 'Male',
        language: getLangString(i18n.language),
        avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile({ ...profile, avatar: reader.result });
                toast.success('New profile picture selected!');
            };
            reader.readAsDataURL(file);
        }
    };

    const [predictionHistory, setPredictionHistory] = useState([]);
    const [communityActivity, setCommunityActivity] = useState([]);
    const [expandedIdx, setExpandedIdx] = useState(null);

    const deletePrediction = (e, idx) => {
        e.stopPropagation();
        const updated = predictionHistory.filter((_, i) => i !== idx);
        setPredictionHistory(updated);
        localStorage.setItem('recent_predictions', JSON.stringify(updated));
        if (expandedIdx === idx) setExpandedIdx(null);
        else if (expandedIdx > idx) setExpandedIdx(expandedIdx - 1);
    };

    useEffect(() => {
        const loadAllHistory = () => {
            const predData = JSON.parse(localStorage.getItem('recent_predictions') || '[]');
            const activityData = JSON.parse(localStorage.getItem('community_activity') || '[]');
            setPredictionHistory(predData);
            setCommunityActivity(activityData);
        };
        loadAllHistory();
        
        // Listen for internal changes
        window.addEventListener('storage', loadAllHistory);
        return () => window.removeEventListener('storage', loadAllHistory);
    }, []);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            setIsDark(true);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        // In the future this will sync with Firebase
        toast.success('Profile updated securely!', {
            icon: '✅',
            style: {
                borderRadius: '12px',
                background: isDark ? '#333' : '#fff',
                color: isDark ? '#fff' : '#333',
            },
        });
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
        if (e.target.name === 'language') {
            let code = 'en';
            if (e.target.value === 'Hindi') code = 'hi';
            if (e.target.value === 'Marathi') code = 'mr';
            if (e.target.value === 'Gujarati') code = 'gu';
            
            i18n.changeLanguage(code);
            localStorage.setItem('language', code);
        }
    };

    return (
        <>
            <Toaster position="top-right" />
            <div className="profile-container animate-fade-in">
                <div className="profile-header glass-card">
                    <div className="avatar-wrapper">
                        <div className="profile-avatar">
                            <img src={profile.avatar} alt="Profile" />
                        </div>
                        <label htmlFor="avatar-upload" className="edit-avatar-btn">
                            <HiCamera />
                            <input 
                                type="file" 
                                id="avatar-upload" 
                                accept="image/*" 
                                onChange={handleImageChange} 
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <div className="header-info">
                        <h1>{profile.name}</h1>
                        <div className="header-meta-row">
                            <p className="badge-member">🏆 {t('prof_member_since')} 2024</p>
                            <div className="header-stats-inline">
                                <div
                                    className="stat-item stat-clickable"
                                    onClick={() => navigate('/profile/posts')}
                                    title="View all posts"
                                >
                                    <span className="stat-val">6</span>
                                    <span className="stat-lbl">Posts ↗</span>
                                </div>
                                <span className="stat-divider">|</span>
                                <div className="stat-item">
                                    <span className="stat-val">48</span>
                                    <span className="stat-lbl">Likes</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="profile-grid">
                    {/* Settings Panel */}
                    <div className={`settings-panel glass-card ${!isSettingsExpanded ? 'collapsed' : 'expanded'}`}>
                        <div 
                            className="panel-header-clickable" 
                            onClick={() => window.innerWidth <= 900 && setIsSettingsExpanded(!isSettingsExpanded)}
                        >
                            <h2 className="panel-title"><HiUser /> {t('prof_settings')}</h2>
                            <div className="expand-icon-mobile">
                                {isSettingsExpanded ? <HiChevronUp /> : <HiChevronDown />}
                            </div>
                        </div>

                        <div className="settings-content-wrapper">
                            <form onSubmit={handleSave} className="settings-form">
                                <div className="form-group">
                                    <label>{t('prof_full_name')}</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        value={profile.name} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label><HiCalendar /> {t('prof_dob')}</label>
                                    <input 
                                        type="date" 
                                        name="dob" 
                                        value={profile.dob} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>

                                <div className="form-group">
                                    <label>{t('prof_gender')}</label>
                                    <select name="gender" value={profile.gender} onChange={handleChange}>
                                        <option value="Male">{t('prof_male')}</option>
                                        <option value="Female">{t('prof_female')}</option>
                                        <option value="Other">{t('prof_other')}</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label><HiTranslate /> {t('prof_preferred_lang')}</label>
                                    <select name="language" value={profile.language} onChange={handleChange}>
                                        <option value="English">English</option>
                                        <option value="Hindi">Hindi (हिंदी)</option>
                                        <option value="Marathi">Marathi (मराठी)</option>
                                        <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                                    </select>
                                </div>

                                <div className="form-group config-group full-width">
                                    <div>
                                        <label>{t('prof_app_theme')}</label>
                                        <p className="sub-label">{t('prof_theme_desc')}</p>
                                    </div>
                                    <button type="button" onClick={toggleTheme} className="theme-toggle-btn">
                                        {isDark ? <HiMoon className="icon-moon" /> : <HiSun className="icon-sun" />}
                                        <span>{isDark ? t('prof_dark_mode') : t('prof_light_mode')}</span>
                                    </button>
                                </div>

                                <button type="submit" className="btn-save full-width">
                                    <HiCheckCircle /> {t('prof_save_changes')}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Dashboard Panel */}
                    <div className="activity-panel dash-column">
                        <div className="glass-card mb-4 history-container activity-section">
                            <div className="section-header-row">
                                <h2 className="panel-title-alt"><HiSearch /> {t('prof_recent_predictions')}</h2>
                                <span className="count-badge-neutral">{predictionHistory.length}</span>
                            </div>
                            <div className="history-grid-detailed">
                                {predictionHistory.length > 0 ? (
                                    predictionHistory.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`history-card-detailed animate-slide-up ${expandedIdx === idx ? 'pred-expanded' : ''}`}
                                            style={{ animationDelay: `${idx * 0.1}s` }}
                                            onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                                        >
                                            {/* Card Header */}
                                            <div className="history-card-header">
                                                <div className="crop-badge-small">🌾 {item.recommended_crop}</div>
                                                <div className="pred-card-actions">
                                                    <span className="history-timestamp">
                                                        {new Date(item.timestamp).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                                                        {' · '}
                                                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                                                    </span>
                                                    <button
                                                        className="pred-delete-btn"
                                                        onClick={(e) => deletePrediction(e, idx)}
                                                        title="Delete this prediction"
                                                    >
                                                        <HiTrash />
                                                    </button>
                                                    <span className="pred-expand-icon">
                                                        {expandedIdx === idx ? <HiChevronDown /> : <HiChevronRight />}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Stats Row - always visible */}
                                            <div className="history-stats-detailed">
                                                <div className="mini-stat">
                                                    <span className="label">Soil</span>
                                                    <span className="value">{(item.confidence_score * 100).toFixed(0)}%</span>
                                                </div>
                                                <div className="mini-stat">
                                                    <span className="label">Market</span>
                                                    <span className="value">{item.market_profit_margin}%</span>
                                                </div>
                                                <div className="mini-stat">
                                                    <span className="label">Temp</span>
                                                    <span className="value">{item.weather_context?.temp || '--'}°C</span>
                                                </div>
                                            </div>

                                            <div className="logic-hint-simple">
                                                {item.localized_output?.analysis?.substring(0, 55)}...
                                            </div>

                                            {/* Expanded Details */}
                                            {expandedIdx === idx && (() => {
                                                const topAlt = item.alternative_crops?.[0];
                                                const restAlts = item.alternative_crops?.slice(1) || [];
                                                const topName = topAlt ? (typeof topAlt === 'string' ? topAlt : topAlt?.crop) : null;
                                                const topMargin = topAlt && typeof topAlt === 'object' ? topAlt?.profit_margin : null;
                                                const topProfit = topAlt && typeof topAlt === 'object' ? topAlt?.estimated_profit : null;
                                                return (
                                                    <div className="pred-expanded-details">
                                                        {/* Soil Profile */}
                                                        <div className="pred-detail-section">
                                                            <h5>🌱 Soil Profile</h5>
                                                            <div className="pred-detail-grid">
                                                                <div className="pred-detail-item"><label>pH</label><span>{item.soil_data?.ph || '--'}</span></div>
                                                                <div className="pred-detail-item"><label>Nitrogen</label><span>{item.soil_data?.nitrogen || '--'}</span></div>
                                                                <div className="pred-detail-item"><label>Phosphorus</label><span>{item.soil_data?.phosphorus || '--'}</span></div>
                                                                <div className="pred-detail-item"><label>Potassium</label><span>{item.soil_data?.potassium || '--'}</span></div>
                                                                <div className="pred-detail-item"><label>Soil Type</label><span>{item.soil_data?.soil_type || '--'}</span></div>
                                                                <div className="pred-detail-item"><label>Season</label><span>{item.season || '--'}</span></div>
                                                            </div>
                                                        </div>

                                                        {/* Weather */}
                                                        <div className="pred-detail-section">
                                                            <h5>🌡️ Weather at Prediction</h5>
                                                            <div className="pred-detail-grid">
                                                                <div className="pred-detail-item"><label>Temp</label><span>{item.weather_context?.temp || '--'}°C</span></div>
                                                                <div className="pred-detail-item"><label>Humidity</label><span>{item.weather_context?.humidity || '--'}%</span></div>
                                                                <div className="pred-detail-item"><label>Rainfall</label><span>{item.weather_context?.rainfall || '--'} mm</span></div>
                                                            </div>
                                                        </div>

                                                        {/* Second Recommendation */}
                                                        {topName && (
                                                            <div className="pred-detail-section">
                                                                <h5>🥈 Second Recommendation</h5>
                                                                <div className="second-rec-card">
                                                                    <div className="second-rec-main">
                                                                        <span className="second-rec-crop">🌾 {topName}</span>
                                                                        {topMargin != null && (
                                                                            <span className="second-rec-badge">+{topMargin}% margin</span>
                                                                        )}
                                                                    </div>
                                                                    {topProfit != null && (
                                                                        <div className="second-rec-profit">
                                                                            <label>Est. Profit</label>
                                                                            <span>₹{Number(topProfit).toLocaleString('en-IN')}</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {restAlts.length > 0 && (
                                                                    <div className="alt-crops-row" style={{ marginTop: '0.6rem' }}>
                                                                        {restAlts.map((c, i) => {
                                                                            const n = typeof c === 'string' ? c : c?.crop;
                                                                            const m = typeof c === 'object' && c?.profit_margin != null ? ` • ${c.profit_margin}%` : '';
                                                                            return <span key={i} className="alt-crop-chip">{n}{m}</span>;
                                                                        })}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}

                                                        {/* AI Expert Analysis */}
                                                        {item.localized_output?.analysis && (
                                                            <div className="pred-detail-section">
                                                                <h5>🤖 AI Expert Analysis</h5>
                                                                <p className="pred-full-analysis">{item.localized_output.analysis}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-history-compact">
                                        <p>No recent AI recommendations yet. Try searching on the home page!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="glass-card activity-section">
                            <div className="section-header-row">
                                <h2 className="panel-title-alt"><HiAnnotation /> {t('prof_comm_activity')}</h2>
                                <span className="count-badge-accent">{communityActivity.length}</span>
                            </div>
                            <div className="activity-timeline">
                                {communityActivity.length > 0 ? (
                                    communityActivity.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className="activity-card animate-fade-in activity-card-clickable"
                                            style={{ animationDelay: `${idx * 0.15}s` }}
                                            onClick={() => navigate(`/community?post=${item.postId}`)}
                                            title="View post"
                                        >
                                            <div className="activity-icon-bg-small" style={{ backgroundColor: `${item.color}15`, color: item.color }}>
                                                {item.icon}
                                            </div>
                                            <div className="activity-content-compact">
                                                <p className="activity-detail-small">{item.detail}</p>
                                                <span className="activity-date-tag-mini">{item.date}</span>
                                            </div>
                                            <span className="activity-arrow">›</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="empty-activity-msg">
                                        <p>No community activity yet. Start liking and commenting on posts!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="glass-card activity-section mt-4">
                            <div className="section-header-row">
                                <h2 className="panel-title-alt"><HiInformationCircle /> App & Developer Info</h2>
                                <span className="version-badge">v2.5.4 Stable</span>
                            </div>
                            <div className="app-info-grid">
                                <div className="info-item-card">
                                    <HiUser className="info-icon-p" />
                                    <div className="info-text">
                                        <label>Developer</label>
                                        <p>Ayush (KrishiSense Dev)</p>
                                    </div>
                                </div>
                                <div className="info-item-card">
                                    <HiLightningBolt className="info-icon-s" />
                                    <div className="info-text">
                                        <label>Core Engine</label>
                                        <p>Gemini 2.5 Flash AI</p>
                                    </div>
                                </div>
                                <div className="info-item-card">
                                    <HiCode className="info-icon-b" />
                                    <div className="info-text">
                                        <label>Stacks</label>
                                        <p>React • FastAPI • Python</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mission-box">
                                <HiChip className="mission-icon" />
                                <p>"Empowering Indian farmers with the latest AI intelligence for a sustainable future."</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;

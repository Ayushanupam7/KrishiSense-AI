import React from 'react';
import './CropCalendar.css';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Sow and harvest windows for major crops
const CROP_CALENDAR = {
    Rice:       { sow: [5, 6, 7], grow: [7, 8, 9], harvest: [10, 11], season: 'Kharif' },
    Wheat:      { sow: [10, 11], grow: [11, 12, 0, 1], harvest: [2, 3, 4], season: 'Rabi' },
    Maize:      { sow: [5, 6], grow: [7, 8], harvest: [9, 10], season: 'Kharif' },
    Cotton:     { sow: [4, 5, 6], grow: [7, 8, 9], harvest: [10, 11, 12], season: 'Kharif' },
    Soybean:    { sow: [5, 6], grow: [7, 8], harvest: [9, 10], season: 'Kharif' },
    Sugarcane:  { sow: [1, 2], grow: [3, 4, 5, 6, 7, 8, 9, 10, 11], harvest: [11, 0], season: 'Annual' },
    Arhar:      { sow: [5, 6], grow: [7, 8, 9, 10], harvest: [11, 0], season: 'Kharif' },
    Chickpea:   { sow: [10, 11], grow: [11, 0, 1], harvest: [2, 3], season: 'Rabi' },
    Mustard:    { sow: [9, 10], grow: [10, 11, 12], harvest: [1, 2], season: 'Rabi' },
    Potato:     { sow: [9, 10], grow: [10, 11, 12], harvest: [0, 1], season: 'Rabi' },
    Tomato:     { sow: [5, 6, 9, 10], grow: [7, 8, 11, 12], harvest: [9, 10, 1, 2], season: 'Both' },
    Onion:      { sow: [10, 11], grow: [11, 0, 1], harvest: [2, 3, 4], season: 'Rabi' },
    Banana:     { sow: [1, 2], grow: [2, 3, 4, 5, 6, 7, 8, 9, 10], harvest: [10, 11], season: 'Annual' },
    Turmeric:   { sow: [4, 5], grow: [5, 6, 7, 8, 9, 10, 11], harvest: [0, 1], season: 'Kharif' },
    Urad:       { sow: [5, 6], grow: [7, 8], harvest: [9, 10], season: 'Kharif' },
    Moong:      { sow: [2, 3, 6], grow: [3, 4, 7, 8], harvest: [5, 9], season: 'Both' },
    Rajma:      { sow: [10, 11], grow: [11, 12, 0], harvest: [1, 2], season: 'Rabi' },
    Lentil:     { sow: [10, 11], grow: [11, 12, 0], harvest: [2, 3], season: 'Rabi' },
    Mango:      { sow: [6, 7], grow: [7, 8, 9, 10, 11, 12, 0, 1, 2, 3], harvest: [4, 5, 6], season: 'Perennial' },
    Coconut:    { sow: [5, 6], grow: [6, 7, 8, 9, 10], harvest: [10, 11, 0], season: 'Perennial' },
};

const getCurrentMonth = () => new Date().getMonth();

const getPhaseForMonth = (calendar, monthIdx) => {
    if (!calendar) return null;
    if (calendar.sow.includes(monthIdx)) return 'sow';
    if (calendar.grow.includes(monthIdx)) return 'grow';
    if (calendar.harvest.includes(monthIdx)) return 'harvest';
    return null;
};

const PHASE_COLORS = {
    sow:     { bg: '#e3f2fd', border: '#2196f3', label: 'Sowing', emoji: '🌱' },
    grow:    { bg: '#e8f5e9', border: '#4caf50', label: 'Growing', emoji: '☀️' },
    harvest: { bg: '#fff8e1', border: '#ff9800', label: 'Harvest', emoji: '🌾' },
};

const CropCalendar = ({ crop }) => {
    const calendar = CROP_CALENDAR[crop] || CROP_CALENDAR[crop?.charAt(0).toUpperCase() + crop?.slice(1).toLowerCase()];
    if (!calendar) return null;

    const currentMonth = getCurrentMonth();

    // Find the best sowing month(s) upcoming
    const nextSow = calendar.sow.find(m => m >= currentMonth) ?? calendar.sow[0];
    const monthsToSow = ((nextSow - currentMonth) + 12) % 12;

    return (
        <div className="crop-calendar-widget">
            <div className="cal-header">
                <div className="cal-title">
                    <span className="cal-icon">📅</span>
                    <span>Crop Calendar</span>
                    <span className="cal-season-badge">{calendar.season}</span>
                </div>
                {monthsToSow === 0 ? (
                    <div className="sow-alert sow-now">🌱 Sow <strong>NOW</strong>!</div>
                ) : monthsToSow <= 2 ? (
                    <div className="sow-alert sow-soon">⏳ Sow in <strong>{monthsToSow} month{monthsToSow > 1 ? 's' : ''}</strong></div>
                ) : (
                    <div className="sow-alert sow-later">📆 Next sow: <strong>{MONTHS[nextSow]}</strong></div>
                )}
            </div>

            <div className="cal-months-row">
                {MONTHS.map((month, idx) => {
                    const phase = getPhaseForMonth(calendar, idx);
                    const isCurrent = idx === currentMonth;
                    const phaseStyle = phase ? PHASE_COLORS[phase] : null;
                    return (
                        <div
                            key={idx}
                            className={`cal-month ${isCurrent ? 'current-month' : ''} ${phase ? 'has-phase' : ''}`}
                            style={phaseStyle ? {
                                background: phaseStyle.bg,
                                borderColor: phaseStyle.border,
                            } : {}}
                        >
                            <div className="cal-month-emoji">{phase ? phaseStyle.emoji : ''}</div>
                            <div className="cal-month-label">{month}</div>
                            {isCurrent && <div className="current-indicator"></div>}
                        </div>
                    );
                })}
            </div>

            <div className="cal-legend">
                {Object.entries(PHASE_COLORS).map(([key, val]) => (
                    <div key={key} className="legend-item">
                        <div className="legend-dot" style={{ background: val.border }}></div>
                        <span>{val.emoji} {val.label}</span>
                    </div>
                ))}
                <div className="legend-item">
                    <div className="legend-dot current-dot"></div>
                    <span>📍 Current Month</span>
                </div>
            </div>
        </div>
    );
};

export default CropCalendar;

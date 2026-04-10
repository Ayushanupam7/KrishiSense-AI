import React, { useState, useEffect, useRef } from 'react';
import './LiveStatsTicker.css';

const STATS = [
    { label: 'Farmers Served', value: 12480, suffix: '+', icon: '👨‍🌾', color: '#4caf50' },
    { label: 'Crops Analyzed', value: 58320, suffix: '+', icon: '🌾', color: '#2196f3' },
    { label: 'Avg. Profit Boost', value: 34, suffix: '%', icon: '📈', color: '#ff9800' },
    { label: 'States Covered', value: 22, suffix: '', icon: '🗺️', color: '#9c27b0' },
    { label: 'Mandi Prices Live', value: 4200, suffix: '+', icon: '🏪', color: '#e91e63' },
    { label: 'AI Accuracy', value: 91, suffix: '%', icon: '🤖', color: '#00bcd4' },
];

function useCountUp(target, duration = 1800, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return count;
}

const StatItem = ({ stat, animate }) => {
    const count = useCountUp(stat.value, 1800, animate);
    return (
        <div className="stat-item">
            <div className="stat-icon" style={{ background: `${stat.color}18`, color: stat.color }}>
                {stat.icon}
            </div>
            <div className="stat-body">
                <div className="stat-value" style={{ color: stat.color }}>
                    {count.toLocaleString('en-IN')}{stat.suffix}
                </div>
                <div className="stat-label">{stat.label}</div>
            </div>
        </div>
    );
};

const LiveStatsTicker = () => {
    const [animate, setAnimate] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setAnimate(true); },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="live-stats-band" ref={ref}>
            <div className="live-badge">
                <span className="live-dot"></span>
                LIVE IMPACT
            </div>
            <div className="stats-ticker-grid">
                {STATS.map((stat, i) => (
                    <StatItem key={i} stat={stat} animate={animate} />
                ))}
            </div>
        </div>
    );
};

export default LiveStatsTicker;

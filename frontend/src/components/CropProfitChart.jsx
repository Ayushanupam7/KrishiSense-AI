import React, { useEffect, useRef } from 'react';
import './CropProfitChart.css';

// Pure Canvas horizontal bar chart — no Chart.js needed
const CropProfitChart = ({ recommendedCrop, alternativeCrops, estimatedProfit }) => {
    const canvasRef = useRef(null);

    // Build dataset
    const allCrops = [
        { crop: recommendedCrop, profit: estimatedProfit || 0, isMain: true },
        ...(alternativeCrops || []).map(a => ({
            crop: a.crop,
            profit: a.estimated_profit || 0,
            isMain: false,
        })),
    ].filter(c => c.profit > 0).sort((a, b) => b.profit - a.profit).slice(0, 5);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || allCrops.length === 0) return;
        const ctx = canvas.getContext('2d');
        const dpr = window.devicePixelRatio || 1;

        const W = canvas.offsetWidth;
        const H = canvas.offsetHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        ctx.scale(dpr, dpr);

        const padding = { top: 20, right: 20, bottom: 35, left: 70 };
        const chartW = W - padding.left - padding.right;
        const chartH = H - padding.top - padding.bottom;

        const maxProfit = Math.max(...allCrops.map(c => c.profit)) * 1.15;
        const barGap = 12;
        const barH = (chartH / allCrops.length) - barGap;

        ctx.clearRect(0, 0, W, H);

        // Grid lines + x-labels
        const gridCount = 4;
        ctx.strokeStyle = 'rgba(0,0,0,0.06)';
        ctx.lineWidth = 1;
        for (let i = 0; i <= gridCount; i++) {
            const x = padding.left + (i / gridCount) * chartW;
            ctx.beginPath();
            ctx.moveTo(x, padding.top);
            ctx.lineTo(x, padding.top + chartH);
            ctx.stroke();

            const val = Math.round((i / gridCount) * maxProfit);
            ctx.fillStyle = 'rgba(0,0,0,0.38)';
            ctx.font = '600 9px Inter, system-ui';
            ctx.textAlign = 'center';
            ctx.fillText(val >= 1000 ? '₹' + (val / 1000).toFixed(0) + 'k' : '₹' + val, x, padding.top + chartH + 18);
        }

        // Draw bars
        allCrops.forEach((crop, i) => {
            const y = padding.top + i * (barH + barGap);
            const barLen = (crop.profit / maxProfit) * chartW;

            // Gradient fill
            const grad = ctx.createLinearGradient(padding.left, 0, padding.left + barLen, 0);
            if (crop.isMain) {
                grad.addColorStop(0, '#1b5e20');
                grad.addColorStop(1, '#69f0ae');
            } else {
                grad.addColorStop(0, '#1565c0');
                grad.addColorStop(1, '#90caf9');
            }
            ctx.fillStyle = grad;

            // Rounded rect
            const r = Math.min(barH / 2, 8);
            ctx.beginPath();
            ctx.moveTo(padding.left + r, y);
            ctx.lineTo(padding.left + barLen - r, y);
            ctx.arcTo(padding.left + barLen, y, padding.left + barLen, y + r, r);
            ctx.lineTo(padding.left + barLen, y + barH - r);
            ctx.arcTo(padding.left + barLen, y + barH, padding.left + barLen - r, y + barH, r);
            ctx.lineTo(padding.left + r, y + barH);
            ctx.arcTo(padding.left, y + barH, padding.left, y + barH - r, r);
            ctx.lineTo(padding.left, y + r);
            ctx.arcTo(padding.left, y, padding.left + r, y, r);
            ctx.closePath();
            ctx.fill();

            // Glow for main crop
            if (crop.isMain) {
                ctx.save();
                ctx.shadowColor = 'rgba(46, 125, 50, 0.35)';
                ctx.shadowBlur = 14;
                ctx.fill();
                ctx.restore();
            }

            // Value label inside bar
            if (barLen > 70) {
                ctx.fillStyle = '#fff';
                ctx.font = '700 10px Inter, system-ui';
                ctx.textAlign = 'right';
                ctx.fillText('₹' + (crop.profit / 1000).toFixed(1) + 'k', padding.left + barLen - 8, y + barH / 2 + 4);
            }

            // Crop name (Y-axis)
            ctx.fillStyle = crop.isMain ? '#1b5e20' : 'rgba(0,0,0,0.6)';
            ctx.font = (crop.isMain ? '700' : '600') + ' 11px Inter, system-ui';
            ctx.textAlign = 'right';
            ctx.fillText(crop.crop, padding.left - 8, y + barH / 2 + 4);
        });

        // X-axis line
        ctx.strokeStyle = 'rgba(0,0,0,0.08)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top + chartH);
        ctx.lineTo(padding.left + chartW, padding.top + chartH);
        ctx.stroke();
    }, [alternativeCrops, estimatedProfit, recommendedCrop]);

    if (allCrops.length < 2) return null;

    return (
        <div className="profit-chart-widget">
            <div className="profit-chart-header">
                <div className="profit-chart-title">
                    <span>📊</span>
                    <span>Profit Comparison</span>
                    <span className="profit-chart-unit">per acre (₹)</span>
                </div>
                <div className="profit-chart-legend">
                    <div className="legend-chip main-chip">
                        <div className="chip-dot green-dot"></div>
                        {recommendedCrop} (Recommended)
                    </div>
                    <div className="legend-chip">
                        <div className="chip-dot blue-dot"></div>
                        Alternatives
                    </div>
                </div>
            </div>
            <canvas
                ref={canvasRef}
                className="profit-canvas"
                style={{ width: '100%', height: `${Math.max(180, allCrops.length * 52)}px` }}
            />
        </div>
    );
};

export default CropProfitChart;

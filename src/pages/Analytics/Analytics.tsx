import React from 'react';
import AreaChart from '../../components/Visuals/AreaChart';
import { FiPieChart, FiAward, FiTarget } from 'react-icons/fi';
import './Analytics.scss';

const USER_TRAFFIC_DATA = [
  { label: 'Week 1', value: 2400 },
  { label: 'Week 2', value: 3800 },
  { label: 'Week 3', value: 3100 },
  { label: 'Week 4', value: 4500 },
  { label: 'Week 5', value: 5900 }
];

const SIGNUPS_DATA = [
  { label: 'Week 1', value: 120 },
  { label: 'Week 2', value: 190 },
  { label: 'Week 3', value: 150 },
  { label: 'Week 4', value: 220 },
  { label: 'Week 5', value: 340 }
];

const CUSTOMER_GROWTH_BARS = [
  { label: 'Mon', value: 45, color: 'var(--color-accent-blue)' },
  { label: 'Tue', value: 80, color: 'var(--color-accent-blue)' },
  { label: 'Wed', value: 55, color: 'var(--color-accent-blue)' },
  { label: 'Thu', value: 95, color: 'var(--color-accent-blue)' },
  { label: 'Fri', value: 110, color: 'var(--color-accent-blue)' },
  { label: 'Sat', value: 75, color: 'var(--color-accent-blue)' },
  { label: 'Sun', value: 30, color: 'var(--color-accent-blue)' }
];

const Analytics: React.FC = () => {
  const maxBarValue = Math.max(...CUSTOMER_GROWTH_BARS.map(b => b.value)) * 1.1;

  return (
    <div className="analytics-page animate-fade-in">
      <div className="page-header-row">
        <div>
          <h1>Detailed Analytics Reports</h1>
          <p>Analyze user session traffic, performance reports, and milestones achievements.</p>
        </div>
      </div>

      {/* Grid of Achievement Statistics */}
      <div className="analytics-stats-grid">
        <div className="card stat-block">
          <div className="stat-icon-box blue">
            <FiAward />
          </div>
          <div>
            <h4>Peak Weekly Traffic</h4>
            <h3>5,900 visits</h3>
            <span>+18.4% last month</span>
          </div>
        </div>

        <div className="card stat-block">
          <div className="stat-icon-box teal">
            <FiTarget />
          </div>
          <div>
            <h4>Active Conversion</h4>
            <h3>8.42% target</h3>
            <span>+1.5% target achievement</span>
          </div>
        </div>

        <div className="card stat-block">
          <div className="stat-icon-box amber">
            <FiPieChart />
          </div>
          <div>
            <h4>New User Signups</h4>
            <h3>340 accounts</h3>
            <span>+42% weekly increase</span>
          </div>
        </div>
      </div>

      <div className="analytics-charts-container">
        {/* Custom SVG Area chart */}
        <div className="card chart-box">
          <AreaChart 
            data1={USER_TRAFFIC_DATA} 
            data2={SIGNUPS_DATA} 
            title1="Session Traffic Growth" 
            title2="Accounts Signups Growth" 
          />
        </div>

        {/* Natively coded SVG Bar chart */}
        <div className="card chart-box bar-chart-wrapper">
          <div className="bar-chart-header">
            <h3>Daily Operations Traffic</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Last 7 Days</span>
          </div>

          <div className="bar-chart-content">
            <svg viewBox="0 0 400 200" className="bar-chart-svg">
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
                const y = 20 + 140 * (1 - p);
                const val = Math.round(maxBarValue * p);
                return (
                  <g key={idx}>
                    <line x1="40" y1={y} x2="380" y2={y} stroke="var(--border-color)" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="30" y={y + 4} textAnchor="end" fontSize="9" fill="var(--text-muted)">{val}</text>
                  </g>
                );
              })}

              {/* Renders bars */}
              {CUSTOMER_GROWTH_BARS.map((bar, idx) => {
                const colWidth = 340 / CUSTOMER_GROWTH_BARS.length;
                const x = 50 + idx * colWidth + (colWidth - 24) / 2;
                const barHeight = (bar.value / maxBarValue) * 140;
                const y = 160 - barHeight;

                return (
                  <g key={idx}>
                    {/* Hover rect overlay */}
                    <rect 
                      x={x} 
                      y={y} 
                      width="24" 
                      height={barHeight} 
                      fill="var(--color-accent-blue)" 
                      rx="3"
                      style={{ transition: 'all 0.3s' }} 
                    />
                    {/* X axis labels */}
                    <text x={x + 12} y="180" textAnchor="middle" fontSize="10" fill="var(--text-secondary)">{bar.label}</text>
                    {/* Value text above bar */}
                    <text x={x + 12} y={y - 6} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--text-primary)">{bar.value}</text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

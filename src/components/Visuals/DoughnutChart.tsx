import React, { useState } from 'react';

interface DoughnutItem {
  label: string;
  value: number;
  color: string;
}

interface DoughnutChartProps {
  data: DoughnutItem[];
  title: string;
}

export const DoughnutChart: React.FC<DoughnutChartProps> = ({ data, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  // SVG parameters
  const size = 200;
  const radius = 70;
  const strokeWidth = 24;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center', width: '100%' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, alignSelf: 'flex-start' }}>{title}</h3>
      
      <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-around', gap: '20px', flexWrap: 'wrap' }}>
        {/* SVG Doughnut */}
        <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeLength = (percentage / 100) * circumference;
              const strokeOffset = circumference - (accumulatedPercentage / 100) * circumference;
              
              accumulatedPercentage += percentage;
              
              const isHovered = hoveredIndex === idx;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                  strokeDasharray={`${strokeLength} ${circumference}`}
                  strokeDashoffset={strokeOffset}
                  transform={`rotate(-90 ${center} ${center})`}
                  style={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              );
            })}
          </svg>

          {/* Centered label */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {hoveredIndex !== null ? data[hoveredIndex].label : 'Total'}
            </span>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
              {hoveredIndex !== null ? data[hoveredIndex].value : total}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '120px' }}>
          {data.map((item, idx) => {
            const percentage = ((item.value / total) * 100).toFixed(0);
            const isHovered = hoveredIndex === idx;

            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  cursor: 'pointer',
                  opacity: hoveredIndex !== null && !isHovered ? 0.5 : 1,
                  transform: isHovered ? 'scale(1.05) translateX(4px)' : 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '4px', background: item.color }} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.label}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {item.value} units ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;

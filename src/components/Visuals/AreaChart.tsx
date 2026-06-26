import React, { useState, useRef } from 'react';

interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data1: DataPoint[];
  data2: DataPoint[];
  title1: string;
  title2: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({ data1, data2, title1, title2 }) => {
  const [activeSeries, setActiveSeries] = useState<'series1' | 'series2'>('series1');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeData = activeSeries === 'series1' ? data1 : data2;
  const activeTitle = activeSeries === 'series1' ? title1 : title2;

  // Find max value to scale chart height
  const maxVal = Math.max(...activeData.map(d => d.value)) * 1.15; // 15% margin
  const minVal = 0;

  // Chart layout specs
  const width = 500;
  const height = 240;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Helper to convert data point to SVG coordinates
  const getCoords = (index: number, value: number) => {
    const x = paddingLeft + (index / (activeData.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((value - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y };
  };

  // Generate SVG path for the area and border line
  let linePath = '';
  let areaPath = '';

  if (activeData.length > 0) {
    const coords = activeData.map((d, i) => getCoords(i, d.value));
    
    // Create bezier curve line
    linePath = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 0; i < coords.length - 1; i++) {
      const curr = coords[i];
      const next = coords[i + 1];
      const cpX1 = curr.x + (next.x - curr.x) / 2;
      const cpY1 = curr.y;
      const cpX2 = curr.x + (next.x - curr.x) / 2;
      const cpY2 = next.y;
      linePath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${next.x} ${next.y}`;
    }

    // Close the area path to the bottom axis
    areaPath = `${linePath} L ${coords[coords.length - 1].x} ${paddingTop + chartHeight} L ${coords[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Handle cursor positioning on hover
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - paddingLeft;
    
    // Find closest index
    const colWidth = chartWidth / (activeData.length - 1);
    let idx = Math.round(mouseX / colWidth);
    idx = Math.max(0, Math.min(activeData.length - 1, idx));
    
    setHoveredIndex(idx);

    const coords = getCoords(idx, activeData[idx].value);
    setTooltipPos({
      x: coords.x,
      y: coords.y - 12
    });
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  // Generate vertical grid lines
  const gridLines = 4;
  const gridVals = Array.from({ length: gridLines + 1 }).map((_, i) => minVal + (maxVal - minVal) * (i / gridLines));

  return (
    <div ref={containerRef} style={{ width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{activeTitle}</h3>
        <div style={{ display: 'flex', gap: '6px', background: 'rgba(255,255,255,0.05)', padding: '3px', borderRadius: '8px', border: 'var(--glass-border)' }}>
          <button 
            style={{ 
              padding: '4px 8px', 
              fontSize: '0.75rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600,
              background: activeSeries === 'series1' ? 'var(--color-primary)' : 'transparent',
              color: activeSeries === 'series1' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveSeries('series1')}
          >
            {title1}
          </button>
          <button 
            style={{ 
              padding: '4px 8px', 
              fontSize: '0.75rem', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600,
              background: activeSeries === 'series2' ? 'var(--color-primary)' : 'transparent',
              color: activeSeries === 'series2' ? 'var(--text-inverse)' : 'var(--text-secondary)',
              transition: 'all 0.2s'
            }}
            onClick={() => setActiveSeries('series2')}
          >
            {title2}
          </button>
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        width="100%" 
        height="100%" 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: 'visible', cursor: 'crosshair' }}
      >
        <defs>
          {/* Gradient for area fill */}
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {gridVals.map((val, i) => {
          const y = paddingTop + chartHeight - (i / gridLines) * chartHeight;
          return (
            <g key={i}>
              <line 
                x1={paddingLeft} 
                y1={y} 
                x2={width - paddingRight} 
                y2={y} 
                stroke="var(--border-color)" 
                strokeWidth="1" 
                strokeDasharray="4 4"
              />
              <text 
                x={paddingLeft - 8} 
                y={y + 4} 
                textAnchor="end" 
                fontSize="10" 
                fill="var(--text-muted)"
              >
                {Math.round(val)}
              </text>
            </g>
          );
        })}

        {/* Area fill path */}
        <path d={areaPath} fill="url(#chartGradient)" />

        {/* Line border path */}
        <path 
          d={linePath} 
          fill="none" 
          stroke="var(--color-primary)" 
          strokeWidth="3" 
          strokeLinecap="round"
          style={{ transition: 'd 0.3s ease' }}
        />

        {/* X Axis Labels */}
        {activeData.map((d, i) => {
          const coords = getCoords(i, d.value);
          return (
            <text 
              key={i} 
              x={coords.x} 
              y={height - 8} 
              textAnchor="middle" 
              fontSize="10" 
              fill="var(--text-muted)"
            >
              {d.label}
            </text>
          );
        })}

        {/* Hover elements */}
        {hoveredIndex !== null && (
          <g>
            {/* Vertical pointer line */}
            <line 
              x1={tooltipPos.x} 
              y1={paddingTop} 
              x2={tooltipPos.x} 
              y2={paddingTop + chartHeight} 
              stroke="var(--color-primary)" 
              strokeWidth="1.5" 
              strokeDasharray="2 2"
            />
            {/* Coordinate Node ring */}
            <circle 
              cx={tooltipPos.x} 
              cy={getCoords(hoveredIndex, activeData[hoveredIndex].value).y} 
              r="6" 
              fill="var(--bg-primary)" 
              stroke="var(--color-primary)" 
              strokeWidth="3"
            />
          </g>
        )}
      </svg>

      {/* Tooltip Overlay */}
      {hoveredIndex !== null && (
        <div 
          style={{
            position: 'absolute',
            left: `${(tooltipPos.x / width) * 100}%`,
            top: `${(tooltipPos.y / height) * 100}%`,
            transform: 'translate(-50%, -100%)',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--color-primary)',
            boxShadow: 'var(--shadow-md)',
            borderRadius: '6px',
            padding: '6px 10px',
            pointerEvents: 'none',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            whiteSpace: 'nowrap'
          }}
        >
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {activeData[hoveredIndex].label}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {activeSeries === 'series1' ? '$' : ''}
            {activeData[hoveredIndex].value.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  );
};

export default AreaChart;

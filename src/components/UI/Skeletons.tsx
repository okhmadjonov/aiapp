import React from 'react';

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', padding: '10px' }}>
      {/* Header skeleton */}
      <div style={{ display: 'flex', gap: '20px', paddingBottom: '12px', borderBottom: '2px solid var(--border-color)' }}>
        {Array.from({ length: cols }).map((_, idx) => (
          <div 
            key={idx} 
            className="skeleton" 
            style={{ height: '18px', flex: 1, borderRadius: '4px' }}
          />
        ))}
      </div>
      
      {/* Row skeletons */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div 
          key={rIdx} 
          style={{ display: 'flex', gap: '20px', padding: '12px 0', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}
        >
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div 
              key={cIdx} 
              className="skeleton" 
              style={{ 
                height: '16px', 
                flex: 1, 
                borderRadius: '4px',
                width: cIdx === 0 ? '60%' : '100%' // First column narrower (simulating avatar + text)
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '130px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="skeleton" style={{ height: '14px', width: '40%', borderRadius: '4px' }} />
        <div className="skeleton" style={{ height: '30px', width: '30px', borderRadius: '50%' }} />
      </div>
      <div className="skeleton" style={{ height: '32px', width: '60%', borderRadius: '6px' }} />
      <div className="skeleton" style={{ height: '12px', width: '80%', borderRadius: '4px' }} />
    </div>
  );
};

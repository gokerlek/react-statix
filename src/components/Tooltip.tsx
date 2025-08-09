import React, { ReactNode, useState } from 'react';

interface TooltipProps {
  children: ReactNode;
  label: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, label }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            whiteSpace: 'nowrap',
            zIndex: 1000,
            marginBottom: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }}
        >
          {label}
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid #333'
            }}
          />
        </div>
      )}
    </div>
  );
};
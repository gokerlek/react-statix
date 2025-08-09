import React, { ReactNode } from 'react';
import { Tooltip } from './Tooltip';
import {colors} from "./table/useStyle";

interface IconButtonProps {
  label: string;
  onClick: () => void;
  children: ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ label, onClick, children }) => {
  return (
    <Tooltip label={label}>
      <button
        onClick={onClick}
        style={{
          padding: '8px',
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          borderRadius: '6px',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color 0.2s ease',
          color: colors.text.secondary,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#f0f0f0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
};

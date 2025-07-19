import React from "react";

import statix from "../assets/statix.svg";

interface StatixButtonProps {
  onClick: () => void;
}

export const StatixButton: React.FC<StatixButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: "fixed",
        backgroundColor: "white",
        bottom: "12px",
        right: "12px",
        width: "50px",
        height: "50px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        zIndex: 10000000,
        padding: "5px",
      }}
    >
      <img src={statix} alt="Statix" />
    </button>
  );
};

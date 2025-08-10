import React from "react";
import {colors} from "./table/useStyle";

interface StatixContentProps {
  isOpen: boolean;
  children?: React.ReactNode;
}

export const StatixContent: React.FC<StatixContentProps> = ({
  isOpen,
  children,
}) => {
  return (
    <div
      style={{
        position: "fixed",
        bottom: isOpen ? "0" : "-70vh",
        left: "0",
        width: "100%",
        height: "70vh",
        backgroundColor: colors.bg.body,
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        transition: "bottom 0.3s ease-in-out",
        zIndex: 100000,
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        padding: "20px",
      }}
    >
      {children}
    </div>
  );
};


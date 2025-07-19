import React from "react";

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
        bottom: isOpen ? "0" : "-90vh",
        left: "0",
        width: "100%",
        height: "90vh",
        backgroundColor: "#ffffff",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
        transition: "bottom 0.3s ease-in-out",
        zIndex: 100000,
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        padding: "20px",
        overflow: "auto",
      }}
    >
      <div>{children}</div>
    </div>
  );
};

export default StatixContent;

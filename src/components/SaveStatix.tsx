// src/components/SaveStatix.tsx

import React from "react";

import { useStatix } from "../hooks/useStatix";

export const SaveStatix: React.FC = () => {
  const { saveChanges, resetChanges, editable } = useStatix();

  if (!editable) return null;

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}
    >
      <button
        onClick={saveChanges}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Save
      </button>
      <button
        onClick={resetChanges}
        style={{ marginLeft: "10px", padding: "10px 20px", fontSize: "16px" }}
      >
        Reset
      </button>
    </div>
  );
};

import { useContext } from "react";

import { StatixContext, StatixContextType } from "../context/StatixContext";

export const useStatix = (): StatixContextType => {
  const context = useContext(StatixContext);
  if (!context) {
    throw new Error("useStatix must be used within a StatixProvider");
  }
  return context;
};

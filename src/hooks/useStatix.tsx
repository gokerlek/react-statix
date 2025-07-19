import { useContext } from "react";

import { StatixContext } from "../context/StatixProvider";
import { StatixContextType } from "../context/StatixProvider";

export const useStatix = (): StatixContextType => {
  const context = useContext(StatixContext);
  if (!context) {
    throw new Error("useStatix must be used within a StatixProvider");
  }
  return context;
};

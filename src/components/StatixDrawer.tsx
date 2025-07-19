import React, { useState } from "react";

import { useStatix } from "../hooks/useStatix";

import { StatixButton } from "./StatixButton";
import { StatixContent } from "./StatixContent";

interface StatixDrawerProps {
  children?: React.ReactNode;
}

export const StatixDrawer: React.FC<StatixDrawerProps> = ({ children }) => {
  const { editable } = useStatix();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  if (!editable) return null;

  return (
    <>
      <StatixButton onClick={toggleDrawer} />
      <StatixContent isOpen={isOpen}>{children}</StatixContent>
    </>
  );
};

export default StatixDrawer;

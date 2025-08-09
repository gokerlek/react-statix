// src/components/SaveStatix.tsx

import React from "react";

import { useStatix } from "../hooks/useStatix";
import { IconButton } from "./IconButton";

export const SaveStatix: React.FC = () => {
  const { saveChanges, resetChanges } = useStatix();

  return (
    <div style={{ display: 'flex', alignItems:'center', }}>
        <IconButton
            label="Save changes"
            onClick={saveChanges}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-save-all-icon lucide-save-all">
                <path d="M10 2v3a1 1 0 0 0 1 1h5"/>
                <path d="M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6"/>
                <path d="M18 22H4a2 2 0 0 1-2-2V6"/>
                <path
                    d="M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z"/>
            </svg>
        </IconButton>
        <IconButton
            label="Reset changes"
            onClick={resetChanges}
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                 className="lucide lucide-save-off-icon lucide-save-off">
                <path d="M13 13H8a1 1 0 0 0-1 1v7"/>
                <path d="M14 8h1"/>
                <path d="M17 21v-4"/>
                <path d="m2 2 20 20"/>
                <path d="M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41"/>
                <path d="M29.5 11.5s5 5 4 5"/>
                <path d="M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15"/>
            </svg>
        </IconButton>
    </div>
  );
};

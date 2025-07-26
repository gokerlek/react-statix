import React, { useRef, useState } from "react";

import { useStatix } from "../hooks/useStatix";
import { getNestedValue } from "../utils/getNestedValue";

interface StatixProps {
  children: string;
  keyPath?: string;
  lang?: string;
}

export const Statix: React.FC<StatixProps> = ({ children, keyPath, lang }) => {
  const { editable, locales, pendingChanges, updateLocalValue } = useStatix();
  const triggerRef = useRef<HTMLSpanElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [show, setShow] = useState<boolean>(false);

  if (!editable) return <>{children}</>;

  const detectedKey = keyPath || children;

  const currentLang = lang || Object.keys(locales)[0] || 'en';

  const handleMouseEnter = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
    setShow(true);
  };

  const handleChange = (
    lang: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
      console.log(e.target.value);
    updateLocalValue(lang, detectedKey, e.target.value);
  };

  const translatedValue =
    getNestedValue(pendingChanges?.[currentLang], detectedKey) ??
    getNestedValue(locales[currentLang], detectedKey);

  return (
    <span
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setShow(false)}
    >
      {translatedValue || children}
      {show && (
        <div
          style={{
            position: "absolute",
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 9999,
          }}
          onMouseLeave={() => setShow(false)}
        >
          <div
            style={{
              padding: "8px",
              margin: "8px",
              minWidth: "200px",
              fontSize: "14px",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <strong style={{ display: "block", marginBottom: "8px" }}>
              {detectedKey}
            </strong>
            {Object.keys(locales).map((lang) => (
              <div key={lang} style={{ marginBottom: "6px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    display: "block",
                    fontSize: "12px",
                  }}
                >
                  {lang.toUpperCase()}
                </label>
                <input
                  type="text"
                  defaultValue={
                    getNestedValue(pendingChanges?.[lang], detectedKey) ??
                    getNestedValue(locales[lang], detectedKey)
                  }
                  onChange={(e) => handleChange(lang, e)}
                  style={{
                    width: "100%",
                    padding: "4px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "13px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </span>
  );
};

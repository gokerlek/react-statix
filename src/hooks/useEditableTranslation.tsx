import React, { ReactNode } from "react";
import { useTranslation as useI18NextTranslation } from "react-i18next";

import { Statix } from "../components/Statix";
import { useStatix } from "../hooks/useStatix";

export const useEditableTranslation = () => {
  const { t, i18n } = useI18NextTranslation();
  const { editable } = useStatix();

  const wrappedT = (key: string, options?: any): ReactNode => {
    const translatedValue = t(key, options);

    // Ensure translatedValue is a valid ReactNode
    const safeValue =
      typeof translatedValue === "string" ||
      typeof translatedValue === "number" ||
      typeof translatedValue === "boolean" ||
      translatedValue === null ||
      translatedValue === undefined ||
      React.isValidElement(translatedValue)
        ? translatedValue
        : String(translatedValue);

    if (!editable) {
      return safeValue;
    }

    // Ensure translatedValue is a string for Statix component
    const stringValue =
      typeof safeValue === "string" ? safeValue : String(safeValue);

    // Edit modunda Statix component’ini döndür
    return <Statix keyPath={key}>{stringValue}</Statix>;
  };

  return {
    t: wrappedT,
    i18n,
  };
};

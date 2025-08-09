import React, { ReactNode } from "react";
import { useTranslation as useI18NextTranslation } from "react-i18next";

import { Statix } from "../components/Statix";
import { useStatix } from "./useStatix";

export const useEditableTranslation = () => {
  const { t, i18n } = useI18NextTranslation();
  const { editable } = useStatix();

  const wrappedT = (key: string, options?: any): ReactNode => {
    // The t function can return string, number, boolean, null, undefined, React elements, or objects
    const translatedValue: string | number | boolean | null | undefined | React.ReactElement | object = t(key, options);

    // Ensure translatedValue is a valid ReactNode
    const safeValue: string | number | boolean | null | undefined | React.ReactElement =
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

    // Convert safeValue to a string for Statix component
    // safeValue can be string | number | boolean | null | undefined | React.ReactElement
    const stringValue = String(safeValue);

    // Return Statix component in edit mode
    return <Statix keyPath={key}>{stringValue}</Statix>;
  };

  return {
    t: wrappedT,
    i18n,
  };
};

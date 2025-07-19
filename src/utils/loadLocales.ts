import { StatixConfig } from "../types";

import { fetchJSON } from "./fetchJSON";

export const loadLocaleFiles = async (
  config: StatixConfig,
): Promise<Record<string, any>> => {
  const locales: Record<string, any> = {};
  const langs = Object.keys(config.languagesKeys || {});

  for (const lang of langs) {
    const filename = `${config.localePath}/${lang}/translation.json`;
    try {
      locales[lang] = await fetchJSON(filename);
    } catch (e) {
      console.warn(`Dil dosyası yüklenemedi: ${filename}`, e);
    }
  }

  return locales;
};

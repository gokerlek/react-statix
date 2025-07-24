export type LanguagesKeys = Record<string, string>;

export interface StatixConfig {
  localePath: string;
  languagesKeys?: LanguagesKeys;
  editable?: boolean;
  onSave?: (changes: Record<string, Record<string, string>>) => void;
}

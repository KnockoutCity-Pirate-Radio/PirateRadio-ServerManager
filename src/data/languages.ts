export const LANGUAGES = [
  { label: 'EN', value: 'en' },
  { label: 'FR', value: 'fr' },
  { label: 'DE', value: 'de' },
  { label: 'ES', value: 'es' },
  { label: 'IT', value: 'it' },
  { label: 'PT', value: 'pt' },
  { label: 'RU', value: 'ru' },
  { label: 'PL', value: 'pl' },
  { label: 'JA', value: 'ja' },
  { label: 'KO', value: 'ko' },
  { label: 'ZH', value: 'zh' },
] as const;

export type Language = (typeof LANGUAGES)[number]['value'];

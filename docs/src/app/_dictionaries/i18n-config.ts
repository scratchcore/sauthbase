import type JapaneseLocale from "./ja";

export const i18n = {
  defaultLocale: "ja",
  locales: ["ja", "en"],
} as const;

export type Locale = (typeof i18n)["locales"][number];

export type Dictionary = typeof JapaneseLocale;

export type Dictionaries = Record<
  Locale,
  () => Promise<{ default: Dictionary }>
>;

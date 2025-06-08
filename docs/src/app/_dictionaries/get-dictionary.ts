import "server-only";
import type { Dictionaries, Dictionary } from "./i18n-config";

const dictionaries: Dictionaries = {
  ja: () => import("./ja"),
  en: () => import("./en") as any,
};

// ユーティリティ関数: ネストされたオブジェクトを再帰的にマージ
function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (
      sourceValue &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue)
    ) {
      target[key] = deepMerge(
        (targetValue ?? {}) as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as any;
    } else if (sourceValue !== undefined) {
      target[key] = sourceValue;
    }
  }
  return target;
}

export async function getDictionary(locale: string): Promise<Dictionary> {
  const { default: defaultDict } = await dictionaries.ja();
  if (locale === "ja" || !dictionaries[locale]) return defaultDict;

  const { default: overrideDict } = await dictionaries[locale]();
  return deepMerge({ ...defaultDict }, overrideDict);
}

export function getDirection(locale: string): "ltr" | "rtl" {
  return locale === "es" ? "rtl" : "ltr";
}

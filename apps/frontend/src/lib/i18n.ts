import { getLocale, setLocale, type Locale } from "@/paraglide/runtime";
import type { AppLanguage } from "@/types/ui";

export const appLanguages: readonly AppLanguage[] = ["en", "es"];

export const isAppLanguage = (value: string): value is AppLanguage =>
  appLanguages.includes(value as AppLanguage);

export const getCurrentAppLanguage = (): AppLanguage => {
  const locale = getLocale();

  return isAppLanguage(locale) ? locale : "en";
};

export const setAppLanguage = (language: AppLanguage): void => {
  setLocale(language as Locale, { reload: false });
  document.documentElement.lang = language;
};

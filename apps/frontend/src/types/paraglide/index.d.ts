declare module "@/paraglide/messages" {
  type MessageVariables = Record<string, string | number | boolean | null | undefined>;
  type MessageFunction = (variables?: MessageVariables) => string;

  export const m: Record<string, MessageFunction>;
}

declare module "@/paraglide/runtime" {
  export type Locale = "en" | "es";
  export const baseLocale: Locale;
  export const locales: readonly Locale[];
  export function getLocale(): Locale;
  export function setLocale(locale: Locale, options?: { reload?: boolean }): void | Promise<void>;
}

import { Fragment, type ReactNode } from "react";
import { setAppLanguage } from "@/lib/i18n";
import { useUiStore, uiSelectors } from "@/store";

type I18nProviderProps = {
  children: ReactNode;
};

export function I18nProvider({ children }: I18nProviderProps) {
  const currentLanguage = useUiStore(uiSelectors.currentLanguage);

  setAppLanguage(currentLanguage);

  return <Fragment key={currentLanguage}>{children}</Fragment>;
}

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import it from "@/content/home.it.json";
import en from "@/content/home.en.json";

export type Locale = "it" | "en";
export type Copy = typeof it;

const dictionaries: Record<Locale, Copy> = { it, en };
const STORAGE_KEY = "anubi-study-locale";

type LocaleState = { locale: Locale; t: Copy; setLocale: (l: Locale) => void };

const LocaleContext = createContext<LocaleState>({ locale: "it", t: it, setLocale: () => {} });

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("it");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "it" || saved === "en") setLocaleState(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {}
  };

  return (
    <LocaleContext.Provider value={{ locale, t: dictionaries[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export const useLocale = () => useContext(LocaleContext);
export const useT = () => useContext(LocaleContext).t;

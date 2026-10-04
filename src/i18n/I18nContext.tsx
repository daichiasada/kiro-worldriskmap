import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { MESSAGES, type Lang, type Messages } from './messages';
import type { Country, ScoredCountry } from '../domain/types';

const STORAGE_KEY = 'wgrm-lang';

function initialLang(): Lang {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'ja') return saved;
  }
  return 'en'; // 既定は英語(米国の閲覧者を想定)
}

interface I18nValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Messages;
  /** 選択言語に応じた国名を返す */
  countryName: (c: Country | ScoredCountry) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({
      lang,
      setLang: setLangState,
      t: MESSAGES[lang],
      countryName: (c) => (lang === 'ja' ? c.nameJa : c.name),
    }),
    [lang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

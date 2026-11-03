import { useEffect, useState } from 'react';
import { catalogs, type Locale } from '../localization/catalogs';

const STORAGE_KEY = 'ulpan-dictionary-language';

const readLanguage = (): Locale => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'ru' || stored === 'es') return stored;
  } catch {
    // Browser language remains available when storage is blocked.
  }
  const preferred = navigator.languages?.[0] || navigator.language;
  return /^es(?:-|$)/i.test(preferred) ? 'es' : 'ru';
};

export const useLanguagePreference = () => {
  const [locale, setLocale] = useState<Locale>(readLanguage);
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = catalogs[locale].pageTitle;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Language switching still works without persistent storage.
    }
  }, [locale]);
  return { locale, setLocale };
};

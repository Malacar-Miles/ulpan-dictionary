import { createContext, useContext } from 'react';
import { catalogs, type Locale } from './catalogs';

export const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
} | null>(null);

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale requires a LocaleProvider');
  return { ...context, messages: catalogs[context.locale] };
};

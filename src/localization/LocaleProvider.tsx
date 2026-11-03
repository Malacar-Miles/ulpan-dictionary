import type { ReactNode } from 'react';
import { useLanguagePreference } from '../hooks/useLanguagePreference';
import { LocaleContext } from './context';

export const LocaleProvider = ({ children }: { children: ReactNode }) => {
  const preference = useLanguagePreference();
  return <LocaleContext.Provider value={preference}>{children}</LocaleContext.Provider>;
};

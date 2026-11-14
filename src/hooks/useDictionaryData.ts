import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { dictionaryRepository } from '../helpers/dictionaryLoader';
import type { Locale } from '../localization/catalogs';

export const useDictionaryData = (locale: Locale) => {
  const getSnapshot = useCallback(() => dictionaryRepository.getSnapshot(locale), [locale]);
  const snapshot = useSyncExternalStore(dictionaryRepository.subscribe, getSnapshot);
  useEffect(() => {
    void dictionaryRepository.load(locale);
  }, [locale]);
  return {
    snapshot,
    retry: () => {
      void dictionaryRepository.load(locale);
    },
  };
};

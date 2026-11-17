import { useEffect, useState } from 'react';
const STORAGE_KEY = 'ulpan-dictionary-show-translation';
const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const useTranslationPreference = () => {
  const [showTranslation, setShowTranslation] = useState(readPreference);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(showTranslation));
    } catch {
      /* The preference also works when storage is unavailable. */
    }
  }, [showTranslation]);

  return { showTranslation, setShowTranslation };
};

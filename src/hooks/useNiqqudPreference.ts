import { useEffect, useState } from 'react';
const STORAGE_KEY = 'ulpan-dictionary-show-niqqud';
const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    return true;
  }
};

export const useNiqqudPreference = () => {
  const [showNiqqud, setShowNiqqud] = useState(readPreference);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(showNiqqud));
    } catch {
      /* The preference also works when storage is unavailable. */
    }
  }, [showNiqqud]);

  return { showNiqqud, setShowNiqqud };
};

import { useEffect, useState, type ChangeEvent } from 'react';

const STORAGE_KEY = 'ulpan-dictionary-handwriting';

const readPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const useHandwritingPreference = () => {
  const [handwriting, setHandwriting] = useState(readPreference);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(handwriting));
    } catch {
      // The toggle remains usable when storage is unavailable.
    }
  }, [handwriting]);

  const changeHandwriting = (event: ChangeEvent<HTMLInputElement>) =>
    setHandwriting(event.target.checked);

  return { handwriting, changeHandwriting };
};

import { useId, useRef, useState } from 'react';
import { useLocale } from '../localization/context';
import type { Locale } from '../localization/catalogs';

export const useLanguageMenu = () => {
  const { setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggle = () => setIsOpen((open) => !open);
  const close = () => {
    // Return keyboard focus before hiding the panel, but preserve search focus on iPhone.
    if (panelRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
    setIsOpen(false);
  };
  const selectLanguage = (locale: Locale) => {
    setLocale(locale);
    close();
  };

  return { isOpen, panelId, buttonRef, panelRef, toggle, close, selectLanguage };
};

import { useEffect, useId, useRef, useState } from 'react';
import { useLocale } from '../localization/context';
import type { Locale } from '../localization/catalogs';

export const useLanguageMenu = () => {
  const { setLocale } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const cancelScheduledClose = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = undefined;
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  const toggle = () => {
    cancelScheduledClose();
    setIsOpen((open) => !open);
  };
  const close = () => {
    cancelScheduledClose();
    // Return keyboard focus before hiding the panel, but preserve search focus on iPhone.
    if (panelRef.current?.contains(document.activeElement)) buttonRef.current?.focus();
    setIsOpen(false);
  };
  const selectLanguage = (locale: Locale) => {
    setLocale(locale);
    cancelScheduledClose();
    closeTimer.current = setTimeout(close, 500);
  };

  return { isOpen, panelId, buttonRef, panelRef, toggle, close, selectLanguage };
};

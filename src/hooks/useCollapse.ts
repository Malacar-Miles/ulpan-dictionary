import { useId, useRef, useState } from 'react';
export const useCollapse = () => {
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
  return { isOpen, panelId, buttonRef, panelRef, toggle, close };
};

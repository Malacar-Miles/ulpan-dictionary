import { useRef, type PointerEvent } from 'react';

export const useSearchClear = (onClear: () => void) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const preserveInputFocus = (event: PointerEvent<HTMLButtonElement>) => event.preventDefault();
  const clear = () => {
    onClear();
    inputRef.current?.focus({ preventScroll: true });
  };
  return { inputRef, preserveInputFocus, clear };
};

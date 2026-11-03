import { useLayoutEffect, useRef } from 'react';

export const useSearchHintWidth = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const hint = hintRef.current;
    if (!wrapper || !hint) return;
    const updateWidth = () => {
      const width = hint.getBoundingClientRect().width;
      wrapper.style.setProperty('--search-hint-space', `${width ? width + 14 : 0}px`);
    };
    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(hint);
    return () => observer.disconnect();
  }, []);

  return { wrapperRef, hintRef };
};

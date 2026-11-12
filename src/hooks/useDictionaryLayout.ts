import { useLayoutEffect, useRef, type PointerEvent } from 'react';
import { useSearchViewport } from '../useSearchViewport';

const preserveSearchFocus = (event: PointerEvent<HTMLDivElement>) => {
  // Keep search focused while changing controls on touch screens so the layout does
  // not move between pointer down and click events.
  if (
    event.pointerType === 'touch' &&
    document.activeElement?.id === 'search' &&
    event.target instanceof Element &&
    event.target.closest('button, .niqqud-toggle, .handwriting-toggle')
  )
    event.preventDefault();
};

export const useDictionaryLayout = (query: string, activeTopic: string | null) => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useSearchViewport();

  useLayoutEffect(() => {
    const controls = controlsRef.current;
    const content = scrollRef.current;
    if (!controls || !content) return;
    const updateHeight = () =>
      content.style.setProperty(
        '--controls-height',
        `${controls.getBoundingClientRect().height}px`,
      );
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(controls);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    // Return to the first result without revealing a header the reader has scrolled past.
    const headerHeight = scroller.querySelector('header')!.offsetHeight;
    if (scroller.scrollTop > headerHeight)
      scroller.scrollTo({ top: headerHeight, behavior: 'instant' });
  }, [query, activeTopic]);

  return { controlsRef, scrollRef, preserveSearchFocus };
};

import { useLayoutEffect, useRef, type PointerEvent } from 'react';
import { useSearchViewport } from '../useSearchViewport';

const preserveSearchFocus = (event: PointerEvent<HTMLDivElement>) => {
  // Keep search focused while changing controls on iPhone so the layout does
  // not move between pointer down and click events.
  if (
    document.documentElement.classList.contains('search-editing') &&
    document.activeElement?.id === 'search' &&
    event.target instanceof Element &&
    event.target.closest('button, .niqqud-toggle, .handwriting-toggle')
  )
    event.preventDefault();
};

export const useDictionaryLayout = (query: string, activeTopic: string) => {
  const controlsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  const { startEditing, stopEditing } = useSearchViewport(controlsRef, contentRef);

  useLayoutEffect(() => {
    const controls = controlsRef.current;
    const content = contentRef.current;
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
    contentRef.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [query, activeTopic]);

  return { controlsRef, contentRef, startEditing, stopEditing, preserveSearchFocus };
};

import { createTouchScrollHandlers } from './helpers/touchScroll';
import { useLayoutEffect, useState, type RefObject } from 'react';

/** Keep iPhone search controls outside the results scroller while focused. */
export const useSearchViewport = (
  controlsRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) => {
  const [editing, setEditing] = useState(false);

  useLayoutEffect(() => {
    if (!editing) return;
    const controls = controlsRef.current;
    const content = contentRef.current;
    if (!controls || !content) return;

    const root = document.documentElement;
    const viewport = window.visualViewport;
    const originalScroll = window.scrollY;
    const contentTop = content.getBoundingClientRect().top + originalScroll;
    const controlsHeight = controls.getBoundingClientRect().height;
    const initialListScroll = Math.max(0, originalScroll + controlsHeight - contentTop);

    // Only resize the container. Never compensate for offsetTop on scroll.
    const updateHeight = () => {
      if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
      root.style.setProperty(
        '--search-viewport-height',
        `${viewport?.height ?? window.innerHeight}px`,
      );
    };
    updateHeight();
    root.classList.add('search-editing');
    content.scrollTop = initialListScroll;

    const { onTouchStart, onTouchMove } = createTouchScrollHandlers(viewport);

    viewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      const listScroll = content.scrollTop;
      viewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      root.classList.remove('search-editing');
      root.style.removeProperty('--search-viewport-height');
      content.scrollTop = 0;
      // Restore the visible result position, or the original page position if
      // the user did not move the list (e.g. focused search from the introduction).
      const targetScroll =
        Math.abs(listScroll - initialListScroll) < 1
          ? originalScroll
          : Math.max(0, contentTop - controls.getBoundingClientRect().height + listScroll);
      window.scrollTo({ top: targetScroll, behavior: 'instant' });
    };
  }, [editing, controlsRef, contentRef]);

  return {
    editing,
    startEditing: () => {
      if (/iPhone/i.test(navigator.userAgent)) setEditing(true);
    },
    stopEditing: () => setEditing(false),
  };
};

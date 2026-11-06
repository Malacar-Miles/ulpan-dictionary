import { createTouchScrollHandlers } from './helpers/touchScroll';
import { useLayoutEffect, useState } from 'react';

/** Keep a stable iPhone shell through keyboard opening and closing. */
export const useSearchViewport = () => {
  const [editing, setEditing] = useState(false);

  useLayoutEffect(() => {
    if (!/iPhone/i.test(navigator.userAgent)) return;
    const root = document.documentElement;
    const viewport = window.visualViewport;

    // Only resize the container. Never compensate for offsetTop on scroll.
    const updateHeight = () => {
      if (viewport && Math.abs(viewport.scale - 1) > 0.01) return;
      root.style.setProperty(
        '--search-viewport-height',
        `${viewport?.height ?? window.innerHeight}px`,
      );
    };
    updateHeight();
    root.classList.add('iphone-layout');

    const { onTouchStart, onTouchMove } = createTouchScrollHandlers(viewport);

    viewport?.addEventListener('resize', updateHeight);
    window.addEventListener('resize', updateHeight);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      viewport?.removeEventListener('resize', updateHeight);
      window.removeEventListener('resize', updateHeight);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchmove', onTouchMove);
      root.classList.remove('iphone-layout');
      root.style.removeProperty('--search-viewport-height');
    };
  }, []);

  return {
    editing,
    startEditing: () => {
      if (/iPhone/i.test(navigator.userAgent)) setEditing(true);
    },
    stopEditing: () => setEditing(false),
  };
};

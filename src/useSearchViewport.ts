import { createTouchScrollHandlers } from './helpers/touchScroll';
import { useLayoutEffect } from 'react';

export const useSearchViewport = () => {
  useLayoutEffect(() => {
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
      root.style.removeProperty('--search-viewport-height');
    };
  }, []);
};

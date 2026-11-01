import { useLayoutEffect, useState, type RefObject } from 'react';

/** Keep iPhone search controls outside the results scroller while focused. */
export function useSearchViewport(
  controlsRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLElement | null>,
) {
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
      root.style.setProperty('--search-viewport-height', `${viewport?.height ?? window.innerHeight}px`);
    };
    updateHeight();
    root.classList.add('search-editing');
    content.scrollTop = initialListScroll;

    // iOS may still pan the document at the edges of a nested scroller.
    // Allow native scrolling only where a nested element can consume the gesture.
    let lastX = 0;
    let lastY = 0;
    const onTouchStart = (event: TouchEvent) => {
      lastX = event.touches[0]?.clientX ?? 0;
      lastY = event.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1 || (viewport && viewport.scale !== 1)) return;
      const touch = event.touches[0];
      const dx = lastX - touch.clientX;
      const dy = lastY - touch.clientY;
      lastX = touch.clientX;
      lastY = touch.clientY;
      // Preserve text selection and native editing gestures in the search field.
      if (event.target instanceof HTMLInputElement) return;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const delta = horizontal ? dx : dy;
      let element = event.target instanceof Element ? event.target : null;
      while (element && element !== document.body) {
        const style = getComputedStyle(element);
        const overflow = horizontal ? style.overflowX : style.overflowY;
        const position = horizontal ? element.scrollLeft : element.scrollTop;
        const maximum = horizontal
          ? element.scrollWidth - element.clientWidth
          : element.scrollHeight - element.clientHeight;
        if (/auto|scroll/.test(overflow) && maximum > 0 &&
            ((delta > 0 && position < maximum - 1) || (delta < 0 && position > 0))) return;
        element = element.parentElement;
      }
      if (event.cancelable) event.preventDefault();
    };
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
      const targetScroll = Math.abs(listScroll - initialListScroll) < 1
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
}

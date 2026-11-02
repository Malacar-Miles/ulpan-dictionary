/** Allow native gestures only when a nested scroller can consume them. */
export const createTouchScrollHandlers = (viewport: VisualViewport | null) => {
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
      if (
        /auto|scroll/.test(overflow) &&
        maximum > 0 &&
        ((delta > 0 && position < maximum - 1) || (delta < 0 && position > 0))
      )
        return;
      element = element.parentElement;
    }
    if (event.cancelable) event.preventDefault();
  };
  return { onTouchStart, onTouchMove };
};

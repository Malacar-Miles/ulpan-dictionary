// @vitest-environment jsdom
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useSearchViewport } from '../src/useSearchViewport';

const ViewportHarness = () => {
  const controls = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLElement>(null);
  const { startEditing, stopEditing } = useSearchViewport();
  return (
    <>
      <div ref={controls}>
        <input aria-label="Search" onFocus={startEditing} onBlur={stopEditing} />
      </div>
      <main ref={content} />
    </>
  );
};

beforeEach(() => {
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('search viewport lifecycle', () => {
  it('leaves the document layout alone on other devices', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Desktop');
    render(<ViewportHarness />);
    fireEvent.focus(screen.getByRole('textbox'));
    expect(document.documentElement.classList.contains('iphone-layout')).toBe(false);
  });

  it('keeps the iPhone shell and resize tracking through focus and blur', () => {
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('iPhone');
    const viewport = Object.assign(new EventTarget(), { height: 400, scale: 1 });
    vi.stubGlobal('visualViewport', viewport);
    render(<ViewportHarness />);
    expect(document.documentElement.classList.contains('iphone-layout')).toBe(true);
    fireEvent.focus(screen.getByRole('textbox'));
    const root = document.documentElement;
    expect(root.classList.contains('iphone-layout')).toBe(true);
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('400px');
    viewport.height = 300;
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    viewport.scale = 2;
    viewport.height = 200;
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    fireEvent.blur(screen.getByRole('textbox'));
    expect(root.classList.contains('iphone-layout')).toBe(true);
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    expect(window.scrollTo).not.toHaveBeenCalled();
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
  });
});

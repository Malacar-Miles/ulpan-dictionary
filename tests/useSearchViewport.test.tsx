// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useSearchViewport } from '../src/useSearchViewport';

const ViewportHarness = () => {
  useSearchViewport(true);
  return <input aria-label="Search" />;
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
  it('tracks the touch viewport through focus, blur and keyboard resizing', () => {
    const viewport = Object.assign(new EventTarget(), { height: 400, scale: 1 });
    vi.stubGlobal('visualViewport', viewport);
    const { unmount } = render(<ViewportHarness />);
    fireEvent.focus(screen.getByRole('textbox'));
    const root = document.documentElement;
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('400px');
    viewport.height = 300;
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    viewport.scale = 2;
    viewport.height = 200;
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    fireEvent.blur(screen.getByRole('textbox'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    expect(window.scrollTo).not.toHaveBeenCalled();
    viewport.dispatchEvent(new Event('resize'));
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('300px');
    unmount();
    expect(root.style.getPropertyValue('--search-viewport-height')).toBe('');
  });
});

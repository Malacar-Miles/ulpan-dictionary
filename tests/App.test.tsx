// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { App } from '../src/App';
import dictionary from '../src/dictionary.json';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('dictionary interface', () => {
  it('renders every entry, filters topics, searches, and resets empty results', () => {
    const { container } = render(<App />);
    const total = dictionary.sections.reduce((sum, section) => sum + section.entries.length, 0);
    expect(container.querySelectorAll('.card')).toHaveLength(total);
    const section = dictionary.sections[0];
    fireEvent.click(screen.getByRole('button', { name: section.title }));
    expect(container.querySelectorAll('.card')).toHaveLength(section.entries.length);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(section.title);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzznotaword' } });
    expect(screen.getByText('Ничего не нашлось')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить поиск и фильтр' }));
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
    expect(container.querySelectorAll('.card')).toHaveLength(total);
    expect(screen.getByRole('button', { name: 'Все темы' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('restores and persists the niqqud preference', () => {
    localStorage.setItem('ulpan-dictionary-show-niqqud', 'false');
    const { container } = render(<App />);
    const toggle = screen.getByRole('checkbox') as HTMLInputElement;
    expect(toggle.checked).toBe(false);
    expect(container.querySelector('.hebrew')?.textContent).toBe(
      dictionary.sections[0].entries[0].hebrew,
    );
    fireEvent.click(toggle);
    expect(localStorage.getItem('ulpan-dictionary-show-niqqud')).toBe('true');
    const entry = dictionary.sections[0].entries[0];
    expect(container.querySelector('.hebrew')?.textContent).toBe(
      entry.hebrewWithNiqqud ?? entry.hebrew,
    );
  });

  it('continues to work when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    render(<App />);
    const toggle = screen.getByRole('checkbox') as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
  });
});

// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { TranslationBlur } from '../src/components/TranslationBlur';
import { LocaleContext } from '../src/localization/context';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

it('reveals cells independently for five seconds and clears timers on unmount', () => {
  vi.useFakeTimers();
  const onCardClick = vi.fn();
  const view = render(
    <LocaleContext value={{ locale: 'ru', setLocale: vi.fn() }}>
      <div onClick={onCardClick}>
        <TranslationBlur>First meaning</TranslationBlur>
        <TranslationBlur>Second meaning</TranslationBlur>
      </div>
    </LocaleContext>,
  );
  const [first, second] = screen.getAllByRole('button');
  expect(vi.getTimerCount()).toBe(0);
  fireEvent.click(first);
  expect(onCardClick).not.toHaveBeenCalled();
  expect(first.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByText('First meaning').getAttribute('aria-hidden')).toBe('false');
  expect(second.getAttribute('aria-expanded')).toBe('false');
  act(() => vi.advanceTimersByTime(3000));
  fireEvent.click(second);
  act(() => vi.advanceTimersByTime(1999));
  expect(first.getAttribute('aria-expanded')).toBe('true');
  act(() => vi.advanceTimersByTime(1));
  expect(first.getAttribute('aria-expanded')).toBe('false');
  expect(second.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByText('First meaning').getAttribute('aria-hidden')).toBe('true');
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

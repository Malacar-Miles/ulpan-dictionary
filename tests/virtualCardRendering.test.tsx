// @vitest-environment jsdom
import { afterEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { VirtualDictionarySections } from '../src/components/VirtualDictionarySections';
import { localizeSections } from '../src/helpers/dictionary';
import * as highlighting from '../src/helpers/highlight';
import { LocaleContext } from '../src/localization/context';

const layout = vi.hoisted(() => ({ offset: 0, height: 500 }));
vi.mock('@tanstack/react-virtual', () => {
  const virtualizer = {
    measureElement: () => {},
    getTotalSize: () => layout.height,
    getVirtualItems: () => [
      { key: 'heading', index: 0, start: 0 },
      { key: 'cards', index: 1, start: layout.offset },
    ],
  };
  return {
    useVirtualizer: () => virtualizer,
    useWindowVirtualizer: () => virtualizer,
  };
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('updates virtual positioning without rerendering cards, while content and local state still update', () => {
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      disconnect = vi.fn();
    },
  );
  const highlightCalls = vi.spyOn(highlighting, 'getHighlightSegments');
  const section = localizeSections('ru').find((section) => section.id === 'verbs')!;
  const sections = [{ ...section, entries: section.entries.slice(0, 3) }];
  const locale = { locale: 'ru' as const, setLocale: vi.fn() };
  const view = (query = '', showNiqqud = true) => (
    <LocaleContext.Provider value={locale}>
      <div className="dictionary-scroll">
        <main>
          <VirtualDictionarySections sections={sections} query={query} showNiqqud={showNiqqud} />
        </main>
      </div>
    </LocaleContext.Provider>
  );
  const { container, rerender } = render(view());
  highlightCalls.mockClear();
  layout.offset = 80;
  layout.height = 600;
  rerender(view());
  expect(container.querySelector('[data-index="1"]')?.getAttribute('style')).toContain('80px');
  expect(highlightCalls).not.toHaveBeenCalled();

  fireEvent.click(screen.getByRole('button', { name: 'Формы слова ללמוד' }));
  expect(highlightCalls).toHaveBeenCalled();
  highlightCalls.mockClear();
  // Resize measurements change repeatedly during the CSS height transition.
  for (let frame = 1; frame <= 5; frame++) {
    layout.offset += 10;
    layout.height += 10;
    rerender(view());
  }
  expect(highlightCalls).not.toHaveBeenCalled();

  rerender(view('לומדת', false));
  expect(highlightCalls).toHaveBeenCalled();
  expect(container.querySelector('mark')?.textContent).toBe('לומדת');
  expect(
    screen.getByRole('button', { name: 'Формы слова ללמוד' }).getAttribute('aria-expanded'),
  ).toBe('true');
  expect(container.querySelector('.hebrew')?.textContent).toBe('ללמוד');
});

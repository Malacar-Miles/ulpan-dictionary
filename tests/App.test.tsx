// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { App } from '../src/App';
import dictionary from '../src/dictionary.json';
import { formatUpdatedDate } from '../src/helpers/dictionary';

beforeEach(() => {
  localStorage.clear();
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru']);
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
    fireEvent.click(screen.getByRole('button', { name: section.translations.ru.title }));
    expect(container.querySelectorAll('.card')).toHaveLength(section.entries.length);
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe(
      section.translations.ru.title,
    );
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzzznotaword' } });
    expect(
      screen.getByRole('heading', { name: 'Ничего не нашлось, но включен фильтр' }),
    ).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить фильтр' }));
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('zzzznotaword');
    expect(screen.getByRole('heading', { name: 'Ничего не нашлось' })).toBeTruthy();
    expect(screen.queryByText('но включен фильтр')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Сбросить поиск' }));
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('');
    expect(container.querySelectorAll('.card')).toHaveLength(total);
    expect(screen.getByRole('button', { name: 'Все темы' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
  });

  it('restores and persists the niqqud preference', () => {
    localStorage.setItem('ulpan-dictionary-show-niqqud', 'false');
    const { container } = render(<App />);
    const toggle = screen.getByRole('checkbox', { name: 'Никкуд' }) as HTMLInputElement;
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

  it('toggles handwriting independently, preserves text and search, and restores the preference', () => {
    const { container, unmount } = render(<App />);
    const toggle = screen.getByRole('checkbox', { name: 'Пропись' }) as HTMLInputElement;
    const niqqud = screen.getByRole('checkbox', { name: 'Никкуд' }) as HTMLInputElement;
    const text = container.querySelector('.hebrew')?.textContent;
    expect(toggle.checked).toBe(false);
    fireEvent.click(toggle);
    expect(container.querySelector('main')?.classList.contains('handwritten')).toBe(true);
    expect(container.querySelector('.hebrew')?.textContent).toBe(text);
    expect(niqqud.checked).toBe(true);
    expect(localStorage.getItem('ulpan-dictionary-handwriting')).toBe('true');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'תודה' } });
    expect(container.querySelector('.hebrew mark')?.textContent).toBe('תּוֹדָה');
    fireEvent.click(niqqud);
    expect(container.querySelector('.hebrew')?.textContent).toBe('תודה');
    expect(toggle.checked).toBe(true);
    unmount();
    const restored = render(<App />);
    const restoredToggle = screen.getByRole('checkbox', {
      name: 'Пропись',
    }) as HTMLInputElement;
    expect(restoredToggle.checked).toBe(true);
    expect(restored.container.querySelector('main')?.classList.contains('handwritten')).toBe(true);
    fireEvent.click(restoredToggle);
    expect(localStorage.getItem('ulpan-dictionary-handwriting')).toBe('false');
    expect(restored.container.querySelector('main')?.classList.contains('handwritten')).toBe(false);
  });

  it('continues to work when storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    render(<App />);
    const toggle = screen.getByRole('checkbox', { name: 'Никкуд' }) as HTMLInputElement;
    expect(toggle.checked).toBe(true);
    fireEvent.click(toggle);
    expect(toggle.checked).toBe(false);
    const handwriting = screen.getByRole('checkbox', {
      name: 'Пропись',
    }) as HTMLInputElement;
    expect(handwriting.checked).toBe(false);
    fireEvent.click(handwriting);
    expect(handwriting.checked).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Язык интерфейса' }));
    fireEvent.click(screen.getByRole('button', { name: 'Español' }));
    expect(document.documentElement.lang).toBe('es');
    expect(screen.getByRole('checkbox', { name: 'Manuscrita' })).toBeTruthy();
  });
});

describe('localization', () => {
  it('switches language without losing the topic, query, or display preferences', () => {
    const { container, unmount } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Глаголы и состояния' }));
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'הולך' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Никкуд' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Пропись' }));
    fireEvent.click(screen.getByRole('button', { name: 'Язык интерфейса' }));
    fireEvent.click(screen.getByRole('button', { name: 'Español' }));
    expect(document.documentElement.lang).toBe('es');
    expect(document.title).toBe('Diccionario del ulpán');
    expect(
      screen.getByRole('button', { name: 'Verbos y estados' }).getAttribute('aria-pressed'),
    ).toBe('true');
    expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('הולך');
    expect((screen.getByRole('checkbox', { name: 'Niqqud' }) as HTMLInputElement).checked).toBe(
      false,
    );
    expect(container.querySelector('main')?.classList.contains('handwritten')).toBe(true);
    expect(container.querySelectorAll('.card')).toHaveLength(1);
    expect(container.querySelector('.pronunciation')?.textContent).toBe(
      'holéch / holéchet / holchím / holchót',
    );
    expect(container.querySelector('.meaning')?.textContent).toBe('va, camina');
    expect(container.querySelector('.filters-search-active button.active')?.textContent).toBe(
      'Verbos y estados',
    );
    const total = dictionary.sections.reduce((sum, section) => sum + section.entries.length, 0);
    expect(container.querySelector('.filters-head')?.textContent).toContain(
      `${total} entradas · Act. ${formatUpdatedDate(dictionary.updatedAt, 'es')}`,
    );
    expect(container.querySelector('main')?.textContent).not.toMatch(/[а-яё]/i);
    expect(localStorage.getItem('ulpan-dictionary-language')).toBe('es');
    unmount();
    render(<App />);
    expect(document.documentElement.lang).toBe('es');
    fireEvent.click(screen.getByRole('button', { name: 'Idioma de la interfaz' }));
    fireEvent.click(screen.getByRole('button', { name: 'Русский' }));
    expect(document.title).toBe('Словарь ульпана');
    expect(localStorage.getItem('ulpan-dictionary-language')).toBe('ru');
  });

  it('uses Spanish for a Spanish browser and lets a saved language override it', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['es-MX', 'en']);
    localStorage.setItem('ulpan-dictionary-language', 'invalid');
    const { unmount } = render(<App />);
    expect(screen.getByRole('searchbox').getAttribute('placeholder')).toBe(
      'Buscar en español o hebreo',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Idioma de la interfaz' }));
    fireEvent.click(screen.getByRole('button', { name: 'Русский' }));
    unmount();
    render(<App />);
    expect(document.documentElement.lang).toBe('ru');
  });

  it('falls back to Russian for other browser languages', () => {
    vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['en-US', 'es']);
    render(<App />);
    expect(document.documentElement.lang).toBe('ru');
  });

  it('searches Spanish text and phonetics with matching highlights', () => {
    localStorage.setItem('ulpan-dictionary-language', 'es');
    const { container } = render(<App />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cancion' } });
    expect(container.querySelectorAll('.card')).toHaveLength(1);
    expect(container.querySelector('.meaning mark')?.textContent).toBe('canción');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'holech' } });
    expect(container.querySelector('.pronunciation mark')?.textContent).toBe('holéch');
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'спасибо' } });
    expect(screen.getByText('No se encontraron resultados')).toBeTruthy();
    fireEvent.click(
      within(container.querySelector('.empty') as HTMLElement).getByRole('button', {
        name: 'Borrar búsqueda',
      }),
    );
    expect(container.querySelectorAll('.card')).toHaveLength(
      dictionary.sections.reduce((sum, section) => sum + section.entries.length, 0),
    );
  });
});

it('starts closing immediately after language selection, a globe click, or Escape', () => {
  render(<App />);
  const globe = screen.getByRole('button', { name: 'Язык интерфейса' });
  expect(globe.getAttribute('aria-expanded')).toBe('false');
  expect(screen.queryByRole('button', { name: 'Español' })).toBeNull();
  fireEvent.click(globe);
  expect(globe.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('button', { name: 'Español' })).toBeTruthy();
  fireEvent.click(globe);
  expect(screen.queryByRole('button', { name: 'Español' })).toBeNull();
  fireEvent.click(globe);
  const spanish = screen.getByRole('button', { name: 'Español' });
  spanish.focus();
  fireEvent.click(spanish);
  expect(document.documentElement.lang).toBe('es');
  expect(globe.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(globe);
  fireEvent.click(globe);
  const selectedLanguage = screen.getByRole('button', { name: 'Español' });
  selectedLanguage.focus();
  fireEvent.keyDown(selectedLanguage, { key: 'Escape' });
  expect(globe.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(globe);
  fireEvent.click(globe);
  fireEvent.click(screen.getByRole('button', { name: 'Español' }));
  expect(globe.getAttribute('aria-expanded')).toBe('false');
  fireEvent.click(globe);
  expect(globe.getAttribute('aria-expanded')).toBe('true');
});

it('clears only the query and returns focus to the search field', () => {
  render(<App />);
  expect(screen.queryByRole('button', { name: 'Очистить поиск' })).toBeNull();
  const topic = dictionary.sections[0].translations.ru.title;
  fireEvent.click(screen.getByRole('button', { name: topic }));
  const input = screen.getByRole('searchbox') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'תודה' } });
  const clear = screen.getByRole('button', { name: 'Очистить поиск' });
  clear.focus();
  fireEvent.click(clear);
  expect(input.value).toBe('');
  expect(document.activeElement).toBe(input);
  expect(screen.getByRole('button', { name: topic }).getAttribute('aria-pressed')).toBe('true');
  expect(screen.queryByRole('button', { name: 'Очистить поиск' })).toBeNull();
});

it('removes the Spanish topic filter while retaining a query that matches another topic', () => {
  localStorage.setItem('ulpan-dictionary-language', 'es');
  const { container } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Saludos y comunicación' }));
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'cancion' } });
  expect(screen.getByText('pero hay un filtro activo')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Quitar filtro' }));
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('cancion');
  expect(screen.getByRole('button', { name: 'Todos los temas' }).getAttribute('aria-pressed')).toBe(
    'true',
  );
  expect(container.querySelector('.meaning mark')?.textContent).toBe('canción');
  expect(container.querySelector('.empty')).toBeNull();
});

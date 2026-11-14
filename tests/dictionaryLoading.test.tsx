// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { App } from '../src/App';
import core from '../src/data/dictionary.core.json';
import ru from '../src/data/dictionary.ru.json';
import es from '../src/data/dictionary.es.json';
import { createDictionaryRepository, dictionaryRepository } from '../src/helpers/dictionaryLoader';

const deferred = () => {
  let resolve!: (value: unknown) => void;
  let reject!: (reason: Error) => void;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};
let requests: { url: string; response: ReturnType<typeof deferred> }[];
let repository: ReturnType<typeof createDictionaryRepository>;
const respond = async (index: number, data: unknown, ok = true) => {
  await act(async () => {
    requests[index].response.resolve({ ok, status: ok ? 200 : 503, json: async () => data });
  });
};
beforeEach(() => {
  localStorage.clear();
  repository = createDictionaryRepository();
  vi.spyOn(dictionaryRepository, 'getSnapshot').mockImplementation(repository.getSnapshot);
  vi.spyOn(dictionaryRepository, 'subscribe').mockImplementation(repository.subscribe);
  vi.spyOn(dictionaryRepository, 'load').mockImplementation(repository.load);
  requests = [];
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      const response = deferred();
      requests.push({ url, response });
      return response.promise;
    }),
  );
  vi.stubGlobal('matchMedia', () => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
  vi.spyOn(navigator, 'languages', 'get').mockReturnValue(['ru']);
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    },
  );
  vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(768);
  vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(160);
  vi.stubGlobal('scrollTo', vi.fn());
  HTMLElement.prototype.scrollTo = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

it('loads only core and the selected locale after mount, disables controls until both finish, and caches switches', async () => {
  expect(requests).toHaveLength(0);
  const { container } = render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  expect(requests.map((r) => r.url)).toEqual([
    expect.stringContaining('.core.json'),
    expect.stringContaining('.ru.json'),
  ]);
  expect(screen.getByRole('status').textContent).toBe('Загрузка словаря…');
  expect(container.querySelector('.card')).toBeNull();
  expect(container.querySelector('header')?.hasAttribute('inert')).toBe(true);
  for (const control of container.querySelectorAll('button, input'))
    expect(control.matches(':disabled')).toBe(true);
  await respond(1, ru);
  expect(screen.getByRole('status')).toBeTruthy();
  await respond(0, core);
  expect(container.querySelector('.card')).toBeTruthy();
  expect(screen.getByRole('searchbox').matches(':disabled')).toBe(false);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'תודה' } });
  fireEvent.click(screen.getByRole('button', { name: 'Язык интерфейса' }));
  fireEvent.click(screen.getByRole('button', { name: 'Español' }));
  expect(requests).toHaveLength(3);
  expect(requests[2].url).toContain('.es.json');
  expect(container.querySelector('.card')).toBeNull();
  expect(screen.getByRole('status').textContent).toBe('Cargando el diccionario…');
  for (const control of container.querySelectorAll('button, input'))
    expect(control.matches(':disabled')).toBe(true);
  await respond(2, es);
  expect(container.querySelector('.meaning')?.textContent).toContain('gracias');
  expect((screen.getByRole('searchbox') as HTMLInputElement).value).toBe('תודה');
  fireEvent.click(screen.getByRole('button', { name: 'Idioma de la interfaz' }));
  fireEvent.click(screen.getByRole('button', { name: 'Русский' }));
  expect(screen.queryByRole('status')).toBeNull();
  expect(container.querySelector('.meaning')?.textContent).toContain('спасибо');
  expect(requests).toHaveLength(3);
});

it('starts directly in saved Spanish without requesting Russian', async () => {
  localStorage.setItem('ulpan-dictionary-language', 'es');
  render(<App />);
  expect(requests[1].url).toContain('.es.json');
  await respond(0, core);
  await respond(1, es);
  expect(screen.queryByRole('status')).toBeNull();
  expect(requests).toHaveLength(2);
});

it.each([0, 1])('retries failed asset %s while retaining the successful asset', async (failed) => {
  render(<App />);
  await respond(1 - failed, failed === 0 ? ru : core);
  await respond(failed, null, false);
  expect(screen.getByRole('alert').textContent).toContain('Не удалось загрузить');
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  expect(screen.getByRole('status')).toBeTruthy();
  expect(requests).toHaveLength(3);
  expect(requests[2].url).toBe(requests[failed].url);
  await respond(2, failed === 0 ? core : ru);
  expect(screen.queryByRole('alert')).toBeNull();
  expect(screen.getByRole('searchbox').matches(':disabled')).toBe(false);
});

it('recovers from a network failure on language switch', async () => {
  render(<App />);
  await respond(0, core);
  await respond(1, ru);
  fireEvent.click(screen.getByRole('button', { name: 'Язык интерфейса' }));
  fireEvent.click(screen.getByRole('button', { name: 'Español' }));
  await act(async () => {
    requests[2].response.reject(new Error('offline'));
  });
  expect(screen.getByRole('alert').textContent).toContain('No se pudo cargar');
  fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }));
  expect(requests).toHaveLength(4);
  await respond(3, es);
  expect(screen.queryByRole('alert')).toBeNull();
});

it('keeps concurrent locale results separate when requests finish out of order', async () => {
  const russian = repository.load('ru');
  const spanish = repository.load('es');
  expect(requests).toHaveLength(3);
  await respond(0, core);
  await respond(2, es);
  await spanish;
  expect(repository.getSnapshot('es').status).toBe('ready');
  expect(repository.getSnapshot('ru').status).toBe('loading');
  await respond(1, ru);
  await russian;
  expect(repository.getSnapshot('ru').status).toBe('ready');
  expect(repository.getSnapshot('es').status).toBe('ready');
});

it('allows retry after invalid JSON or a mismatched locale', async () => {
  render(<App />);
  await respond(0, core);
  await act(async () => {
    requests[1].response.resolve({
      ok: true,
      json: async () => {
        throw new SyntaxError('bad JSON');
      },
    });
  });
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  await respond(2, es);
  expect(screen.getByRole('alert')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'Повторить' }));
  await respond(3, core);
  await respond(4, ru);
  await waitFor(() => expect(screen.queryByRole('alert')).toBeNull());
});

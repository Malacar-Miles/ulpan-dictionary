import coreUrl from '../data/dictionary.core.json?url&no-inline';
import ruUrl from '../data/dictionary.ru.json?url&no-inline';
import esUrl from '../data/dictionary.es.json?url&no-inline';
import type { Locale } from '../localization/catalogs';
import type { DictionaryData, DictionaryLocalization, LoadedDictionary } from '../types';
import { localizeSections } from './dictionary';

export type DictionarySnapshot =
  { status: 'loading' } | { status: 'error' } | { status: 'ready'; data: LoadedDictionary };

const localeUrls = { ru: ruUrl, es: esUrl };

// Cache promises as well as results so StrictMode/remounts share in-flight requests.
// Failed requests are evicted; successful assets survive retries and language changes.
export const createDictionaryRepository = () => {
  const requests = new Map<string, Promise<unknown>>();
  const listeners = new Set<() => void>();
  const snapshots: Record<Locale, DictionarySnapshot> = {
    ru: { status: 'loading' },
    es: { status: 'loading' },
  };
  const pending = new Map<Locale, Promise<void>>();
  const request = <T extends { schemaVersion: number }>(url: string): Promise<T> => {
    let promise = requests.get(url);
    if (!promise) {
      promise = fetch(url)
        .then(async (response) => {
          if (!response.ok) throw new Error(`Dictionary request failed: ${response.status}`);
          const data: T = await response.json();
          if (data.schemaVersion !== 3) throw new Error('Unsupported dictionary schema');
          return data;
        })
        .catch((error: unknown) => {
          requests.delete(url);
          throw error;
        });
      requests.set(url, promise);
    }
    return promise as Promise<T>;
  };
  const publish = (locale: Locale, snapshot: DictionarySnapshot) => {
    snapshots[locale] = snapshot;
    listeners.forEach((notify) => notify());
  };
  return {
    subscribe: (notify: () => void) => {
      listeners.add(notify);
      return () => {
        listeners.delete(notify);
      };
    },
    getSnapshot: (locale: Locale) => snapshots[locale],
    load: (locale: Locale): Promise<void> => {
      if (snapshots[locale].status === 'ready') return Promise.resolve();
      const existing = pending.get(locale);
      if (existing) return existing;
      publish(locale, { status: 'loading' });
      const promise = Promise.all([
        request<DictionaryData>(coreUrl),
        request<DictionaryLocalization>(localeUrls[locale]),
      ])
        .then(([core, localization]) => {
          try {
            if (localization.locale !== locale) throw new Error('Incorrect dictionary locale');
            const sections = localizeSections(core, localization, locale);
            publish(locale, { status: 'ready', data: { core, localization, sections } });
          } catch (error) {
            requests.delete(coreUrl);
            requests.delete(localeUrls[locale]);
            throw error;
          }
        })
        .catch(() => {
          publish(locale, { status: 'error' });
        })
        .finally(() => {
          pending.delete(locale);
        });
      pending.set(locale, promise);
      return promise;
    },
  };
};

export const dictionaryRepository = createDictionaryRepository();

import { describe, expect, it } from 'vitest';
import dictionary from '../src/dictionary.json';
import {
  ALL_TOPICS,
  countEntries,
  filterSections,
  localizeSections,
} from '../src/helpers/dictionary';

const entries = dictionary.sections.flatMap((section) => section.entries);

describe('bilingual dictionary integrity', () => {
  it('has unique stable IDs and complete translations for every section and entry', () => {
    const ids = [...dictionary.sections, ...entries].map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of dictionary.sections) {
      for (const locale of ['ru', 'es'] as const) {
        expect(section.translations[locale].title.trim()).not.toBe('');
        if (section.translations.ru.note)
          expect(section.translations[locale].note.trim()).not.toBe('');
      }
    }
    for (const entry of entries) {
      for (const locale of ['ru', 'es'] as const) {
        expect(entry.translations[locale].meaning.trim()).not.toBe('');
        expect(entry.translations[locale].pronunciation.trim()).not.toBe('');
      }
      const { ru, es } = entry.translations;
      expect(es.pronunciation).not.toMatch(/\p{Script=Cyrillic}/u);
      expect(es.meaning).not.toMatch(/\p{Script=Cyrillic}/u);
      expect(es.pronunciation.split('/')).toHaveLength(ru.pronunciation.split('/').length);
      expect(es.pronunciation.normalize('NFD').match(/\u0301/g)?.length ?? 0).toBe(
        ru.pronunciation.match(/\u0301/g)?.length ?? 0,
      );
    }
  });

  it('retains shared Hebrew and stable categories across languages', () => {
    const ru = localizeSections('ru');
    const es = localizeSections('es');
    expect(es.map(({ id }) => id)).toEqual(ru.map(({ id }) => id));
    expect(countEntries(es)).toBe(entries.length);
    const spellings = (locale: 'ru' | 'es') =>
      localizeSections(locale).flatMap((section) =>
        section.entries.map(({ id, hebrew, hebrewWithNiqqud }) => ({
          id,
          hebrew,
          hebrewWithNiqqud,
        })),
      );
    expect(spellings('es')).toEqual(spellings('ru'));
    expect(countEntries(filterSections('gracias', ALL_TOPICS, 'es'))).toBe(2);
    expect(countEntries(filterSections('gracias', ALL_TOPICS, 'ru'))).toBe(0);
  });

  it('uses the approved sound mapping and reviewed contextual spellings', () => {
    const examples: Record<string, string> = {
      מצוין: 'mezuyán',
      שם: 'shem',
      אולפן: 'ulpán',
      בניין: 'binyán',
      קניון: 'kanyón',
      מעניין: 'meanyén',
      טיול: 'tiyúl',
      מזגן: 'masgán',
      שלך: 'shelchá / shelách',
      'נוסע / נוסעת / נוסעים / נוסעות': 'noséa / nosáat / nosím / nosót',
    };
    for (const [hebrew, latin] of Object.entries(examples)) {
      expect(entries.find((entry) => entry.hebrew === hebrew)?.translations.es.pronunciation).toBe(
        latin,
      );
    }
  });
});

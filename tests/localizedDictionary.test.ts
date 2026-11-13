import { describe, expect, it } from 'vitest';
import type { DictionaryData } from '../src/types';
import dictionary from '../src/dictionary.json';
import {
  ALL_TOPICS,
  countEntries,
  filterSections,
  localizeSections,
} from '../src/helpers/dictionary';

const data: DictionaryData = dictionary;
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
      }
      for (const item of entry.items) {
        const lexeme = data.lexemes[item.lexemeId];
        expect(lexeme.forms.some((form) => form.id === item.defaultFormId)).toBe(true);
        expect(new Set(lexeme.forms.map((form) => form.id)).size).toBe(lexeme.forms.length);
        for (const form of lexeme.forms)
          for (const variant of form.variants) {
            const { ru, es } = variant.pronunciation;
            expect(variant.hebrew.trim() && ru.trim() && es.trim()).toBeTruthy();
            expect(es).not.toMatch(/\p{Script=Cyrillic}/u);
            expect(es.normalize('NFD').match(/\u0301/g)?.length ?? 0).toBe(
              ru.match(/\u0301/g)?.length ?? 0,
            );
          }
      }
    }
  });

  it('shows each collection of lexemes on one card', () => {
    const collections = entries.map((entry) =>
      entry.items
        .map((item) => item.lexemeId)
        .sort()
        .join('|'),
    );
    expect(new Set(collections).size).toBe(entries.length);
  });

  it('retains shared Hebrew and stable categories across languages', () => {
    const ru = localizeSections('ru');
    const es = localizeSections('es');
    expect(es.map(({ id }) => id)).toEqual(ru.map(({ id }) => id));
    expect(countEntries(es)).toBe(entries.length);
    const spellings = (locale: 'ru' | 'es') =>
      localizeSections(locale).flatMap((section) =>
        section.entries.flatMap((entry) =>
          entry.rows.map(({ hebrew, hebrewWithNiqqud }) => ({ hebrew, hebrewWithNiqqud })),
        ),
      );
    expect(spellings('es')).toEqual(spellings('ru'));
    expect(countEntries(filterSections('gracias', ALL_TOPICS, 'es'))).toBe(2);
    expect(countEntries(filterSections('gracias', ALL_TOPICS, 'ru'))).toBe(0);
  });

  it('uses the approved sound mapping and reviewed contextual spellings', () => {
    const examples: Record<string, string> = {
      'word-007': 'mezuyán / mezuyénet / mezuyaním / mezuyanót',
      'word-019': 'shem / shemót',
      'word-075': 'ulpán / ulpaním',
      'word-076': 'binyán / binyaním',
      'word-068': 'kanyón / kanyoním',
      'word-174': 'meanyén / meanyénet / meanyením / meanyenót',
      'word-113': 'tiyúl / tiyulím',
      'word-088': 'masgán / masganím',
      'word-212': 'shelchá / shelách',
      'word-141': 'noséa / nosáat / nosím / nosót',
      'word-050': 'tayár / tayéret / tayarím / tayarót',
      'word-162': 'yesh',
    };
    for (const [id, latin] of Object.entries(examples)) {
      const entry = localizeSections('es')
        .flatMap((section) => section.entries)
        .find((entry) => entry.id === id)!;
      expect(entry.rows.map((row) => row.pronunciation).join(' / ')).toContain(latin);
    }
  });
});

import { describe, expect, it } from 'vitest';
import type { DictionaryData, DictionaryLocalization } from '../src/types';
import dictionary from '../src/data/dictionary.core.json';
import ru from '../src/data/dictionary.ru.json';
import es from '../src/data/dictionary.es.json';
import {
  ALL_TOPICS,
  countEntries,
  filterSections,
  localizeSections,
} from '../src/helpers/dictionary';
const data: DictionaryData = dictionary;
const translations = { ru, es } as Record<'ru' | 'es', DictionaryLocalization>;
const entries = data.sections.flatMap((section) => section.entries);

describe('split dictionary integrity', () => {
  it('has unique IDs, exact translation coverage, and valid form references', () => {
    const ids = [...data.sections, ...entries].map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const locale of ['ru', 'es'] as const) {
      const text = translations[locale];
      expect(text.schemaVersion).toBe(data.schemaVersion);
      expect(text.locale).toBe(locale);
      expect(text.intro.trim()).not.toBe('');
      expect(Object.keys(text.sections).sort()).toEqual(data.sections.map((s) => s.id).sort());
      expect(Object.keys(text.entries).sort()).toEqual(entries.map((e) => e.id).sort());
      expect(Object.keys(text.lexemes).sort()).toEqual(Object.keys(data.lexemes).sort());
      for (const section of data.sections) {
        expect(text.sections[section.id].title.trim()).not.toBe('');
        if (ru.sections[section.id as keyof typeof ru.sections].note)
          expect(text.sections[section.id].note.trim()).not.toBe('');
      }
      for (const entry of entries) {
        expect(text.entries[entry.id].meaning.trim()).not.toBe('');
        expect(entry.addedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        for (const item of entry.items)
          expect(data.lexemes[item.lexemeId].forms.some((f) => f.id === item.defaultFormId)).toBe(
            true,
          );
      }
      for (const [id, lexeme] of Object.entries(data.lexemes)) {
        expect(new Set(lexeme.forms.map((f) => f.id)).size).toBe(lexeme.forms.length);
        expect(Object.keys(text.lexemes[id].forms).sort()).toEqual(
          lexeme.forms.map((f) => f.id).sort(),
        );
        for (const form of lexeme.forms) {
          const localized = text.lexemes[id].forms[form.id];
          expect(localized.pronunciations).toHaveLength(form.variants.length);
          expect(Boolean(localized.gloss)).toBe(
            Boolean(translations.ru.lexemes[id].forms[form.id].gloss),
          );
          form.variants.forEach((variant, i) => {
            const pronunciation = localized.pronunciations[i];
            expect(variant.hebrew.trim() && pronunciation.trim()).toBeTruthy();
            if (locale === 'es') {
              expect(pronunciation).not.toMatch(/\p{Script=Cyrillic}/u);
              expect(pronunciation.normalize('NFD').match(/\u0301/g)?.length ?? 0).toBe(
                translations.ru.lexemes[id].forms[form.id].pronunciations[i].match(/\u0301/g)
                  ?.length ?? 0,
              );
            }
          });
        }
      }
    }
  });
  it('shows each collection once and preserves Hebrew across locales', () => {
    const collections = entries.map((e) =>
      e.items
        .map((i) => i.lexemeId)
        .sort()
        .join('|'),
    );
    expect(new Set(collections).size).toBe(entries.length);
    const sections = {
      ru: localizeSections(data, translations.ru, 'ru'),
      es: localizeSections(data, translations.es, 'es'),
    };
    const spellings = (locale: 'ru' | 'es') =>
      sections[locale].flatMap((s) =>
        s.entries.flatMap((e) => e.rows.map((r) => [r.hebrew, r.hebrewWithNiqqud])),
      );
    expect(spellings('ru')).toEqual(spellings('es'));
    expect(countEntries(sections.es)).toBe(entries.length);
    expect(countEntries(filterSections(sections.es, 'gracias', ALL_TOPICS, 'es'))).toBe(2);
    expect(countEntries(filterSections(sections.ru, 'gracias', ALL_TOPICS, 'ru'))).toBe(0);
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
      const entry = localizeSections(data, translations.es, 'es')
        .flatMap((section) => section.entries)
        .find((entry) => entry.id === id)!;
      expect(entry.rows.map((row) => row.pronunciation).join(' / ')).toContain(latin);
    }
  });
});

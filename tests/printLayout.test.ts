import { expect, it } from 'vitest';
import { buildPrintRows } from '../src/helpers/printLayout';
import { localizeSections } from '../src/helpers/dictionary';
import core from '../src/data/dictionary.core.json';
import ru from '../src/data/dictionary.ru.json';
import type { DictionaryLocalization } from '../src/types';

const entries = localizeSections(core, ru as DictionaryLocalization, 'ru').flatMap(
  (section) => section.entries,
);

it('keeps every selected card once, in dictionary order, with at most five per row', () => {
  const rows = buildPrintRows(entries, false);
  expect(rows.flat()).toEqual(entries);
  expect(rows.slice(0, -1).every((row) => row.length === 5)).toBe(true);
  expect(buildPrintRows([], false)).toEqual([]);
});

it('groups expanded cards by height while filling rows and preserving every entry', () => {
  const original = [...entries];
  const rows = buildPrintRows(entries, true);
  expect(rows.every((row) => row.length <= 5 && row.length > 0)).toBe(true);
  expect(rows.slice(0, -1).every((row) => row.length === 5)).toBe(true);
  expect(
    rows
      .flat()
      .map((entry) => entry.id)
      .sort(),
  ).toEqual(entries.map((entry) => entry.id).sort());
  const heights = rows
    .flat()
    .filter((entry) => entry.rows.length > 1)
    .map((entry) => entry.rows.length);
  expect(heights).toEqual([...heights].sort((a, b) => b - a));
  expect(entries).toEqual(original);
});

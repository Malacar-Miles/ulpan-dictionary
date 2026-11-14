import { expect, it } from 'vitest';
import { buildPrintRows, printCardSpan, printFormColumns } from '../src/helpers/printLayout';
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
  expect(
    rows.every((row) => row.reduce((total, entry) => total + printCardSpan(entry, true), 0) <= 5),
  ).toBe(true);
  expect(
    rows
      .flat()
      .map((entry) => entry.id)
      .sort(),
  ).toEqual(entries.map((entry) => entry.id).sort());
  expect(entries).toEqual(original);
});

const entryWithForms = (id: string, count: number) => ({
  ...entries[0],
  id,
  rows: Array.from({ length: count }, (_, index) => ({
    ...entries[0].defaultRow,
    key: `${id}-${index}`,
  })),
});

it('widens only expanded cards with more than five forms and balances their columns', () => {
  for (const count of [1, 5, 6, 7, 8, 11]) {
    const entry = entryWithForms(String(count), count);
    expect(printCardSpan(entry, false)).toBe(1);
    expect(printFormColumns(entry, false)).toEqual([[entry.defaultRow]]);
    expect(printCardSpan(entry, true)).toBe(count > 5 ? 2 : 1);
    const columns = printFormColumns(entry, true);
    expect(columns.flat()).toEqual(entry.rows);
    if (count > 5) expect(Math.abs(columns[0].length - columns[1].length)).toBeLessThanOrEqual(1);
  }
});

it('fills the fifth slot with a single card and moves the next wide card to a new row', () => {
  const wide = [entryWithForms('a', 8), entryWithForms('b', 8), entryWithForms('c', 8)];
  const single = entryWithForms('d', 1);
  expect(
    buildPrintRows([...wide, single], true).map((row) => row.map((entry) => entry.id)),
  ).toEqual([['a', 'b', 'd'], ['c']]);
  expect(buildPrintRows(wide, true).map((row) => row.map((entry) => entry.id))).toEqual([
    ['a', 'b'],
    ['c'],
  ]);
});

it('never starts a wide card in column five, regardless of selection size', () => {
  for (let count = 0; count <= entries.length; count++) {
    const selected = entries.slice(0, count);
    const rows = buildPrintRows(selected, true);
    expect(new Set(rows.flat().map((entry) => entry.id)).size).toBe(count);
    rows.forEach((row) => {
      let column = 1;
      row.forEach((entry) => {
        const span = printCardSpan(entry, true);
        if (span === 2) expect(column).toBeLessThan(5);
        column += span;
      });
      expect(column).toBeLessThanOrEqual(6);
    });
  }
});

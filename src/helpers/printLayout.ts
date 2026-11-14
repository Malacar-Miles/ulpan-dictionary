import type { DictionaryEntry } from '../types';

export const printCardSpan = (entry: DictionaryEntry, expanded: boolean) =>
  expanded && entry.rows.length > 5 ? 2 : 1;

export const printFormColumns = (entry: DictionaryEntry, expanded: boolean) => {
  if (!expanded) return [[entry.defaultRow]];
  if (printCardSpan(entry, expanded) === 1) return [entry.rows];
  const middle = Math.ceil(entry.rows.length / 2);
  return [entry.rows.slice(0, middle), entry.rows.slice(middle)];
};

export const buildPrintRows = (entries: DictionaryEntry[], expanded: boolean) => {
  // Estimate height using the number of forms in each inner column.
  const pending = [...entries];
  if (expanded)
    pending.sort(
      (a, b) =>
        Math.ceil(b.rows.length / printCardSpan(b, true)) -
        Math.ceil(a.rows.length / printCardSpan(a, true)),
    );
  const rows: DictionaryEntry[][] = [];
  while (pending.length) {
    const row: DictionaryEntry[] = [];
    let remaining = 5;
    while (remaining) {
      // Fill a final single slot from later in the list; never split a wide card.
      const next = pending.findIndex((entry) => printCardSpan(entry, expanded) <= remaining);
      if (next === -1) break;
      const [entry] = pending.splice(next, 1);
      row.push(entry);
      remaining -= printCardSpan(entry, expanded);
    }
    rows.push(row);
  }
  return rows;
};

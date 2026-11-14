import type { DictionaryEntry } from '../types';

const chunks = (entries: DictionaryEntry[]) => {
  const rows: DictionaryEntry[][] = [];
  for (let i = 0; i < entries.length; i += 5) rows.push(entries.slice(i, i + 5));
  return rows;
};

export const buildPrintRows = (entries: DictionaryEntry[], expanded: boolean) => {
  if (!expanded) return chunks(entries);
  // Keep similarly tall cards together, then fill the remaining slots with compact cards.
  const detailed = entries
    .filter((entry) => entry.rows.length > 1)
    .sort((a, b) => b.rows.length - a.rows.length);
  const compact = entries.filter((entry) => entry.rows.length <= 1);
  return chunks([...detailed, ...compact]);
};

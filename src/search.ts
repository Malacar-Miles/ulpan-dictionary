import type { Locale } from './localization/catalogs';

/** Normalize text while retaining original character boundaries for highlighting. */
export const searchable = (text: string, locale: Locale = 'ru') => {
  let value = '';
  const ranges: Array<{ start: number; end: number }> = [];
  let offset = 0;
  for (const char of text.match(/\P{M}\p{M}*|\p{M}+/gu) ?? []) {
    const start = offset;
    offset += char.length;
    // Combining marks belong to the preceding letter and share its highlight.
    if (/^\p{M}+$/u.test(char)) {
      if (ranges.length && ranges[ranges.length - 1].end === start)
        ranges[ranges.length - 1].end = offset;
      continue;
    }
    if (!/[\p{L}\p{N}]/u.test(char)) continue;
    const lower = char.toLocaleLowerCase(locale);
    // Preserve ñ (including decomposed n + tilde), but ignore Spanish vowel accents.
    const normalized =
      locale === 'es'
        ? lower.normalize('NFC') === 'ñ'
          ? 'ñ'
          : lower.normalize('NFD').replace(/\p{M}/gu, '')
        : lower.replace(/[ёэ]/g, 'е').replace(/h/g, 'х').replace(/\p{M}/gu, '');
    for (const part of normalized) {
      value += part;
      ranges.push({ start, end: offset });
    }
  }
  return { value, ranges };
};

export const queryParts = (query: string, locale: Locale = 'ru') => {
  return query
    .trim()
    .split(/\s+/u)
    .map((word) => searchable(word, locale).value)
    .filter(Boolean);
};

export const matches = (fields: string[], query: string, locale: Locale = 'ru') => {
  const parts = queryParts(query, locale);
  if (!parts.length) return true;
  const values = fields.map((field) => searchable(field, locale).value);
  const whole = searchable(query, locale).value;
  return (
    values.some((value) => value.includes(whole)) ||
    parts.every((part) => values.some((value) => value.includes(part)))
  );
};

export const highlightRanges = (text: string, query: string, locale: Locale = 'ru') => {
  const { value, ranges } = searchable(text, locale);
  const whole = searchable(query, locale).value;
  if (!whole) return [];
  // Prefer a full phrase; highlight individual words when matches span fields.
  const needles = value.includes(whole) ? [whole] : queryParts(query, locale);
  const found: Array<{ start: number; end: number }> = [];
  for (const needle of needles) {
    let from = 0;
    while (from < value.length) {
      const index = value.indexOf(needle, from);
      if (index < 0) break;
      found.push({ start: ranges[index].start, end: ranges[index + needle.length - 1].end });
      from = index + needle.length;
    }
  }
  found.sort((a, b) => a.start - b.start || a.end - b.end);
  return found.reduce<typeof found>((merged, range) => {
    const last = merged[merged.length - 1];
    if (last && range.start <= last.end) last.end = Math.max(last.end, range.end);
    else merged.push({ ...range });
    return merged;
  }, []);
};

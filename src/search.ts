/** Normalize text while retaining original character boundaries for highlighting. */
export const searchable = (text: string) => {
  let value = '';
  const ranges: Array<{ start: number; end: number }> = [];
  let offset = 0;
  for (const char of text) {
    const start = offset;
    offset += char.length;
    // Combining marks belong to the preceding letter and share its highlight.
    if (/\p{M}/u.test(char)) {
      if (ranges.length && ranges[ranges.length - 1].end === start)
        ranges[ranges.length - 1].end = offset;
      continue;
    }
    if (!/[\p{L}\p{N}]/u.test(char)) continue;
    const normalized = char.toLocaleLowerCase('ru').replace(/[ёэ]/g, 'е').replace(/h/g, 'х');
    for (const part of normalized) {
      value += part;
      ranges.push({ start, end: offset });
    }
  }
  return { value, ranges };
};

export const queryParts = (query: string) => {
  return query
    .trim()
    .split(/\s+/u)
    .map((word) => searchable(word).value)
    .filter(Boolean);
};

export const matches = (fields: string[], query: string) => {
  const parts = queryParts(query);
  if (!parts.length) return true;
  const values = fields.map((field) => searchable(field).value);
  const whole = searchable(query).value;
  return (
    values.some((value) => value.includes(whole)) ||
    parts.every((part) => values.some((value) => value.includes(part)))
  );
};

export const highlightRanges = (text: string, query: string) => {
  const { value, ranges } = searchable(text);
  const whole = searchable(query).value;
  if (!whole) return [];
  // Prefer a full phrase; highlight individual words when matches span fields.
  const needles = value.includes(whole) ? [whole] : queryParts(query);
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

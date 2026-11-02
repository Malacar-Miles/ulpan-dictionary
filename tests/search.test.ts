import { describe, expect, it } from 'vitest';
import { highlightRanges, matches, searchable } from '../src/search';
import { getEntrySpellings } from '../src/helpers/dictionary';

describe('dictionary search', () => {
  it('normalizes accents, niqqud, punctuation, case, spaces, and transcription variants', () => {
    expect(searchable(' H, ё Э! שָׁלוֹם ').value).toBe('хееשלום');
    expect(matches(['тода́'], 'ТОДА')).toBe(true);
    expect(matches(['hэ́'], 'хе')).toBe(true);
    expect(matches(['בית ספר'], 'ביתספר')).toBe(true);
    expect(matches(['שלום'], 'שָׁלוֹם')).toBe(true);
  });

  it('matches all query words across fields and accepts an empty query', () => {
    expect(matches(['שלום', 'привет'], 'שלום привет')).toBe(true);
    expect(matches(['שלום', 'привет'], 'שלום пока')).toBe(false);
    expect(matches(['שלום'], '?!')).toBe(true);
  });

  it('highlights original letters together with their combining marks', () => {
    expect(highlightRanges('שָׁלוֹם', 'שלום')).toEqual([{ start: 0, end: 7 }]);
    expect(highlightRanges('тода́', 'да')).toEqual([{ start: 2, end: 5 }]);
    expect(highlightRanges('ab ab', 'ab')).toEqual([
      { start: 0, end: 2 },
      { start: 3, end: 5 },
    ]);
    expect(highlightRanges('abc', '?!')).toEqual([]);
  });

  it('shows a hidden spelling only when it is the matching spelling', () => {
    const entry = { hebrew: 'אמא', hebrewWithNiqqud: 'אִמָּא', pronunciation: '', meaning: '' };
    expect(getEntrySpellings(entry, 'אמא', true).alternate).toBeUndefined();
    const differentSpelling = { ...entry, hebrew: 'אימא' };
    expect(getEntrySpellings(differentSpelling, 'אימא', true).alternate).toBe('אימא');
    expect(getEntrySpellings(differentSpelling, 'אמא', false).alternate).toBe('אִמָּא');
    expect(getEntrySpellings({ ...entry, hebrewWithNiqqud: undefined }, '', true).visible).toBe(
      'אמא',
    );
  });
});

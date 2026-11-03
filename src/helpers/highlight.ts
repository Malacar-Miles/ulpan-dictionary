import type { Locale } from '../localization/catalogs';
import { highlightRanges } from '../search';

export const getHighlightSegments = (text: string, query: string, locale: Locale = 'ru') => {
  const segments: Array<{ text: string; start: number; highlighted: boolean }> = [];
  let previous = 0;
  highlightRanges(text, query, locale).forEach(({ start, end }) => {
    segments.push({ text: text.slice(previous, start), start: previous, highlighted: false });
    segments.push({ text: text.slice(start, end), start, highlighted: true });
    previous = end;
  });
  segments.push({ text: text.slice(previous), start: previous, highlighted: false });
  return segments;
};

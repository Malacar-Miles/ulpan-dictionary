import dictionary from '../dictionary.json';
import { matches, highlightRanges } from '../search';
import type { DictionaryEntry, DictionarySection } from '../types';

export const ALL_TOPICS = 'Все темы';

export const sections: DictionarySection[] = dictionary.sections;

export const filterSections = (query: string, activeTopic: string) =>
  sections
    .filter((section) => activeTopic === ALL_TOPICS || section.title === activeTopic)
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        matches(
          [entry.hebrew, entry.hebrewWithNiqqud ?? '', entry.pronunciation, entry.meaning],
          query,
        ),
      ),
    }))
    .filter((section) => section.entries.length > 0);

export const countEntries = (items: DictionarySection[]) =>
  items.reduce((sum, section) => sum + section.entries.length, 0);

export const formatUpdatedDate = (date: string) =>
  new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

export const getEntrySpellings = (entry: DictionaryEntry, query: string, showNiqqud: boolean) => {
  const visible = showNiqqud && entry.hebrewWithNiqqud ? entry.hebrewWithNiqqud : entry.hebrew;
  const alternate = showNiqqud ? entry.hebrew : entry.hebrewWithNiqqud;
  const showAlternate =
    alternate &&
    highlightRanges(alternate, query).length > 0 &&
    highlightRanges(visible, query).length === 0;

  return { visible, alternate: showAlternate ? alternate : undefined };
};

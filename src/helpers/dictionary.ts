import dictionary from '../dictionary.json';
import { matches, highlightRanges } from '../search';
import type { DictionaryData, DictionarySection, HebrewSpellings } from '../types';
import type { Locale } from '../localization/catalogs';

export const ALL_TOPICS = 'all';

const data: DictionaryData = dictionary;

export const localizeSections = (locale: Locale): DictionarySection[] =>
  data.sections.map((section) => ({
    id: section.id,
    ...section.translations[locale],
    entries: section.entries.map((entry) => ({
      id: entry.id,
      hebrew: entry.hebrew,
      hebrewWithNiqqud: entry.hebrewWithNiqqud,
      ...entry.translations[locale],
    })),
  }));

export const filterSections = (query: string, activeTopic: string, locale: Locale = 'ru') =>
  localizeSections(locale)
    .filter((section) => activeTopic === ALL_TOPICS || section.id === activeTopic)
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        matches(
          [entry.hebrew, entry.hebrewWithNiqqud ?? '', entry.pronunciation, entry.meaning],
          query,
          locale,
        ),
      ),
    }))
    .filter((section) => section.entries.length > 0);

export const countEntries = (items: DictionarySection[]) =>
  items.reduce((sum, section) => sum + section.entries.length, 0);

export const formatUpdatedDate = (date: string, locale: Locale = 'ru') =>
  new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: locale === 'es' ? 'numeric' : 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`));

export const getEntrySpellings = (entry: HebrewSpellings, query: string, showNiqqud: boolean) => {
  const visible = showNiqqud && entry.hebrewWithNiqqud ? entry.hebrewWithNiqqud : entry.hebrew;
  const alternate = showNiqqud ? entry.hebrew : entry.hebrewWithNiqqud;
  const showAlternate =
    alternate &&
    highlightRanges(alternate, query).length > 0 &&
    highlightRanges(visible, query).length === 0;

  return { visible, alternate: showAlternate ? alternate : undefined };
};

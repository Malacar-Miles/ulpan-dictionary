import { grammarLabel } from '../localization/grammar';
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
    entries: section.entries.map((entry) => {
      const rows = entry.items.flatMap(({ lexemeId }) =>
        data.lexemes[lexemeId].forms.flatMap((form) =>
          form.variants.map((variant, i) => ({
            key: [lexemeId, form.id, i].join('/'),
            hebrew: variant.hebrew,
            hebrewWithNiqqud: variant.hebrewWithNiqqud,
            pronunciation: variant.pronunciation[locale],
            label: grammarLabel(form.grammar, locale, variant.usage),
            gloss: form.gloss?.[locale],
          })),
        ),
      );
      const first = entry.items[0];
      const defaultRow = rows.find(
        (row) => row.key === [first.lexemeId, first.defaultFormId, 0].join('/'),
      )!;
      return {
        id: entry.id,
        addedAt: entry.addedAt,
        meaning: entry.translations[locale].meaning,
        rows,
        defaultRow,
      };
    }),
  }));

export const rowFields = (row: DictionarySection['entries'][number]['defaultRow']) => [
  row.hebrew,
  row.hebrewWithNiqqud ?? '',
  row.pronunciation,
  row.gloss ?? '',
];

export const filterSections = (query: string, activeTopic: string, locale: Locale = 'ru') =>
  localizeSections(locale)
    .filter((section) => activeTopic === ALL_TOPICS || section.id === activeTopic)
    .map((section) => ({
      ...section,
      entries: section.entries.filter((entry) =>
        matches([entry.meaning, ...entry.rows.flatMap(rowFields)], query, locale),
      ),
    }))
    .filter((section) => section.entries.length > 0);

export const groupByDateAdded = (
  sections: DictionarySection[],
  locale: Locale,
): DictionarySection[] => {
  const groups = new Map<string, DictionarySection>();
  for (const section of sections) {
    for (const entry of section.entries) {
      const date = entry.addedAt;
      let group = groups.get(date);
      if (!group) {
        group = { id: date, title: formatUpdatedDate(date, locale), note: '', entries: [] };
        groups.set(date, group);
      }
      group.entries.push(entry);
    }
  }
  return [...groups.values()].sort((a, b) => b.id.localeCompare(a.id));
};

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

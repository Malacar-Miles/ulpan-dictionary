import type { Locale } from './localization/catalogs';

export type EntryTranslation = { pronunciation: string; meaning: string };
export type HebrewSpellings = { hebrew: string; hebrewWithNiqqud?: string };
export type DictionaryEntry = HebrewSpellings & EntryTranslation & { id: string };
export type DictionarySection = {
  id: string;
  title: string;
  note: string;
  entries: DictionaryEntry[];
};
export type DictionaryData = {
  updatedAt: string;
  intro: Record<Locale, string>;
  sections: {
    id: string;
    translations: Record<Locale, { title: string; note: string }>;
    entries: (HebrewSpellings & {
      id: string;
      translations: Record<Locale, EntryTranslation>;
    })[];
  }[];
};
export type Topic = { id: string; title: string };

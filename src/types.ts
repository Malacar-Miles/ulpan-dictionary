import type { Locale } from './localization/catalogs';

export type HebrewSpellings = { hebrew: string; hebrewWithNiqqud?: string };
export type Agreement = { person?: number; number?: string; gender?: string };
export type Grammar = Agreement & {
  kind: string;
  state?: string;
  possessor?: Agreement;
  complement?: Agreement;
  addressee?: Agreement;
  object?: Agreement;
};
export type FormRow = HebrewSpellings & {
  key: string;
  pronunciation: string;
  label: string;
  gloss?: string;
};
export type DictionaryEntry = {
  id: string;
  addedAt: string;
  meaning: string;
  root?: string | null;
  rows: FormRow[];
  defaultRow: FormRow;
};
export type DictionarySection = {
  id: string;
  title: string;
  note: string;
  entries: DictionaryEntry[];
};
export type DictionaryData = {
  schemaVersion: number;
  updatedAt: string;
  lexemes: Record<
    string,
    {
      lemma: string;
      partOfSpeech: string;
      root?: string | null;
      binyan?: string;
      forms: {
        id: string;
        grammar: Grammar;
        variants: (HebrewSpellings & { usage?: string })[];
      }[];
    }
  >;
  sections: {
    id: string;
    entries: {
      id: string;
      addedAt: string;
      items: { lexemeId: string; defaultFormId: string }[];
    }[];
  }[];
};
export type Topic = { id: string; title: string };

export type DictionaryLocalization = {
  schemaVersion: number;
  locale: Locale;
  intro: string;
  sections: Record<string, { title: string; note: string }>;
  entries: Record<string, { meaning: string }>;
  lexemes: Record<string, { forms: Record<string, { pronunciations: string[]; gloss?: string }> }>;
};
export type LoadedDictionary = {
  core: DictionaryData;
  localization: DictionaryLocalization;
  sections: DictionarySection[];
};

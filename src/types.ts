import type { Locale } from './localization/catalogs';

export type HebrewSpellings = { hebrew: string; hebrewWithNiqqud?: string };
type Localized = Record<Locale, string>;
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
  intro: Localized;
  lexemes: Record<
    string,
    {
      lemma: string;
      partOfSpeech: string;
      root?: string;
      binyan?: string;
      forms: {
        id: string;
        grammar: Grammar;
        gloss?: Localized;
        variants: (HebrewSpellings & { pronunciation: Localized; usage?: string })[];
      }[];
    }
  >;
  sections: {
    id: string;
    translations: Record<Locale, { title: string; note: string }>;
    entries: {
      id: string;
      addedAt: string;
      translations: Record<Locale, { meaning: string }>;
      items: { lexemeId: string; defaultFormId: string }[];
    }[];
  }[];
};
export type Topic = { id: string; title: string };

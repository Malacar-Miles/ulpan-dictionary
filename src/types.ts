export type DictionaryEntry = {
  hebrew: string;
  hebrewWithNiqqud?: string;
  pronunciation: string;
  meaning: string;
};
export type DictionarySection = {
  title: string;
  note: string;
  entries: DictionaryEntry[];
};

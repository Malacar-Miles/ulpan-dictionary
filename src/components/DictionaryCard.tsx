import { useLocale } from '../localization/context';
import type { DictionaryEntry } from '../types';
import { getEntrySpellings } from '../helpers/dictionary';
import { Highlight } from './Highlight';

type DictionaryCardProps = { entry: DictionaryEntry; query: string; showNiqqud: boolean };
export const DictionaryCard = ({ entry, query, showNiqqud }: DictionaryCardProps) => {
  const { messages } = useLocale();
  const { visible, alternate } = getEntrySpellings(entry, query, showNiqqud);
  return (
    <article className="card">
      <div className="card-top">
        <span className="hebrew" lang="he" dir="rtl">
          <Highlight text={visible} query={query} />
        </span>
      </div>
      {alternate && (
        <p className="alternate-spelling">
          <span>{showNiqqud ? messages.withoutNiqqud : messages.withNiqqud}</span>{' '}
          <b lang="he" dir="rtl">
            <Highlight text={alternate} query={query} />
          </b>
        </p>
      )}
      <p className="pronunciation">
        <Highlight text={entry.pronunciation} query={query} />
      </p>
      <div className="card-rule" />
      <p className="meaning">
        <Highlight text={entry.meaning} query={query} />
      </p>
    </article>
  );
};

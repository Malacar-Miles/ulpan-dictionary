import { useId, useState } from 'react';
import { useLocale } from '../localization/context';
import type { DictionaryEntry, FormRow } from '../types';
import { getEntrySpellings, rowFields } from '../helpers/dictionary';
import { matches } from '../search';
import { Highlight } from './Highlight';

type DictionaryCardProps = { entry: DictionaryEntry; query: string; showNiqqud: boolean };
export const DictionaryCard = ({ entry, query, showNiqqud }: DictionaryCardProps) => {
  const { messages, locale } = useLocale();
  const id = useId();
  const [choice, setChoice] = useState<{ query: string; open: boolean }>();
  const { rows, defaultRow } = entry;
  const expandable = rows.length > 1;
  const open =
    expandable &&
    (choice?.query === query
      ? choice.open
      : Boolean(query.trim()) &&
        !matches([...rowFields(defaultRow), entry.meaning], query, locale));
  const toggle = () => setChoice({ query, open: !open });
  const hebrew = (row: FormRow) => {
    const { visible, alternate } = getEntrySpellings(row, query, showNiqqud);
    return (
      <>
        <span className="hebrew" lang="he" dir="rtl">
          <Highlight text={visible} query={query} />
        </span>
        {alternate && (
          <span className="alternate-spelling">
            {showNiqqud ? messages.withoutNiqqud : messages.withNiqqud}{' '}
            <b lang="he" dir="rtl">
              <Highlight text={alternate} query={query} />
            </b>
          </span>
        )}
      </>
    );
  };
  return (
    <article
      className={'card' + (expandable ? ' expandable' : '')}
      onClick={(event) => {
        if (
          expandable &&
          !(event.target as Element).closest('button') &&
          !window.getSelection()?.toString()
        )
          toggle();
      }}
    >
      {expandable && (
        <button
          className="forms-trigger"
          aria-expanded={open}
          aria-controls={id}
          aria-label={(locale === 'ru' ? 'Формы слова ' : 'Formas de ') + defaultRow.hebrew}
          onClick={toggle}
        >
          <span aria-hidden="true">{open ? '▴' : '▾'}</span>
        </button>
      )}
      <div id={id}>
        {open ? (
          <table className="forms-table">
            <thead>
              <tr>
                {(locale === 'ru'
                  ? ['Иврит', 'Произношение', 'Форма']
                  : ['Hebreo', 'Pronunciación', 'Forma']
                ).map((text) => (
                  <th key={text} scope="col">
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td>{hebrew(row)}</td>
                  <td className="pronunciation">
                    <Highlight text={row.pronunciation} query={query} />
                  </td>
                  <td>
                    {row.label}
                    {row.gloss && (
                      <>
                        {' '}
                        · <Highlight text={row.gloss} query={query} />
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <>
            <div className="card-top">{hebrew(defaultRow)}</div>
            <p className="pronunciation">
              <Highlight text={defaultRow.pronunciation} query={query} />
            </p>
          </>
        )}
      </div>
      <div className="card-rule" />
      <p className="meaning">
        <Highlight text={entry.meaning} query={query} />
      </p>
    </article>
  );
};

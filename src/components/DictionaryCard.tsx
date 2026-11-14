import { useId, useState } from 'react';
import { useLocale } from '../localization/context';
import type { DictionaryEntry, FormRow } from '../types';
import { getEntrySpellings, rowFields } from '../helpers/dictionary';
import { matches } from '../search';
import { Highlight } from './Highlight';
import { CollapseSwap } from './CollapseSwap';

type DictionaryCardProps = { entry: DictionaryEntry; query: string; showNiqqud: boolean };
export const DictionaryCard = ({ entry, query, showNiqqud }: DictionaryCardProps) => {
  const { messages, locale } = useLocale();
  const id = useId();
  const [choice, setChoice] = useState<{ query: string; open: boolean }>();
  // Discard manual state when searching, including when returning to an earlier query.
  if (choice && choice.query !== query) setChoice(undefined);
  const animate = choice?.query === query;
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
      className={'card' + (expandable ? ' expandable' : '') + (animate ? ' animate-forms' : '')}
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
        <div className="forms-toggle">
          <button
            className="forms-trigger"
            aria-expanded={open}
            aria-controls={id}
            aria-label={(locale === 'ru' ? 'Формы слова ' : 'Formas de ') + defaultRow.hebrew}
            onClick={toggle}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 9 7 7 7-7" />
            </svg>
          </button>
        </div>
      )}
      <CollapseSwap
        id={id}
        open={open}
        summary={
          <>
            <div className="card-top">{hebrew(defaultRow)}</div>
            <p className="pronunciation">
              <Highlight text={defaultRow.pronunciation} query={query} />
            </p>
          </>
        }
      >
        <div className="forms-header">
          {entry.root !== undefined && (
            <div className="card-roots">
              {messages.root}{' '}
              {entry.root === null ? (
                messages.rootUnlisted
              ) : (
                <bdi lang="he" dir="rtl">
                  <strong>{entry.root}</strong>
                </bdi>
              )}
            </div>
          )}
        </div>
        <div className="forms-grid" role="table">
          <div className="sr-only" role="row">
            {(locale === 'ru'
              ? ['Иврит', 'Произношение', 'Форма']
              : ['Hebreo', 'Pronunciación', 'Forma']
            ).map((text) => (
              <span key={text} role="columnheader">
                {text}
              </span>
            ))}
          </div>
          {rows.map((row) => (
            <div key={row.key} role="row" className="form-row">
              <div role="cell">{hebrew(row)}</div>
              <div role="cell" className="pronunciation">
                <Highlight text={row.pronunciation} query={query} />
              </div>
              <div role="cell">
                {row.label}
                {row.gloss && (
                  <>
                    {' '}
                    · <Highlight text={row.gloss} query={query} />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CollapseSwap>
      <div className="card-rule" />
      <p className="meaning">
        <Highlight text={entry.meaning} query={query} />
      </p>
    </article>
  );
};

import styles from './DictionaryCard.module.css';
import { memo, useContext, useId, type ReactNode } from 'react';
import { ShowTranslationContext } from '../translationContext';
import { TranslationBlur } from './TranslationBlur';
import { useLocale } from '../localization/context';
import type { DictionaryEntry, FormRow } from '../types';
import { getEntrySpellings, rowFields } from '../helpers/dictionary';
import { matches } from '../search';
import { Highlight } from './Highlight';
import { CollapseSwap } from './CollapseSwap';

type DictionaryCardProps = {
  entry: DictionaryEntry;
  selected: boolean;
  onToggleCard: (id: string) => void;
  query: string;
  showNiqqud: boolean;
  expanded: boolean | undefined;
  onExpandedChange: (id: string, expanded: boolean) => void;
};
export const DictionaryCard = memo(
  ({
    entry,
    query,
    showNiqqud,
    expanded,
    onExpandedChange,
    selected,
    onToggleCard,
  }: DictionaryCardProps) => {
    const { messages, locale } = useLocale();
    const id = useId();
    const showTranslation = useContext(ShowTranslationContext);
    const translation = (content: ReactNode) =>
      showTranslation ? content : <TranslationBlur>{content}</TranslationBlur>;
    const animate = expanded !== undefined;
    const { rows, defaultRow } = entry;
    const expandable = rows.length > 1;
    const open =
      expandable &&
      (expanded !== undefined
        ? expanded
        : Boolean(query.trim()) &&
          !matches([...rowFields(defaultRow), entry.meaning], query, locale));
    const toggle = () => onExpandedChange(entry.id, !open);
    const hebrew = (row: FormRow) => {
      const { visible, alternate } = getEntrySpellings(row, query, showNiqqud);
      return (
        <>
          <span className={styles['hebrew']} lang="he" dir="rtl">
            <Highlight text={visible} query={query} />
          </span>
          {alternate && (
            <span className={styles['alternate-spelling']}>
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
        className={
          styles['card'] +
          (expandable ? ' ' + styles['expandable'] : '') +
          (animate ? ' ' + styles['animate-forms'] : '')
        }
        onClick={(event) => {
          if (
            expandable &&
            !(event.target as Element).closest('button, input, label') &&
            !window.getSelection()?.toString()
          )
            toggle();
        }}
      >
        <span className={styles['print-select-slot']}>
          <label
            className={styles['print-select']}
            title={messages.selectForPrint(defaultRow.hebrew)}
          >
            <input
              type="checkbox"
              checked={selected}
              aria-label={messages.selectForPrint(defaultRow.hebrew)}
              onChange={() => onToggleCard(entry.id)}
            />
          </label>
        </span>
        <CollapseSwap
          id={id}
          open={open}
          summary={
            <>
              <div className={styles['card-top']}>{hebrew(defaultRow)}</div>
              <p className={styles['pronunciation']}>
                <Highlight text={defaultRow.pronunciation} query={query} />
              </p>
            </>
          }
        >
          <div className={styles['forms-header']}>
            {entry.root !== undefined && (
              <div className={styles['card-roots']}>
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
          <div className={styles['forms-grid']} role="table">
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
              <div key={row.key} role="row" className={styles['form-row']}>
                <div role="cell">{hebrew(row)}</div>
                <div role="cell" className={styles['pronunciation']}>
                  <Highlight text={row.pronunciation} query={query} />
                </div>
                <div role="cell">
                  {translation(
                    <>
                      {row.label}
                      {row.gloss && (
                        <>
                          {' '}
                          · <Highlight text={row.gloss} query={query} />
                        </>
                      )}
                    </>,
                  )}
                </div>
              </div>
            ))}
          </div>
        </CollapseSwap>
        <div className={styles['card-rule']} />
        <div className={styles['description-row']}>
          <p className={styles['meaning']}>
            {translation(<Highlight text={entry.meaning} query={query} />)}
          </p>
          {expandable && (
            <div className={styles['forms-toggle']}>
              <button
                className={styles['forms-trigger']}
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
        </div>
      </article>
    );
  },
);

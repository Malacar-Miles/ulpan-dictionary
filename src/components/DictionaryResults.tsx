import styles from './DictionaryResults.module.css';
import { memo, useCallback, useState } from 'react';
import { VIRTUALIZE_RESULTS } from '../config';
import { useLocale } from '../localization/context';
import type { DictionarySection as Section } from '../types';
import { VirtualDictionarySections } from './VirtualDictionarySections';
import { DictionarySections } from './DictionarySection';
import { EmptyResults } from './EmptyResults';
type DictionaryResultsProps = {
  showFallbackNotice: boolean;
  total: number;
  updated: string;
  title: string;
  count: number;
  sections: Section[];
  query: string;
  activeTopic: string | null;
  showNiqqud: boolean;
  onReset: () => void;
};
export const DictionaryResults = memo(
  ({
    showFallbackNotice,
    total,
    updated,
    title,
    count,
    sections,
    query,
    activeTopic,
    showNiqqud,
    onReset,
  }: DictionaryResultsProps) => {
    const Sections = VIRTUALIZE_RESULTS ? VirtualDictionarySections : DictionarySections;
    const { messages } = useLocale();
    const [expansion, setExpansion] = useState(() => ({
      query,
      activeTopic,
      choices: new Map<string, boolean>(),
    }));
    // Keep choices above virtual rows, but discard them on search or tab changes.
    if (expansion.query !== query || expansion.activeTopic !== activeTopic) {
      setExpansion({ query, activeTopic, choices: new Map() });
    }
    const onCardExpandedChange = useCallback((id: string, expanded: boolean) => {
      setExpansion((current) => ({
        ...current,
        choices: new Map(current.choices).set(id, expanded),
      }));
    }, []);
    return (
      <>
        {showFallbackNotice && (
          <p className={styles['search-fallback-notice']} role="status">
            {messages.searchFallbackNotice}
          </p>
        )}
        <div className={styles['results-meta']}>
          <p className={styles['eyebrow']}>
            <span></span> {messages.dictionary}
          </p>
          <span className={styles['records-caption']}>{messages.records(total, updated)}</span>
        </div>
        <div className={styles['results-head']}>
          <h2>{title}</h2>
          <p aria-live="polite">
            {messages.found} <strong>{count}</strong>
          </p>
        </div>
        {sections.length ? (
          <Sections
            sections={sections}
            query={query}
            showNiqqud={showNiqqud}
            cardChoices={expansion.choices}
            onCardExpandedChange={onCardExpandedChange}
          />
        ) : (
          <EmptyResults onReset={onReset} />
        )}
      </>
    );
  },
);

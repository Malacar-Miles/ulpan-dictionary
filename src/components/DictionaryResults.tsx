import styles from './DictionaryResults.module.css';
import { memo } from 'react';
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
    showNiqqud,
    onReset,
  }: DictionaryResultsProps) => {
    const Sections = VIRTUALIZE_RESULTS ? VirtualDictionarySections : DictionarySections;
    const { messages } = useLocale();
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
          <Sections sections={sections} query={query} showNiqqud={showNiqqud} />
        ) : (
          <EmptyResults onReset={onReset} />
        )}
      </>
    );
  },
);

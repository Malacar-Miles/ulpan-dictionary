import { memo } from 'react';
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
    const Sections =
      import.meta.env.VITE_VIRTUALIZE_RESULTS === 'false'
        ? DictionarySections
        : VirtualDictionarySections;
    const { messages } = useLocale();
    return (
      <>
        {showFallbackNotice && (
          <p className="search-fallback-notice" role="status">
            {messages.searchFallbackNotice}
          </p>
        )}
        <div className="results-meta">
          <p className="eyebrow">
            <span></span> {messages.dictionary}
          </p>
          <span className="records-caption">{messages.records(total, updated)}</span>
        </div>
        <div className="results-head">
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

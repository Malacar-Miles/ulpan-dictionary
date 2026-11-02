import type { DictionarySection as Section } from '../types';
import { DictionarySection } from './DictionarySection';
import { EmptyResults } from './EmptyResults';
type DictionaryResultsProps = {
  title: string;
  count: number;
  sections: Section[];
  query: string;
  showNiqqud: boolean;
  onReset: () => void;
};
export const DictionaryResults = ({
  title,
  count,
  sections,
  query,
  showNiqqud,
  onReset,
}: DictionaryResultsProps) => (
  <>
    <div className="results-head">
      <div>
        <p className="eyebrow">
          <span></span> СЛОВАРЬ
        </p>
        <h2>{title}</h2>
      </div>
      <p aria-live="polite">
        Найдено: <strong>{count}</strong>
      </p>
    </div>
    {sections.length ? (
      sections.map((section) => (
        <DictionarySection
          key={section.title}
          section={section}
          query={query}
          showNiqqud={showNiqqud}
        />
      ))
    ) : (
      <EmptyResults onReset={onReset} />
    )}
  </>
);

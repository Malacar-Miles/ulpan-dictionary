import styles from './DictionarySection.module.css';
import { memo } from 'react';
import { useLocale } from '../localization/context';
import type { PrintSelectionProps } from '../hooks/usePrintSelection';
import type { DictionaryEntry, DictionarySection as Section } from '../types';
import { DictionaryCard } from './DictionaryCard';

export const SectionHeading = memo(
  ({
    section,
    selectedIds,
    onToggleSection,
  }: { section: Section } & Pick<PrintSelectionProps, 'selectedIds' | 'onToggleSection'>) => {
    const { messages } = useLocale();
    const allSelected = section.entries.every((entry) => selectedIds.has(entry.id));
    const someSelected = section.entries.some((entry) => selectedIds.has(entry.id));
    const action = allSelected ? messages.deselectSection : messages.selectSection;
    return (
      <>
        <div className={styles['section-title']}>
          <h3>{section.title}</h3>
          <span>{section.entries.length}</span>
          <div />
          <button
            type="button"
            className={styles['section-select']}
            aria-label={`${action}: ${section.title}`}
            aria-pressed={allSelected ? true : someSelected ? 'mixed' : false}
            onClick={() => onToggleSection(section.entries.map((entry) => entry.id))}
          >
            <svg
              aria-hidden="true"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              {allSelected ? (
                <path d="m7 12 3 3 7-7" />
              ) : someSelected ? (
                <path d="M7 12h10" />
              ) : (
                <path d="M7 12h10m-5-5v10" />
              )}
            </svg>
            {action}
          </button>
        </div>
        {section.note && <p className={styles['section-note']}>{section.note}</p>}
      </>
    );
  },
);

// Virtual row positions change on scroll and resize; their contents can stay rendered.
export const EntryGrid = memo(
  ({
    entries,
    query,
    showNiqqud,
    cardChoices,
    onCardExpandedChange,
    selectedIds,
    onToggleCard,
  }: {
    entries: DictionaryEntry[];
    query: string;
    showNiqqud: boolean;
  } & CardExpansionProps &
    Pick<PrintSelectionProps, 'selectedIds' | 'onToggleCard'>) => (
    <div className={styles['grid']}>
      {entries.map((entry) => (
        <DictionaryCard
          key={entry.id}
          entry={entry}
          selected={selectedIds.has(entry.id)}
          onToggleCard={onToggleCard}
          query={query}
          showNiqqud={showNiqqud}
          expanded={cardChoices.get(entry.id)}
          onExpandedChange={onCardExpandedChange}
        />
      ))}
    </div>
  ),
);

type CardExpansionProps = {
  cardChoices: ReadonlyMap<string, boolean>;
  onCardExpandedChange: (id: string, expanded: boolean) => void;
};

export type SectionListProps = {
  sections: Section[];
  query: string;
  showNiqqud: boolean;
} & CardExpansionProps &
  PrintSelectionProps;

export const DictionarySections = ({ sections, ...display }: SectionListProps) =>
  sections.map((section) => (
    <section key={section.id} className={styles['section']}>
      <SectionHeading
        section={section}
        selectedIds={display.selectedIds}
        onToggleSection={display.onToggleSection}
      />
      <EntryGrid entries={section.entries} {...display} />
    </section>
  ));

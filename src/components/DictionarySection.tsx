import styles from './DictionarySection.module.css';
import { memo } from 'react';
import type { DictionaryEntry, DictionarySection as Section } from '../types';
import { DictionaryCard } from './DictionaryCard';

export const SectionHeading = memo(({ section }: { section: Section }) => (
  <>
    <div className={styles['section-title']}>
      <h3>{section.title}</h3>
      <span>{section.entries.length}</span>
      <div />
    </div>
    {section.note && <p className={styles['section-note']}>{section.note}</p>}
  </>
));

// Virtual row positions change on scroll and resize; their contents can stay rendered.
export const EntryGrid = memo(
  ({
    entries,
    query,
    showNiqqud,
  }: {
    entries: DictionaryEntry[];
    query: string;
    showNiqqud: boolean;
  }) => (
    <div className={styles['grid']}>
      {entries.map((entry) => (
        <DictionaryCard key={entry.id} entry={entry} query={query} showNiqqud={showNiqqud} />
      ))}
    </div>
  ),
);

export type SectionListProps = { sections: Section[]; query: string; showNiqqud: boolean };

export const DictionarySections = ({ sections, ...display }: SectionListProps) =>
  sections.map((section) => (
    <section key={section.id} className={styles['section']}>
      <SectionHeading section={section} />
      <EntryGrid entries={section.entries} {...display} />
    </section>
  ));

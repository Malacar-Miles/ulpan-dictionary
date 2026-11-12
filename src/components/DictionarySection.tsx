import type { DictionaryEntry, DictionarySection as Section } from '../types';
import { DictionaryCard } from './DictionaryCard';

export const SectionHeading = ({ section }: { section: Section }) => (
  <>
    <div className="section-title">
      <h3>{section.title}</h3>
      <span>{section.entries.length}</span>
      <div />
    </div>
    {section.note && <p className="section-note">{section.note}</p>}
  </>
);

export const EntryGrid = ({
  entries,
  query,
  showNiqqud,
}: {
  entries: DictionaryEntry[];
  query: string;
  showNiqqud: boolean;
}) => (
  <div className="grid">
    {entries.map((entry) => (
      <DictionaryCard key={entry.id} entry={entry} query={query} showNiqqud={showNiqqud} />
    ))}
  </div>
);

export type SectionListProps = { sections: Section[]; query: string; showNiqqud: boolean };

export const DictionarySections = ({ sections, ...display }: SectionListProps) =>
  sections.map((section) => (
    <section key={section.id} className="section">
      <SectionHeading section={section} />
      <EntryGrid entries={section.entries} {...display} />
    </section>
  ));

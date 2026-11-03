import type { DictionarySection as Section } from '../types';
import { DictionaryCard } from './DictionaryCard';
type DictionarySectionProps = { section: Section; query: string; showNiqqud: boolean };
export const DictionarySection = ({ section, query, showNiqqud }: DictionarySectionProps) => (
  <section className="section">
    <div className="section-title">
      <h3>{section.title}</h3>
      <span>{section.entries.length}</span>
      <div />
    </div>
    {section.note && <p className="section-note">{section.note}</p>}
    <div className="grid">
      {section.entries.map((entry) => (
        <DictionaryCard key={entry.id} entry={entry} query={query} showNiqqud={showNiqqud} />
      ))}
    </div>
  </section>
);

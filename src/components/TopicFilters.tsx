type TopicFiltersProps = {
  topics: string[];
  activeTopic: string;
  onSelect: (topic: string) => void;
};
export const TopicFilters = ({ topics, activeTopic, onSelect }: TopicFiltersProps) => (
  <nav className="filters" aria-label="Фильтр по теме">
    {topics.map((title) => (
      <button
        key={title}
        type="button"
        className={activeTopic === title ? 'active' : ''}
        aria-pressed={activeTopic === title}
        onClick={() => onSelect(title)}
      >
        {title}
      </button>
    ))}
  </nav>
);

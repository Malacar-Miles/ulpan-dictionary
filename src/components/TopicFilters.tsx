type TopicFiltersProps = {
  topics: string[];
  activeTopic: string;
  emphasizeActiveTopic: boolean;
  onSelect: (topic: string) => void;
};
export const TopicFilters = ({
  topics,
  activeTopic,
  emphasizeActiveTopic,
  onSelect,
}: TopicFiltersProps) => (
  <nav
    className={`filters${emphasizeActiveTopic ? ' filters-search-active' : ''}`}
    aria-label="Фильтр по теме"
  >
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

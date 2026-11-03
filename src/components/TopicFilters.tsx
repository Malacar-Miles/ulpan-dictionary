import type { Topic } from '../types';
import { useLocale } from '../localization/context';
type TopicFiltersProps = {
  topics: Topic[];
  activeTopic: string;
  emphasizeActiveTopic: boolean;
  onSelect: (topic: string) => void;
};
export const TopicFilters = ({
  topics,
  activeTopic,
  emphasizeActiveTopic,
  onSelect,
}: TopicFiltersProps) => {
  const { messages } = useLocale();
  return (
    <nav
      className={`filters${emphasizeActiveTopic ? ' filters-search-active' : ''}`}
      aria-label={messages.topicFilter}
    >
      {topics.map(({ id, title }) => (
        <button
          key={id}
          type="button"
          className={activeTopic === id ? 'active' : ''}
          aria-pressed={activeTopic === id}
          onClick={() => onSelect(id)}
        >
          {title}
        </button>
      ))}
    </nav>
  );
};

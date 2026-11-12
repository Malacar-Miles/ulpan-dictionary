import type { Topic } from '../types';
import { useLocale } from '../localization/context';
import { Collapse } from './Collapse';
import { useCollapse } from '../hooks/useCollapse';

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
  const { isOpen, panelId, buttonRef, panelRef, toggle, close } = useCollapse();
  return (
    <nav
      className={`filters${emphasizeActiveTopic ? ' filters-search-active' : ''}`}
      aria-label={messages.topicFilter}
    >
      <button
        type="button"
        className="topic-trigger"
        ref={buttonRef}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={toggle}
      >
        {topics.find(({ id }) => id === activeTopic)?.title ?? messages.allTopics}
      </button>
      <Collapse isOpen={isOpen} panelId={panelId} panelRef={panelRef} close={close}>
        <div className="topic-options">
          {topics.map(({ id, title }) => (
            <button
              key={id}
              type="button"
              aria-pressed={activeTopic === id}
              onClick={() => {
                onSelect(id);
                close();
              }}
            >
              {title}
            </button>
          ))}
        </div>
      </Collapse>
    </nav>
  );
};

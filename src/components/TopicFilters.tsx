import buttonStyles from './Button.module.css';
import styles from './TopicFilters.module.css';
import { useSyncExternalStore } from 'react';
import { ALL_TOPICS } from '../helpers/dictionary';
import type { Topic } from '../types';
import { useLocale } from '../localization/context';
import { Collapse } from './Collapse';
import { useCollapse } from '../hooks/useCollapse';

const compactTabsQuery = '(max-width: 750px)';
const hasCompactTabs = () => window.matchMedia(compactTabsQuery).matches;
const subscribeToTabSize = (notify: () => void) => {
  const media = window.matchMedia(compactTabsQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

type TopicFiltersProps = {
  topics: Topic[];
  activeTopic: string | null;
  selectedTopic: string;
  emphasizeActiveTopic: boolean;
  onSelect: (topic: string | null) => void;
};
export const TopicFilters = ({
  topics,
  activeTopic,
  selectedTopic,
  emphasizeActiveTopic,
  onSelect,
}: TopicFiltersProps) => {
  const compact = useSyncExternalStore(subscribeToTabSize, hasCompactTabs);
  const { messages } = useLocale();
  const { isOpen, panelId, buttonRef, panelRef, toggle, close } = useCollapse();
  return (
    <nav
      className={
        styles['filters'] + (emphasizeActiveTopic ? ' ' + styles['filters-search-active'] : '')
      }
      aria-label={messages.dictionaryViews}
    >
      <div className={styles['filter-tabs']}>
        <button
          type="button"
          className={buttonStyles['button'] + ' ' + styles['topic-trigger']}
          aria-pressed={activeTopic !== null}
          data-topic-trigger
          ref={buttonRef}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => {
            if (activeTopic === null) onSelect(compact ? ALL_TOPICS : selectedTopic);
            toggle();
          }}
        >
          {compact
            ? messages.byTopicShort
            : (topics.find(({ id }) => id === selectedTopic)?.title ?? messages.allTopics)}
        </button>
        <button
          className={buttonStyles['button']}
          type="button"
          aria-pressed={activeTopic === null}
          onClick={() => {
            close();
            onSelect(null);
          }}
        >
          {compact ? messages.byDateShort : messages.byDateAdded}
        </button>
      </div>
      <Collapse isOpen={isOpen} panelId={panelId} panelRef={panelRef} close={close}>
        <div className={styles['topic-options']}>
          {topics.map(({ id, title }) => (
            <button
              className={buttonStyles['button']}
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

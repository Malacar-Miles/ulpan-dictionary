import { DisplayControls } from './DisplayControls';
import type { Topic } from '../types';
import { useLocale } from '../localization/context';
import type { ChangeEventHandler, PointerEventHandler, RefObject } from 'react';
import { SearchField } from './SearchField';
import { TopicFilters } from './TopicFilters';
import { ALL_TOPICS } from '../helpers/dictionary';

type DictionaryControlsProps = {
  controlsRef: RefObject<HTMLDivElement | null>;
  onPointerDownCapture: PointerEventHandler<HTMLDivElement>;
  query: string;
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
  onQueryClear: () => void;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  handwriting: boolean;
  onHandwritingChange: ChangeEventHandler<HTMLInputElement>;
  showNiqqud: boolean;
  onNiqqudChange: ChangeEventHandler<HTMLInputElement>;
  total: number;
  updated: string;
  topics: Topic[];
  activeTopic: string;
  onTopicSelect: (topic: string) => void;
};
export const DictionaryControls = ({
  controlsRef,
  onPointerDownCapture,
  query,
  onQueryChange,
  onQueryClear,
  onSearchFocus,
  onSearchBlur,
  handwriting,
  onHandwritingChange,
  showNiqqud,
  onNiqqudChange,
  total,
  updated,
  topics,
  activeTopic,
  onTopicSelect,
}: DictionaryControlsProps) => {
  const { messages } = useLocale();
  return (
    <div className="sticky-controls" ref={controlsRef} onPointerDownCapture={onPointerDownCapture}>
      <div className="wrap">
        <SearchField
          query={query}
          onChange={onQueryChange}
          onClear={onQueryClear}
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
        />
        <DisplayControls
          showNiqqud={showNiqqud}
          onNiqqudChange={onNiqqudChange}
          handwriting={handwriting}
          onHandwritingChange={onHandwritingChange}
        />
        <div className="filters-head">
          <span>{messages.topics}</span>
          <span>{messages.records(total, updated)}</span>
        </div>
        <TopicFilters
          topics={topics}
          activeTopic={activeTopic}
          emphasizeActiveTopic={query.trim().length > 0 && activeTopic !== ALL_TOPICS}
          onSelect={onTopicSelect}
        />
      </div>
    </div>
  );
};

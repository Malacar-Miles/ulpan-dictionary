import { DisplayControls } from './DisplayControls';
import type { Topic } from '../types';
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
  topics,
  activeTopic,
  onTopicSelect,
}: DictionaryControlsProps) => {
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

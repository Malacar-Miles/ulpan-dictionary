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
  handwriting: boolean;
  onHandwritingChange: ChangeEventHandler<HTMLInputElement>;
  showNiqqud: boolean;
  onNiqqudChange: ChangeEventHandler<HTMLInputElement>;
  topics: Topic[];
  activeTopic: string | null;
  selectedTopic: string;
  onTopicSelect: (topic: string | null) => void;
};
export const DictionaryControls = ({
  controlsRef,
  onPointerDownCapture,
  query,
  onQueryChange,
  onQueryClear,
  handwriting,
  onHandwritingChange,
  showNiqqud,
  onNiqqudChange,
  topics,
  activeTopic,
  selectedTopic,
  onTopicSelect,
}: DictionaryControlsProps) => {
  return (
    <div className="sticky-controls" ref={controlsRef} onPointerDownCapture={onPointerDownCapture}>
      <div className="wrap">
        <SearchField query={query} onChange={onQueryChange} onClear={onQueryClear} />
        <DisplayControls
          showNiqqud={showNiqqud}
          onNiqqudChange={onNiqqudChange}
          handwriting={handwriting}
          onHandwritingChange={onHandwritingChange}
        />
        <TopicFilters
          topics={topics}
          activeTopic={activeTopic}
          selectedTopic={selectedTopic}
          emphasizeActiveTopic={
            query.trim().length > 0 && activeTopic !== null && activeTopic !== ALL_TOPICS
          }
          onSelect={onTopicSelect}
        />
      </div>
    </div>
  );
};

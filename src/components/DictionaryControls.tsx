import type { ChangeEventHandler, PointerEventHandler, RefObject } from 'react';
import { SearchField } from './SearchField';
import { NiqqudToggle } from './NiqqudToggle';
import { TopicFilters } from './TopicFilters';

type DictionaryControlsProps = {
  controlsRef: RefObject<HTMLDivElement | null>;
  onPointerDownCapture: PointerEventHandler<HTMLDivElement>;
  query: string;
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
  onSearchFocus: () => void;
  onSearchBlur: () => void;
  showNiqqud: boolean;
  onNiqqudChange: ChangeEventHandler<HTMLInputElement>;
  total: number;
  updated: string;
  topics: string[];
  activeTopic: string;
  onTopicSelect: (topic: string) => void;
};
export const DictionaryControls = ({
  controlsRef,
  onPointerDownCapture,
  query,
  onQueryChange,
  onSearchFocus,
  onSearchBlur,
  showNiqqud,
  onNiqqudChange,
  total,
  updated,
  topics,
  activeTopic,
  onTopicSelect,
}: DictionaryControlsProps) => (
  <div className="sticky-controls" ref={controlsRef} onPointerDownCapture={onPointerDownCapture}>
    <div className="wrap">
      <SearchField
        query={query}
        onChange={onQueryChange}
        onFocus={onSearchFocus}
        onBlur={onSearchBlur}
      />
      <NiqqudToggle checked={showNiqqud} onChange={onNiqqudChange} />
      <div className="filters-head">
        <span>ТЕМЫ</span>
        <span>
          {total} записей в словаре, обновлено {updated}
        </span>
      </div>
      <TopicFilters topics={topics} activeTopic={activeTopic} onSelect={onTopicSelect} />
    </div>
  </div>
);

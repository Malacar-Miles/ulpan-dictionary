import { LanguageSwitcher } from './LanguageSwitcher';
import type { Topic } from '../types';
import { useLocale } from '../localization/context';
import type { ChangeEventHandler, PointerEventHandler, RefObject } from 'react';
import { SearchField } from './SearchField';
import { HandwritingToggle } from './HandwritingToggle';
import { NiqqudToggle } from './NiqqudToggle';
import { TopicFilters } from './TopicFilters';
import { ALL_TOPICS } from '../helpers/dictionary';

type DictionaryControlsProps = {
  controlsRef: RefObject<HTMLDivElement | null>;
  onPointerDownCapture: PointerEventHandler<HTMLDivElement>;
  query: string;
  onQueryChange: ChangeEventHandler<HTMLInputElement>;
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
          onFocus={onSearchFocus}
          onBlur={onSearchBlur}
        />
        <div className="niqqud-row">
          <LanguageSwitcher />
          <div className="display-toggles">
            <NiqqudToggle checked={showNiqqud} onChange={onNiqqudChange} />
            <HandwritingToggle checked={handwriting} onChange={onHandwritingChange} />
          </div>
        </div>
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

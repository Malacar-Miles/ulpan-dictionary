import { useSearchClear } from '../hooks/useSearchClear';
import { useSearchHintWidth } from '../hooks/useSearchHintWidth';
import { useLocale } from '../localization/context';
import type { ChangeEventHandler } from 'react';
type SearchFieldProps = {
  query: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onClear: () => void;
  onFocus: () => void;
  onBlur: () => void;
};
export const SearchField = ({ query, onChange, onClear, onFocus, onBlur }: SearchFieldProps) => {
  const { messages } = useLocale();
  const { inputRef, preserveInputFocus, clear } = useSearchClear(onClear);
  const { wrapperRef, hintRef } = useSearchHintWidth();
  return (
    <div className={`search-wrap${query ? ' has-query' : ''}`} ref={wrapperRef}>
      <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
        <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <label className="sr-only" htmlFor="search">
        {messages.searchLabel}
      </label>
      <input
        ref={inputRef}
        id="search"
        type="search"
        placeholder={messages.searchPlaceholder}
        value={query}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        autoComplete="off"
        enterKeyHint="done"
      />
      <span className="search-hint" ref={hintRef} hidden={Boolean(query)}>
        {messages.searchHint}
      </span>
      {query && (
        <button
          type="button"
          className="search-clear"
          aria-label={messages.clearSearch}
          onPointerDown={preserveInputFocus}
          onClick={clear}
        >
          <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="currentColor" />
            <path d="m9 9 6 6m0-6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
};

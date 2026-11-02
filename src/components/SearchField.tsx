import type { ChangeEventHandler } from 'react';
type SearchFieldProps = {
  query: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onFocus: () => void;
  onBlur: () => void;
};
export const SearchField = ({ query, onChange, onFocus, onBlur }: SearchFieldProps) => (
  <div className="search-wrap">
    <svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none">
      <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
    <label className="sr-only" htmlFor="search">
      Поиск по словарю
    </label>
    <input
      id="search"
      type="search"
      placeholder="Поиск на русском или иврите"
      value={query}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      autoComplete="off"
      enterKeyHint="done"
    />
    <span className="search-hint">ИВРИТ · ПРОИЗНОШЕНИЕ · ПЕРЕВОД</span>
  </div>
);

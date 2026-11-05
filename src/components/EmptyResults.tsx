import { useLocale } from '../localization/context';
type EmptyResultsProps = { hasActiveFilter: boolean; onReset: () => void };
export const EmptyResults = ({ hasActiveFilter, onReset }: EmptyResultsProps) => {
  const { messages } = useLocale();
  return (
    <div className="empty">
      <span>א</span>
      <h3>
        {messages.emptyTitle}
        {hasActiveFilter && (
          <>
            {', '}
            <span className="empty-filter-notice">{messages.emptyFilterNotice}</span>
          </>
        )}
      </h3>
      <p>{messages.emptyHint}</p>
      <button onClick={onReset}>
        {hasActiveFilter ? messages.resetFilter : messages.resetSearch}
      </button>
    </div>
  );
};

import { useLocale } from '../localization/context';
type EmptyResultsProps = { onReset: () => void };
export const EmptyResults = ({ onReset }: EmptyResultsProps) => {
  const { messages } = useLocale();
  return (
    <div className="empty">
      <span>א</span>
      <h3>{messages.emptyTitle}</h3>
      <p>{messages.emptyHint}</p>
      <button onClick={onReset}>{messages.reset}</button>
    </div>
  );
};

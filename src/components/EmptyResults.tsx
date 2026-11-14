import buttonStyles from './Button.module.css';
import styles from './EmptyResults.module.css';
import { useLocale } from '../localization/context';
type EmptyResultsProps = { onReset: () => void };
export const EmptyResults = ({ onReset }: EmptyResultsProps) => {
  const { messages } = useLocale();
  return (
    <div className={styles['empty']}>
      <span>א</span>
      <h3>{messages.emptyTitle}</h3>
      <p>{messages.emptyHint}</p>
      <button className={buttonStyles['button']} onClick={onReset}>
        {messages.resetSearch}
      </button>
    </div>
  );
};

import layoutStyles from '../Layout.module.css';
import styles from './DictionaryHeader.module.css';
import { useLocale } from '../localization/context';
export const DictionaryHeader = ({ disabled = false }: { disabled?: boolean }) => {
  const { messages } = useLocale();
  return (
    <header id="top" className={styles['header']} inert={disabled}>
      <div className={layoutStyles['wrap']}>
        <div className={styles['topline']}>
          <a className={styles['brand']} href="#top" aria-label={messages.backToTop}>
            <span className={styles['brand-icon']} aria-hidden="true">
              א
            </span>
            <span>
              {messages.brand} <i> / </i> {messages.dictionary}
            </span>
          </a>
        </div>
        <div className={styles['heading']}>
          <p className={styles['intro-text']}>{messages.introduction}</p>
        </div>
      </div>
    </header>
  );
};

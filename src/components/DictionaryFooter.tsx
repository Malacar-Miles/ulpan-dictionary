import styles from './DictionaryFooter.module.css';
import { useLocale } from '../localization/context';
type DictionaryFooterProps = { intro: string };
export const DictionaryFooter = ({ intro }: DictionaryFooterProps) => {
  const { messages } = useLocale();
  return (
    <footer className={styles['footer']}>
      <span>{messages.footer}</span>
      <p>{intro}</p>
    </footer>
  );
};

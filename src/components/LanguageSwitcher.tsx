import styles from './LanguageSwitcher.module.css';
import type { Locale } from '../localization/catalogs';
import { useLocale } from '../localization/context';

type LanguageSwitcherProps = { onSelect: (locale: Locale) => void };

export const LanguageSwitcher = ({ onSelect }: LanguageSwitcherProps) => {
  const { locale, messages } = useLocale();
  return (
    <div className={styles['language-switcher']} role="group" aria-label={messages.language}>
      <button type="button" lang="ru" aria-pressed={locale === 'ru'} onClick={() => onSelect('ru')}>
        Русский
      </button>
      <button type="button" lang="es" aria-pressed={locale === 'es'} onClick={() => onSelect('es')}>
        Español
      </button>
    </div>
  );
};

import { useLocale } from '../localization/context';

export const LanguageSwitcher = () => {
  const { locale, setLocale, messages } = useLocale();
  return (
    <div className="language-switcher" role="group" aria-label={messages.language}>
      <button
        type="button"
        lang="ru"
        aria-pressed={locale === 'ru'}
        onClick={() => setLocale('ru')}
      >
        Русский
      </button>
      <button
        type="button"
        lang="es"
        aria-pressed={locale === 'es'}
        onClick={() => setLocale('es')}
      >
        Español
      </button>
    </div>
  );
};

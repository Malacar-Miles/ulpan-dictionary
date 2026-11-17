import { useEffect, useId, useState, type ReactNode } from 'react';
import { useLocale } from '../localization/context';
import styles from './TranslationBlur.module.css';

export const TranslationBlur = ({ children }: { children: ReactNode }) => {
  const [revealed, setRevealed] = useState(false);
  const id = useId();
  const { messages } = useLocale();

  useEffect(() => {
    if (!revealed) return;
    const timeout = window.setTimeout(() => setRevealed(false), 5000);
    return () => window.clearTimeout(timeout);
  }, [revealed]);

  return (
    <span
      data-translation-blur
      className={styles.container}
      onClick={(event) => event.stopPropagation()}
    >
      <span id={id} aria-hidden={!revealed}>
        {children}
      </span>
      <button
        type="button"
        className={styles.cover}
        aria-label={messages.revealTranslation}
        aria-controls={id}
        aria-expanded={revealed}
        onClick={() => setRevealed(true)}
      />
    </span>
  );
};

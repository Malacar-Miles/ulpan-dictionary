import { useId, useRef } from 'react';
import { Collapse } from './Collapse';
import { PrintIcon } from './PrintIcon';
import { useLocale } from '../localization/context';
import styles from './PrintSelectionBar.module.css';

export const PrintSelectionBar = ({
  count,
  onPrint,
  onClear,
}: {
  count: number;
  onPrint: () => void;
  onClear: () => void;
}) => {
  const { messages } = useLocale();
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  return (
    <Collapse isOpen={count > 0} panelId={panelId} panelRef={panelRef}>
      <div className={styles['selection-bar']} data-print-selection>
        <span role="status">{messages.printSelected(count)}</span>
        <button
          type="button"
          aria-label={messages.printPreview}
          title={messages.printPreview}
          onClick={onPrint}
        >
          <PrintIcon />
        </button>
        <button
          type="button"
          aria-label={messages.clearPrintSelection}
          title={messages.clearPrintSelection}
          onClick={() => {
            // The bar becomes inert when the final selection is cleared.
            document
              .querySelector<HTMLButtonElement>('[data-topic-trigger]')
              ?.focus({ preventScroll: true });
            onClear();
          }}
        >
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="m8 8 8 8m0-8-8 8" />
          </svg>
        </button>
      </div>
    </Collapse>
  );
};

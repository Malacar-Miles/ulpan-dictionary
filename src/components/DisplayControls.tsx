import type { ChangeEventHandler } from 'react';
import { useCollapse } from '../hooks/useCollapse';
import { Collapse } from './Collapse';
import { useLocale } from '../localization/context';
import { LanguageSwitcher } from './LanguageSwitcher';
import { NiqqudToggle } from './NiqqudToggle';
import { HandwritingToggle } from './HandwritingToggle';

type DisplayControlsProps = {
  showNiqqud: boolean;
  onNiqqudChange: ChangeEventHandler<HTMLInputElement>;
  handwriting: boolean;
  onHandwritingChange: ChangeEventHandler<HTMLInputElement>;
};

export const DisplayControls = ({
  showNiqqud,
  onNiqqudChange,
  handwriting,
  onHandwritingChange,
}: DisplayControlsProps) => {
  const { messages, setLocale } = useLocale();
  const { isOpen, panelId, buttonRef, panelRef, toggle, close } = useCollapse();
  return (
    <>
      <div className="niqqud-row">
        <div className="display-toggles">
          <NiqqudToggle checked={showNiqqud} onChange={onNiqqudChange} />
          <HandwritingToggle checked={handwriting} onChange={onHandwritingChange} />
        </div>
        <button
          className="language-menu-button"
          type="button"
          ref={buttonRef}
          aria-label={messages.language}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
        >
          <svg
            aria-hidden="true"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="12" cy="12" r="9" />
            <ellipse cx="12" cy="12" rx="4" ry="9" />
            <path d="M3 12h18" />
          </svg>
        </button>
      </div>
      <Collapse isOpen={isOpen} panelId={panelId} panelRef={panelRef} close={close}>
        <div className="language-options">
          <LanguageSwitcher
            onSelect={(locale) => {
              setLocale(locale);
              close();
            }}
          />
        </div>
      </Collapse>
    </>
  );
};

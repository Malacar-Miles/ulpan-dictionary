import displayControlsStyles from './DisplayControls.module.css';
import { useLocale } from '../localization/context';
import type { ChangeEventHandler } from 'react';
type NiqqudToggleProps = { checked: boolean; onChange: ChangeEventHandler<HTMLInputElement> };
export const NiqqudToggle = ({ checked, onChange }: NiqqudToggleProps) => {
  const { messages } = useLocale();
  return (
    <label data-preserve-search-focus className={displayControlsStyles['niqqud-toggle']}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{messages.niqqud}</span>
    </label>
  );
};

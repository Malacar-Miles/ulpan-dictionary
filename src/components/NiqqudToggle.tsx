import { useLocale } from '../localization/context';
import type { ChangeEventHandler } from 'react';
type NiqqudToggleProps = { checked: boolean; onChange: ChangeEventHandler<HTMLInputElement> };
export const NiqqudToggle = ({ checked, onChange }: NiqqudToggleProps) => {
  const { messages } = useLocale();
  return (
    <label className="niqqud-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{messages.niqqud}</span>
    </label>
  );
};

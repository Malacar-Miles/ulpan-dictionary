import { useLocale } from '../localization/context';
import type { ChangeEventHandler } from 'react';

type HandwritingToggleProps = {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const HandwritingToggle = ({ checked, onChange }: HandwritingToggleProps) => {
  const { messages } = useLocale();
  return (
    <label className="handwriting-toggle">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span>{messages.handwriting}</span>
    </label>
  );
};

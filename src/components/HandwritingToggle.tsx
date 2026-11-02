import type { ChangeEventHandler } from 'react';

type HandwritingToggleProps = {
  checked: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
};

export const HandwritingToggle = ({ checked, onChange }: HandwritingToggleProps) => (
  <label className="handwriting-toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>Рукописный шрифт</span>
  </label>
);

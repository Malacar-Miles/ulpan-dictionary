import type { ChangeEventHandler } from 'react';
type NiqqudToggleProps = { checked: boolean; onChange: ChangeEventHandler<HTMLInputElement> };
export const NiqqudToggle = ({ checked, onChange }: NiqqudToggleProps) => (
  <label className="niqqud-toggle">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span>С никудом</span>
  </label>
);

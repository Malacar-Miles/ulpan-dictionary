import type { ReactNode } from 'react';

type CollapseSwapProps = {
  id: string;
  open: boolean;
  summary: ReactNode;
  children: ReactNode;
};

export const CollapseSwap = ({ id, open, summary, children }: CollapseSwapProps) => (
  <div id={id} className="collapse-swap">
    {[
      { active: !open, content: summary },
      { active: open, content: children },
    ].map(({ active, content }, index) => (
      <div
        key={index}
        className={'collapse-swap-panel' + (active ? ' is-active' : '')}
        aria-hidden={!active}
        inert={!active}
      >
        <div className="collapse-swap-content">{content}</div>
      </div>
    ))}
  </div>
);

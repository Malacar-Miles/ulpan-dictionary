import styles from './CollapseSwap.module.css';
import type { ReactNode } from 'react';

type CollapseSwapProps = {
  id: string;
  open: boolean;
  summary: ReactNode;
  children: ReactNode;
};

export const CollapseSwap = ({ id, open, summary, children }: CollapseSwapProps) => (
  <div id={id}>
    {[
      { active: !open, content: summary },
      { active: open, content: children },
    ].map(({ active, content }, index) => (
      <div
        key={index}
        className={styles['collapse-swap-panel'] + (active ? ' ' + styles['is-active'] : '')}
        aria-hidden={!active}
        inert={!active}
      >
        <div className={styles['collapse-swap-content']}>{content}</div>
      </div>
    ))}
  </div>
);

import styles from './Collapse.module.css';
import type { ReactNode } from 'react';
import type { useCollapse } from '../hooks/useCollapse';

type CollapseProps = Pick<
  ReturnType<typeof useCollapse>,
  'isOpen' | 'panelId' | 'panelRef' | 'close'
> & { children: ReactNode };

export const Collapse = ({ isOpen, panelId, panelRef, close, children }: CollapseProps) => (
  <div
    id={panelId}
    ref={panelRef}
    className={isOpen ? styles['collapse'] + ' ' + styles['is-open'] : styles['collapse']}
    aria-hidden={!isOpen}
    inert={!isOpen}
    onKeyDown={(event) => {
      if (event.key === 'Escape') close();
    }}
  >
    <div className={styles['collapse-content']}>{children}</div>
  </div>
);

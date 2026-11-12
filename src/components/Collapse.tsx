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
    className={isOpen ? 'collapse is-open' : 'collapse'}
    aria-hidden={!isOpen}
    inert={!isOpen}
    onKeyDown={(event) => {
      if (event.key === 'Escape') close();
    }}
  >
    <div className="collapse-content">{children}</div>
  </div>
);

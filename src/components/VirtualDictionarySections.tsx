import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer, useWindowVirtualizer } from '@tanstack/react-virtual';
import { isIPhone } from '../useSearchViewport';
import type { DictionaryEntry, DictionarySection } from '../types';
import { EntryGrid, SectionHeading, type SectionListProps } from './DictionarySection';

type Row =
  | { key: string; section: DictionarySection }
  | { key: string; entries: DictionaryEntry[]; last: boolean };

const buildRows = (sections: DictionarySection[], columns: number) => {
  const rows: Row[] = [];
  for (const section of sections) {
    rows.push({ key: 'heading-' + section.id, section });
    for (let i = 0; i < section.entries.length; i += columns) {
      const entries = section.entries.slice(i, i + columns);
      rows.push({
        key: 'cards-' + entries.map((entry) => entry.id).join('/'),
        entries,
        last: i + columns >= section.entries.length,
      });
    }
  }
  return rows;
};

export const VirtualDictionarySections = ({ sections, ...display }: SectionListProps) => {
  const list = useRef<HTMLDivElement>(null);
  const inPane = isIPhone();
  const [columns, setColumns] = useState(3);
  const [scrollMargin, setScrollMargin] = useState(0);

  useLayoutEffect(() => {
    const element = list.current!;
    const main = element.closest('main')!;
    const update = () => {
      setColumns(Number(getComputedStyle(element).getPropertyValue('--card-columns')) || 3);
      const top = element.getBoundingClientRect().top;
      setScrollMargin(
        inPane ? top - main.getBoundingClientRect().top + main.scrollTop : top + window.scrollY,
      );
    };
    update();
    // Controls, fonts and the fallback notice can move the list without a window resize.
    const observer = new ResizeObserver(update);
    for (const sibling of [...main.parentElement!.children, ...main.children]) {
      observer.observe(sibling);
    }
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [inPane, sections]);

  const rows = useMemo(() => buildRows(sections, columns), [sections, columns]);
  const getItemKey = useCallback((index: number) => rows[index].key, [rows]);
  const options = {
    count: rows.length,
    getItemKey,
    estimateSize: (index: number) => ('section' in rows[index] ? 54 : 180),
    overscan: 4,
    scrollMargin,
  };
  const page = useWindowVirtualizer<HTMLDivElement>({ ...options, enabled: !inPane });
  // eslint-disable-next-line react-hooks/incompatible-library -- Read the mutable instance during render.
  const pane = useVirtualizer<HTMLElement, HTMLDivElement>({
    ...options,
    enabled: inPane,
    getScrollElement: () => list.current?.closest('main') ?? null,
  });
  const virtualizer = inPane ? pane : page;

  return (
    <div className="virtual-sections" ref={list} style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((item) => {
        const row = rows[item.index];
        const spacing =
          'section' in row ? '' : row.last ? ' virtual-section-end' : ' virtual-card-row';
        return (
          <div
            key={item.key}
            data-index={item.index}
            ref={virtualizer.measureElement}
            className={'virtual-row' + spacing}
            style={{ transform: `translateY(${item.start - scrollMargin}px)` }}
          >
            {'section' in row ? (
              <SectionHeading section={row.section} />
            ) : (
              <EntryGrid entries={row.entries} {...display} />
            )}
          </div>
        );
      })}
    </div>
  );
};

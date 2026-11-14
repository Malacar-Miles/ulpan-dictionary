import { useCallback, useMemo, useState } from 'react';
import type { DictionarySection } from '../types';

export type PrintSelectionProps = {
  selectedIds: ReadonlySet<string>;
  onToggleCard: (id: string) => void;
  onToggleSection: (ids: string[]) => void;
};

export const usePrintSelection = (sections: DictionarySection[]) => {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(() => new Set());
  const onToggleCard = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);
  const onToggleSection = useCallback((ids: string[]) => {
    setSelectedIds((current) => {
      const remove = ids.every((id) => current.has(id));
      const next = new Set(current);
      ids.forEach((id) => {
        if (remove) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }, []);
  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);
  const selectedEntries = useMemo(
    () =>
      sections.flatMap((section) => section.entries).filter((entry) => selectedIds.has(entry.id)),
    [sections, selectedIds],
  );
  return { selectedIds, selectedEntries, onToggleCard, onToggleSection, clearSelection };
};

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DictionaryEntry, FormRow } from '../types';
import { useLocale } from '../localization/context';
import { buildPrintRows } from '../helpers/printLayout';
import { NiqqudToggle } from './NiqqudToggle';
import { HandwritingToggle } from './HandwritingToggle';
import { PrintIcon } from './PrintIcon';
import './PrintPreview.css';

export const PrintPreview = ({
  entries,
  initialNiqqud,
  initialHandwriting,
  onClose,
}: {
  entries: DictionaryEntry[];
  initialNiqqud: boolean;
  initialHandwriting: boolean;
  onClose: () => void;
}) => {
  const { locale, messages } = useLocale();
  const titleId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const [niqqud, setNiqqud] = useState(initialNiqqud);
  const [handwriting, setHandwriting] = useState(initialHandwriting);
  const [expanded, setExpanded] = useState(false);
  const [fontStatus, setFontStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [fontAttempt, setFontAttempt] = useState(0);
  const hasExpandable = entries.some((entry) => entry.rows.length > 1);
  const rows = buildPrintRows(entries, expanded);

  useLayoutEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);

  useEffect(() => {
    let active = true;
    const prepare = async () => {
      try {
        if (handwriting) await document.fonts.load('16px "Gveret Levin"', 'שָׁלוֹם');
        await document.fonts.ready;
        if (active) setFontStatus('ready');
      } catch {
        if (active) setFontStatus('error');
      }
    };
    void prepare();
    return () => {
      active = false;
    };
  }, [handwriting, fontAttempt]);

  const hebrew = (row: FormRow) => (niqqud ? (row.hebrewWithNiqqud ?? row.hebrew) : row.hebrew);
  return createPortal(
    <dialog
      className="print-preview"
      ref={dialog}
      lang={locale}
      dir="ltr"
      aria-labelledby={titleId}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="print-preview-controls">
        <div className="print-preview-toolbar">
          <h2 id={titleId}>{messages.printPreview}</h2>
          <button type="button" onClick={onClose}>
            {messages.printClose}
          </button>
        </div>
        <div className="print-preview-settings">
          <NiqqudToggle checked={niqqud} onChange={(event) => setNiqqud(event.target.checked)} />
          <HandwritingToggle
            checked={handwriting}
            onChange={(event) => {
              setFontStatus('loading');
              setHandwriting(event.target.checked);
            }}
          />
          {hasExpandable && (
            <label>
              <input
                type="checkbox"
                checked={expanded}
                onChange={(event) => setExpanded(event.target.checked)}
              />{' '}
              {messages.printExpand}
            </label>
          )}
        </div>
        <div className="print-preview-toolbar">
          <span>{messages.printSelected(entries.length)}</span>
          <button
            className="print-preview-print"
            type="button"
            disabled={fontStatus !== 'ready' || !entries.length}
            onClick={() => window.print()}
          >
            <PrintIcon /> {messages.printAction}
          </button>
        </div>
        <p className="print-preview-hint">{messages.printHint}</p>
        {fontStatus === 'loading' && <p role="status">{messages.printFontsLoading}</p>}
        {fontStatus === 'error' && (
          <div role="alert">
            {messages.printFontsError}{' '}
            <button
              type="button"
              onClick={() => {
                setFontStatus('loading');
                setFontAttempt((attempt) => attempt + 1);
              }}
            >
              {messages.retry}
            </button>
          </div>
        )}
      </div>
      <div className="print-preview-scroll">
        <div className={'print-sheet' + (handwriting ? ' print-handwritten' : '')}>
          {rows.map((row) => (
            <div
              className="print-card-row"
              data-dense={expanded && row.some((entry) => entry.rows.length > 8)}
              key={row[0].id}
            >
              {row.map((entry) => {
                const detailed = expanded && entry.rows.length > 1;
                return (
                  <article
                    className="print-card"
                    key={entry.id}
                    data-print-card={entry.id}
                    data-expanded={detailed}
                  >
                    {detailed && entry.root !== undefined && (
                      <p className="print-card-root">
                        {messages.root}{' '}
                        {entry.root === null ? (
                          messages.rootUnlisted
                        ) : (
                          <bdi lang="he" dir="rtl">
                            {entry.root}
                          </bdi>
                        )}
                      </p>
                    )}
                    {(detailed ? entry.rows : [entry.defaultRow]).map((form) => (
                      <div className="print-card-form" key={form.key}>
                        <div className="print-card-hebrew" lang="he" dir="rtl">
                          {hebrew(form)}
                        </div>
                        <p className="print-card-pronunciation" dir="ltr">
                          {form.pronunciation}
                        </p>
                        {detailed && (
                          <p className="print-card-grammar" dir="ltr">
                            {form.label}
                            {form.gloss && <> · {form.gloss}</>}
                          </p>
                        )}
                      </div>
                    ))}
                    <p className="print-card-meaning" dir="ltr">
                      {entry.meaning}
                    </p>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </dialog>,
    document.body,
  );
};

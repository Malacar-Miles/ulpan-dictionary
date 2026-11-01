import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import dictionary from './dictionary.json';
import './style.css';

import { highlightRanges, matches } from './search';

function Highlight({ text, query }: { text: string; query: string }) {
  const ranges = highlightRanges(text, query);
  let previous = 0;
  const nodes: React.ReactNode[] = [];
  ranges.forEach(({ start, end }) => {
    nodes.push(text.slice(previous, start), <mark key={start}>{text.slice(start, end)}</mark>);
    previous = end;
  });
  nodes.push(text.slice(previous));
  return <>{nodes}</>;
}

type Entry = { hebrew: string; hebrewWithNiqqud?: string; pronunciation: string; meaning: string };
const sections = dictionary.sections as Array<{ title: string; note: string; entries: Entry[] }>;

function Card({ entry, query, showNiqqud }: { entry: Entry; query: string; showNiqqud: boolean }) {
  const visible = showNiqqud && entry.hebrewWithNiqqud ? entry.hebrewWithNiqqud : entry.hebrew;
  const alternate = showNiqqud ? entry.hebrew : entry.hebrewWithNiqqud;
  const showAlternate = alternate && highlightRanges(alternate, query).length > 0 && highlightRanges(visible, query).length === 0;
  return <article className="card">
    <div className="card-top"><span className="hebrew" lang="he" dir="rtl"><Highlight text={visible} query={query}/></span></div>
    {showAlternate && <p className="alternate-spelling"><span>{showNiqqud ? 'Без никуд:' : 'С никудом:'}</span> <b lang="he" dir="rtl"><Highlight text={alternate} query={query}/></b></p>}
    <p className="pronunciation"><Highlight text={entry.pronunciation} query={query}/></p><div className="card-rule"/><p className="meaning"><Highlight text={entry.meaning} query={query}/></p>
  </article>;
}

const storageKey = 'ulpan-dictionary-show-niqqud';

function App() {
  const controlsRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const controls = controlsRef.current;
    const content = contentRef.current;
    if (!controls || !content) return;
    const updateHeight = () => content.style.setProperty('--controls-height', `${controls.getBoundingClientRect().height}px`);
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(controls);
    return () => observer.disconnect();
  }, []);
  const [showNiqqud, setShowNiqqud] = useState(() => {
    try { return localStorage.getItem(storageKey) !== 'false'; } catch { return true; }
  });
  useEffect(() => { try { localStorage.setItem(storageKey, String(showNiqqud)); } catch { /* Настройка работает и без доступа к хранилищу. */ } }, [showNiqqud]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('Все темы');
  const results = useMemo(() => {
    return sections.filter(section => active === 'Все темы' || section.title === active).map(section => ({
      ...section,
      entries: section.entries.filter(entry => {
        return matches([entry.hebrew, entry.hebrewWithNiqqud ?? '', entry.pronunciation, entry.meaning], query);
      }),
    })).filter(section => section.entries.length > 0);
  }, [query, active]);
  const count = results.reduce((sum, section) => sum + section.entries.length, 0);
  const total = sections.reduce((sum, section) => sum + section.entries.length, 0);
  const updated = new Intl.DateTimeFormat('ru-RU', {day:'numeric', month:'long', year:'numeric', timeZone:'UTC'}).format(new Date(`${dictionary.updatedAt}T00:00:00Z`));
  return <>
    <header className="header"><div className="wrap">
      <div className="topline"><a className="brand" href="#top" aria-label="Словарь ульпана, наверх"><span className="brand-icon" aria-hidden="true">א</span><span>УЛЬПАН <i> / </i> СЛОВАРЬ</span></a></div>
      <div className="heading"><p className="intro-text">Здесь собраны слова, которые наша группа проходила на занятиях или в упражнениях из домашнего задания. Я добавляю их вручную после каждого занятия, поэтому каких-то слов может не хватать. Просьба писать мне об ошибках в словах и любых проблемах с сайтом.</p></div>
    </div></header>
    <div className="sticky-controls" ref={controlsRef}><div className="wrap">
      <div className="search-wrap"><svg aria-hidden="true" width="21" height="21" viewBox="0 0 24 24" fill="none"><circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg><label className="sr-only" htmlFor="search">Поиск по словарю</label><input id="search" type="search" placeholder="Поиск на русском или иврите" value={query} onChange={e=>setQuery(e.target.value)} autoComplete="off"/><span className="search-hint">ИВРИТ · ПРОИЗНОШЕНИЕ · ПЕРЕВОД</span></div>
      <div className="niqqud-row"><label className="niqqud-toggle"><input type="checkbox" checked={showNiqqud} onChange={e => setShowNiqqud(e.target.checked)} /><span>С никудом</span></label></div>
      <div className="filters-head"><span>ТЕМЫ</span><span>{total} записей в словаре, обновлено {updated}</span></div>
      <nav className="filters" aria-label="Фильтр по теме">{['Все темы',...sections.map(s=>s.title)].map(title=><button key={title} type="button" className={active===title?'active':''} aria-pressed={active===title} onClick={()=>setActive(title)}>{title}</button>)}</nav>
    </div></div>
    <main id="top" className="wrap content" ref={contentRef}><div className="results-head"><div><p className="eyebrow"><span></span> СЛОВАРЬ</p><h2>{active==='Все темы'?'Все слова':active}</h2></div><p aria-live="polite">Найдено: <strong>{count}</strong></p></div>
      {results.length ? results.map(section=><section className="section" key={section.title}><div className="section-title"><h3>{section.title}</h3><span>{section.entries.length}</span><div/></div>{section.note && <p className="section-note">{section.note}</p>}<div className="grid">{section.entries.map((entry,i)=><Card key={`${entry.hebrew}-${i}`} entry={entry} query={query} showNiqqud={showNiqqud}/>)}</div></section>) : <div className="empty"><span>א</span><h3>Ничего не нашлось</h3><p>Попробуй изменить запрос или выбрать другую тему.</p><button onClick={()=>{setQuery('');setActive('Все темы')}}>Сбросить поиск и фильтр</button></div>}
      <footer><span>СЛОВАРЬ УЛЬПАНА</span><p>{dictionary.intro}</p></footer>
    </main>
  </>;
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>);

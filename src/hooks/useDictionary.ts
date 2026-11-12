import { useCallback, useDeferredValue, useMemo, useState, type ChangeEvent } from 'react';
import dictionary from '../dictionary.json';
import {
  ALL_TOPICS,
  localizeSections,
  filterSections,
  countEntries,
  formatUpdatedDate,
} from '../helpers/dictionary';
import { useLocale } from '../localization/context';
import { useNiqqudPreference } from './useNiqqudPreference';

export const useDictionary = () => {
  const { locale, messages } = useLocale();
  const sections = useMemo(() => localizeSections(locale), [locale]);
  const { showNiqqud, setShowNiqqud } = useNiqqudPreference();
  const [query, setQuery] = useState('');
  const resultsQuery = useDeferredValue(query);
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS);
  const { results, showFallbackNotice } = useMemo(() => {
    const matches = filterSections(resultsQuery, activeTopic, locale);
    if (matches.length || activeTopic === ALL_TOPICS || !resultsQuery.trim()) {
      return { results: matches, showFallbackNotice: false };
    }
    const allMatches = filterSections(resultsQuery, ALL_TOPICS, locale);
    return { results: allMatches, showFallbackNotice: allMatches.length > 0 };
  }, [resultsQuery, activeTopic, locale]);
  const clearQuery = useCallback(() => setQuery(''), []);
  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const changeNiqqud = (event: ChangeEvent<HTMLInputElement>) =>
    setShowNiqqud(event.target.checked);

  return {
    query,
    resultsQuery,
    activeTopic,
    showFallbackNotice,
    showNiqqud,
    results,
    changeQuery,
    clearQuery,
    changeNiqqud,
    setActiveTopic,
    topics: [
      { id: ALL_TOPICS, title: messages.allTopics },
      ...sections.map(({ id, title }) => ({ id, title })),
    ],
    count: countEntries(results),
    total: countEntries(sections),
    updated: formatUpdatedDate(dictionary.updatedAt, locale),
    intro: dictionary.intro[locale],
    resultsTitle:
      showFallbackNotice || activeTopic === ALL_TOPICS
        ? messages.allWords
        : sections.find((section) => section.id === activeTopic)!.title,
  };
};

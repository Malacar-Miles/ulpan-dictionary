import { useCallback, useDeferredValue, useMemo, useState, type ChangeEvent } from 'react';
import { useDictionaryData } from './useDictionaryData';
import type { DictionarySection } from '../types';
import {
  ALL_TOPICS,
  filterSections,
  groupByDateAdded,
  countEntries,
  formatUpdatedDate,
} from '../helpers/dictionary';
import { useLocale } from '../localization/context';
import { useNiqqudPreference } from './useNiqqudPreference';

const emptySections: DictionarySection[] = [];

export const useDictionary = () => {
  const { locale, messages } = useLocale();
  const { snapshot, retry } = useDictionaryData(locale);
  const data = snapshot.status === 'ready' ? snapshot.data : undefined;
  const sections = data?.sections ?? emptySections;
  const { showNiqqud, setShowNiqqud } = useNiqqudPreference();
  const [query, setQuery] = useState('');
  const resultsQuery = useDeferredValue(query);
  const [selectedTopic, setSelectedTopic] = useState(ALL_TOPICS);
  const [byDate, setByDate] = useState(false);
  const activeTopic = byDate ? null : selectedTopic;
  const setActiveTopic = (topic: string | null) => {
    setByDate(topic === null);
    if (topic !== null) setSelectedTopic(topic);
  };
  const { results, showFallbackNotice } = useMemo(() => {
    const matches = filterSections(sections, resultsQuery, activeTopic ?? ALL_TOPICS, locale);
    if (activeTopic === null)
      return { results: groupByDateAdded(matches, locale), showFallbackNotice: false };
    if (matches.length || activeTopic === ALL_TOPICS || !resultsQuery.trim()) {
      return { results: matches, showFallbackNotice: false };
    }
    const allMatches = filterSections(sections, resultsQuery, ALL_TOPICS, locale);
    return { results: allMatches, showFallbackNotice: allMatches.length > 0 };
  }, [sections, resultsQuery, activeTopic, locale]);
  const clearQuery = useCallback(() => setQuery(''), []);
  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const changeNiqqud = (event: ChangeEvent<HTMLInputElement>) =>
    setShowNiqqud(event.target.checked);

  return {
    loading: snapshot.status === 'loading',
    error: snapshot.status === 'error',
    retry,
    query,
    resultsQuery,
    activeTopic,
    selectedTopic,
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
    updated: data ? formatUpdatedDate(data.core.updatedAt, locale) : '',
    intro: data?.localization.intro ?? '',
    resultsTitle:
      activeTopic === null
        ? messages.byDateAdded
        : showFallbackNotice || activeTopic === ALL_TOPICS
          ? messages.allWords
          : (sections.find((section) => section.id === activeTopic)?.title ?? messages.allWords),
  };
};

import { useMemo, useState, type ChangeEvent } from 'react';
import dictionary from '../dictionary.json';
import {
  ALL_TOPICS,
  sections,
  filterSections,
  countEntries,
  formatUpdatedDate,
} from '../helpers/dictionary';
import { useNiqqudPreference } from './useNiqqudPreference';

export const useDictionary = () => {
  const { showNiqqud, setShowNiqqud } = useNiqqudPreference();
  const [query, setQuery] = useState('');
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS);
  const results = useMemo(() => filterSections(query, activeTopic), [query, activeTopic]);
  const resetSearch = () => {
    setQuery('');
    setActiveTopic(ALL_TOPICS);
  };
  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const changeNiqqud = (event: ChangeEvent<HTMLInputElement>) =>
    setShowNiqqud(event.target.checked);

  return {
    query,
    activeTopic,
    showNiqqud,
    results,
    resetSearch,
    changeQuery,
    changeNiqqud,
    setActiveTopic,
    topics: [ALL_TOPICS, ...sections.map((section) => section.title)],
    count: countEntries(results),
    total: countEntries(sections),
    updated: formatUpdatedDate(dictionary.updatedAt),
    intro: dictionary.intro,
    resultsTitle: activeTopic === ALL_TOPICS ? 'Все слова' : activeTopic,
  };
};

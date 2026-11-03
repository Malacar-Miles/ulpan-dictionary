import { useMemo, useState, type ChangeEvent } from 'react';
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
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS);
  const results = useMemo(
    () => filterSections(query, activeTopic, locale),
    [query, activeTopic, locale],
  );
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
    topics: [
      { id: ALL_TOPICS, title: messages.allTopics },
      ...sections.map(({ id, title }) => ({ id, title })),
    ],
    count: countEntries(results),
    total: countEntries(sections),
    updated: formatUpdatedDate(dictionary.updatedAt, locale),
    intro: dictionary.intro[locale],
    resultsTitle:
      activeTopic === ALL_TOPICS
        ? messages.allWords
        : sections.find((section) => section.id === activeTopic)!.title,
  };
};

import { DictionaryHeader } from './components/DictionaryHeader';
import { DictionaryControls } from './components/DictionaryControls';
import { DictionaryResults } from './components/DictionaryResults';
import { DictionaryFooter } from './components/DictionaryFooter';
import { useHandwritingPreference } from './hooks/useHandwritingPreference';
import { useDictionary } from './hooks/useDictionary';
import { useDictionaryLayout } from './hooks/useDictionaryLayout';

export const App = () => {
  const dictionary = useDictionary();
  const { handwriting, changeHandwriting } = useHandwritingPreference();
  const { controlsRef, contentRef, startEditing, stopEditing, preserveSearchFocus } =
    useDictionaryLayout(dictionary.query, dictionary.activeTopic);

  return (
    <>
      <DictionaryHeader />
      <DictionaryControls
        controlsRef={controlsRef}
        onPointerDownCapture={preserveSearchFocus}
        query={dictionary.query}
        onQueryChange={dictionary.changeQuery}
        onSearchFocus={startEditing}
        onSearchBlur={stopEditing}
        handwriting={handwriting}
        onHandwritingChange={changeHandwriting}
        showNiqqud={dictionary.showNiqqud}
        onNiqqudChange={dictionary.changeNiqqud}
        total={dictionary.total}
        updated={dictionary.updated}
        topics={dictionary.topics}
        activeTopic={dictionary.activeTopic}
        onTopicSelect={dictionary.setActiveTopic}
      />
      <main
        id="top"
        className={`wrap content${handwriting ? ' handwritten' : ''}`}
        ref={contentRef}
      >
        <DictionaryResults
          title={dictionary.resultsTitle}
          count={dictionary.count}
          sections={dictionary.results}
          query={dictionary.query}
          showNiqqud={dictionary.showNiqqud}
          onReset={dictionary.resetSearch}
        />
        <DictionaryFooter intro={dictionary.intro} />
      </main>
    </>
  );
};

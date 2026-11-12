import { LocaleProvider } from './localization/LocaleProvider';
import { DictionaryHeader } from './components/DictionaryHeader';
import { DictionaryControls } from './components/DictionaryControls';
import { DictionaryResults } from './components/DictionaryResults';
import { DictionaryFooter } from './components/DictionaryFooter';
import { useHandwritingPreference } from './hooks/useHandwritingPreference';
import { useDictionary } from './hooks/useDictionary';
import { useDictionaryLayout } from './hooks/useDictionaryLayout';

const DictionaryApp = () => {
  const dictionary = useDictionary();
  const { handwriting, changeHandwriting } = useHandwritingPreference();
  const { controlsRef, scrollRef, preserveSearchFocus } = useDictionaryLayout(
    dictionary.resultsQuery,
    dictionary.activeTopic,
  );

  return (
    <div className="dictionary-scroll" ref={scrollRef}>
      <DictionaryHeader />
      <DictionaryControls
        controlsRef={controlsRef}
        onPointerDownCapture={preserveSearchFocus}
        query={dictionary.query}
        onQueryChange={dictionary.changeQuery}
        onQueryClear={dictionary.clearQuery}
        handwriting={handwriting}
        onHandwritingChange={changeHandwriting}
        showNiqqud={dictionary.showNiqqud}
        onNiqqudChange={dictionary.changeNiqqud}
        topics={dictionary.topics}
        activeTopic={dictionary.activeTopic}
        selectedTopic={dictionary.selectedTopic}
        onTopicSelect={dictionary.setActiveTopic}
      />
      <main className={`wrap content${handwriting ? ' handwritten' : ''}`}>
        <DictionaryResults
          total={dictionary.total}
          updated={dictionary.updated}
          showFallbackNotice={dictionary.showFallbackNotice}
          title={dictionary.resultsTitle}
          count={dictionary.count}
          sections={dictionary.results}
          query={dictionary.resultsQuery}
          showNiqqud={dictionary.showNiqqud}
          onReset={dictionary.clearQuery}
        />
        <DictionaryFooter intro={dictionary.intro} />
      </main>
    </div>
  );
};

export const App = () => (
  <LocaleProvider>
    <DictionaryApp />
  </LocaleProvider>
);

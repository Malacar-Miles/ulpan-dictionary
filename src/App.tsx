import styles from './App.module.css';
import { ShowTranslationContext } from './translationContext';
import { useTranslationPreference } from './hooks/useTranslationPreference';
import { useState } from 'react';
import { usePrintSelection } from './hooks/usePrintSelection';
import { PrintPreview } from './components/PrintPreview';
import { useLocale } from './localization/context';
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
  const { showTranslation, setShowTranslation } = useTranslationPreference();
  const selection = usePrintSelection(dictionary.sections);
  const [printOpen, setPrintOpen] = useState(false);
  const { messages } = useLocale();
  const { handwriting, changeHandwriting } = useHandwritingPreference();
  const { controlsRef, scrollRef, preserveSearchFocus } = useDictionaryLayout(
    dictionary.resultsQuery,
    dictionary.activeTopic,
  );

  return (
    <div data-dictionary-scroll className={styles['dictionary-scroll']} ref={scrollRef}>
      <DictionaryHeader disabled={dictionary.loading} />
      <DictionaryControls
        disabled={dictionary.loading || dictionary.error}
        printCount={selection.selectedIds.size}
        onPrint={() => setPrintOpen(true)}
        onClearSelection={selection.clearSelection}
        controlsRef={controlsRef}
        onPointerDownCapture={preserveSearchFocus}
        query={dictionary.query}
        onQueryChange={dictionary.changeQuery}
        onQueryClear={dictionary.clearQuery}
        handwriting={handwriting}
        onHandwritingChange={changeHandwriting}
        showTranslation={showTranslation}
        onTranslationChange={(event) => setShowTranslation(event.target.checked)}
        showNiqqud={dictionary.showNiqqud}
        onNiqqudChange={dictionary.changeNiqqud}
        topics={dictionary.topics}
        activeTopic={dictionary.activeTopic}
        selectedTopic={dictionary.selectedTopic}
        onTopicSelect={dictionary.setActiveTopic}
      />
      <main className={styles['content'] + (handwriting ? ' ' + styles['handwritten'] : '')}>
        {dictionary.loading ? (
          <div className={styles['dictionary-loading']} role="status">
            <span className={styles['dictionary-spinner']} aria-hidden="true" />
            <span>{messages.loading}</span>
          </div>
        ) : dictionary.error ? (
          <div className={styles['dictionary-loading']} role="alert">
            <p>{messages.loadError}</p>
            <button type="button" onClick={dictionary.retry}>
              {messages.retry}
            </button>
          </div>
        ) : (
          <ShowTranslationContext value={showTranslation}>
            <DictionaryResults
              selectedIds={selection.selectedIds}
              onToggleCard={selection.onToggleCard}
              onToggleSection={selection.onToggleSection}
              total={dictionary.total}
              updated={dictionary.updated}
              showFallbackNotice={dictionary.showFallbackNotice}
              title={dictionary.resultsTitle}
              count={dictionary.count}
              sections={dictionary.results}
              query={dictionary.resultsQuery}
              activeTopic={dictionary.activeTopic}
              showNiqqud={dictionary.showNiqqud}
              onReset={dictionary.clearQuery}
            />
          </ShowTranslationContext>
        )}
        {!dictionary.loading && !dictionary.error && <DictionaryFooter intro={dictionary.intro} />}
      </main>
      {printOpen && (
        <PrintPreview
          entries={selection.selectedEntries}
          initialNiqqud={dictionary.showNiqqud}
          initialHandwriting={handwriting}
          onClose={() => setPrintOpen(false)}
        />
      )}
    </div>
  );
};

export const App = () => (
  <LocaleProvider>
    <DictionaryApp />
  </LocaleProvider>
);

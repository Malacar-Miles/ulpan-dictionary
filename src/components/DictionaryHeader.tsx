import { useLocale } from '../localization/context';
export const DictionaryHeader = () => {
  const { messages } = useLocale();
  return (
    <header className="header">
      <div className="wrap">
        <div className="topline">
          <a className="brand" href="#top" aria-label={messages.backToTop}>
            <span className="brand-icon" aria-hidden="true">
              א
            </span>
            <span>
              {messages.brand} <i> / </i> {messages.dictionary}
            </span>
          </a>
        </div>
        <div className="heading">
          <p className="intro-text">{messages.introduction}</p>
        </div>
      </div>
    </header>
  );
};

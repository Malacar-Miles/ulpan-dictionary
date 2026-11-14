import { useLocale } from '../localization/context';
export const DictionaryHeader = ({ disabled = false }: { disabled?: boolean }) => {
  const { messages } = useLocale();
  return (
    <header id="top" className="header" inert={disabled}>
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

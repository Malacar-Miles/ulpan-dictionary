import { useLocale } from '../localization/context';
import { getHighlightSegments } from '../helpers/highlight';

type HighlightProps = { text: string; query: string };
export const Highlight = ({ text, query }: HighlightProps) => {
  const { locale } = useLocale();
  return (
    <>
      {getHighlightSegments(text, query, locale).map((segment) =>
        segment.highlighted ? <mark key={segment.start}>{segment.text}</mark> : segment.text,
      )}
    </>
  );
};

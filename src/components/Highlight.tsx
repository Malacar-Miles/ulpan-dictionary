import { getHighlightSegments } from '../helpers/highlight';

type HighlightProps = { text: string; query: string };
export const Highlight = ({ text, query }: HighlightProps) => (
  <>
    {getHighlightSegments(text, query).map((segment) =>
      segment.highlighted ? <mark key={segment.start}>{segment.text}</mark> : segment.text,
    )}
  </>
);

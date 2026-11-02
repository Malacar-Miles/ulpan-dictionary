type DictionaryFooterProps = { intro: string };
export const DictionaryFooter = ({ intro }: DictionaryFooterProps) => (
  <footer>
    <span>СЛОВАРЬ УЛЬПАНА</span>
    <p>{intro}</p>
  </footer>
);

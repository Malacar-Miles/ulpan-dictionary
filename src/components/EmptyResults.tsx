type EmptyResultsProps = { onReset: () => void };
export const EmptyResults = ({ onReset }: EmptyResultsProps) => (
  <div className="empty">
    <span>א</span>
    <h3>Ничего не нашлось</h3>
    <p>Попробуй изменить запрос или выбрать другую тему.</p>
    <button onClick={onReset}>Сбросить поиск и фильтр</button>
  </div>
);

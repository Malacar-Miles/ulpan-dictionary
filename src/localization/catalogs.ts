export type Locale = 'ru' | 'es';

type Messages = {
  root: string;
  rootUnlisted: string;
  pageTitle: string;
  brand: string;
  dictionary: string;
  backToTop: string;
  introduction: string;
  searchLabel: string;
  clearSearch: string;
  searchPlaceholder: string;
  searchHint: string;
  niqqud: string;
  handwriting: string;
  language: string;
  dictionaryViews: string;
  byTopicShort: string;
  byDateShort: string;
  byDateAdded: string;
  allTopics: string;
  allWords: string;
  found: string;
  withoutNiqqud: string;
  withNiqqud: string;
  emptyTitle: string;
  searchFallbackNotice: string;
  emptyHint: string;
  resetSearch: string;
  footer: string;
  records: (count: number, date: string) => string;
};

export const catalogs: Record<Locale, Messages> = {
  ru: {
    root: 'корень',
    rootUnlisted: 'не указан',
    pageTitle: 'Словарь ульпана',
    brand: 'УЛЬПАН',
    dictionary: 'СЛОВАРЬ',
    backToTop: 'Словарь ульпана, наверх',
    introduction:
      'Здесь собраны слова, которые наша группа проходила на занятиях или в упражнениях из домашнего задания. Я добавляю их вручную после каждого занятия, поэтому каких-то слов может не хватать. Просьба писать мне об ошибках в словах и любых проблемах с сайтом.',
    searchLabel: 'Поиск по словарю',
    clearSearch: 'Очистить поиск',
    searchPlaceholder: 'Поиск на русском или иврите',
    searchHint: 'ИВРИТ · ПРОИЗНОШЕНИЕ · ПЕРЕВОД',
    niqqud: 'Никуд',
    handwriting: 'Пропись',
    language: 'Язык интерфейса',
    dictionaryViews: 'Просмотр словаря',
    byTopicShort: 'По темам',
    byDateShort: 'По дате',
    byDateAdded: 'По дате добавления',
    allTopics: 'Все темы',
    allWords: 'Все слова',
    found: 'Найдено:',
    withoutNiqqud: 'Без никуд:',
    withNiqqud: 'С никудом:',
    emptyTitle: 'Ничего не нашлось',
    searchFallbackNotice: 'Ничего не найдено в выбранной категории. Вот результаты по всем словам.',
    emptyHint: 'Попробуй изменить запрос или выбрать другую тему.',
    resetSearch: 'Сбросить поиск',
    footer: 'СЛОВАРЬ УЛЬПАНА',
    records: (count, date) => {
      const category = new Intl.PluralRules('ru').select(count);
      const noun = category === 'one' ? 'запись' : category === 'few' ? 'записи' : 'записей';
      return `${count} ${noun}, обновлено ${date}`;
    },
  },
  es: {
    root: 'raíz',
    rootUnlisted: 'sin indicar',
    pageTitle: 'Diccionario del ulpán',
    brand: 'ULPÁN',
    dictionary: 'DICCIONARIO',
    backToTop: 'Diccionario del ulpán, volver arriba',
    introduction:
      'Aquí están las palabras que nuestro grupo ha estudiado en clase o en los ejercicios de tarea. Las añado manualmente después de cada clase, así que pueden faltar algunas. Por favor, avísame si encuentras errores en las palabras o cualquier problema con el sitio.',
    searchLabel: 'Buscar en el diccionario',
    clearSearch: 'Borrar búsqueda',
    searchPlaceholder: 'Buscar en español o hebreo',
    searchHint: 'HEBREO · PRONUNCIACIÓN · TRADUCCIÓN',
    niqqud: 'Niqqud',
    handwriting: 'Manuscrita',
    language: 'Idioma de la interfaz',
    dictionaryViews: 'Vistas del diccionario',
    byTopicShort: 'Por tema',
    byDateShort: 'Por fecha',
    byDateAdded: 'Por fecha de incorporación',
    allTopics: 'Todos los temas',
    allWords: 'Todas las palabras',
    found: 'Resultados:',
    withoutNiqqud: 'Sin niqqud:',
    withNiqqud: 'Con niqqud:',
    emptyTitle: 'No se encontraron resultados',
    searchFallbackNotice:
      'No se encontraron resultados en la categoría seleccionada. Estos son los resultados de todo el diccionario.',
    emptyHint: 'Prueba otra búsqueda o selecciona otro tema.',
    resetSearch: 'Borrar búsqueda',
    footer: 'DICCIONARIO DEL ULPÁN',
    records: (count, date) => `${count} ${count === 1 ? 'entrada' : 'entradas'} · Act. ${date}`,
  },
};

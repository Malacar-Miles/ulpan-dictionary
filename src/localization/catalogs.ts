export type Locale = 'ru' | 'es';

type Messages = {
  pageTitle: string;
  brand: string;
  dictionary: string;
  backToTop: string;
  introduction: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchHint: string;
  niqqud: string;
  handwriting: string;
  language: string;
  topics: string;
  topicFilter: string;
  allTopics: string;
  allWords: string;
  found: string;
  withoutNiqqud: string;
  withNiqqud: string;
  emptyTitle: string;
  emptyHint: string;
  reset: string;
  footer: string;
  records: (count: number, date: string) => string;
};

export const catalogs: Record<Locale, Messages> = {
  ru: {
    pageTitle: 'Словарь ульпана',
    brand: 'УЛЬПАН',
    dictionary: 'СЛОВАРЬ',
    backToTop: 'Словарь ульпана, наверх',
    introduction:
      'Здесь собраны слова, которые наша группа проходила на занятиях или в упражнениях из домашнего задания. Я добавляю их вручную после каждого занятия, поэтому каких-то слов может не хватать. Просьба писать мне об ошибках в словах и любых проблемах с сайтом.',
    searchLabel: 'Поиск по словарю',
    searchPlaceholder: 'Поиск на русском или иврите',
    searchHint: 'ИВРИТ · ПРОИЗНОШЕНИЕ · ПЕРЕВОД',
    niqqud: 'Никкуд',
    handwriting: 'Пропись',
    language: 'Язык интерфейса',
    topics: 'ТЕМЫ',
    topicFilter: 'Фильтр по теме',
    allTopics: 'Все темы',
    allWords: 'Все слова',
    found: 'Найдено:',
    withoutNiqqud: 'Без никуд:',
    withNiqqud: 'С никудом:',
    emptyTitle: 'Ничего не нашлось',
    emptyHint: 'Попробуй изменить запрос или выбрать другую тему.',
    reset: 'Сбросить поиск и фильтр',
    footer: 'СЛОВАРЬ УЛЬПАНА',
    records: (count, date) => {
      const category = new Intl.PluralRules('ru').select(count);
      const noun = category === 'one' ? 'запись' : category === 'few' ? 'записи' : 'записей';
      return `${count} ${noun} в словаре, обновлено ${date}`;
    },
  },
  es: {
    pageTitle: 'Diccionario del ulpán',
    brand: 'ULPÁN',
    dictionary: 'DICCIONARIO',
    backToTop: 'Diccionario del ulpán, volver arriba',
    introduction:
      'Aquí están las palabras que nuestro grupo ha estudiado en clase o en los ejercicios de tarea. Las añado manualmente después de cada clase, así que pueden faltar algunas. Por favor, avísame si encuentras errores en las palabras o cualquier problema con el sitio.',
    searchLabel: 'Buscar en el diccionario',
    searchPlaceholder: 'Buscar en español o hebreo',
    searchHint: 'HEBREO · PRONUNCIACIÓN · TRADUCCIÓN',
    niqqud: 'Niqqud',
    handwriting: 'Manuscrita',
    language: 'Idioma de la interfaz',
    topics: 'TEMAS',
    topicFilter: 'Filtrar por tema',
    allTopics: 'Todos los temas',
    allWords: 'Todas las palabras',
    found: 'Resultados:',
    withoutNiqqud: 'Sin niqqud:',
    withNiqqud: 'Con niqqud:',
    emptyTitle: 'No se encontraron resultados',
    emptyHint: 'Prueba otra búsqueda o selecciona otro tema.',
    reset: 'Restablecer búsqueda y filtro',
    footer: 'DICCIONARIO DEL ULPÁN',
    records: (count, date) => `${count} ${count === 1 ? 'entrada' : 'entradas'} · Act. ${date}`,
  },
};

import type { Agreement, Grammar } from '../types';
import type { Locale } from './catalogs';

const labels: Record<string, [string, string]> = {
  fixed: ['Устойчивое выражение / слово', 'Expresión o palabra fija'],
  noun: ['Сущ.', 'Sust.'],
  present: ['Наст. вр.', 'Presente'],
  past: ['Прош. вр.', 'Pasado'],
  future: ['Буд. вр.', 'Futuro'],
  imperative: ['Повелит.', 'Imperativo'],
  infinitive: ['Инфинитив', 'Infinitivo'],
  passiveParticiple: ['Страд. причастие', 'Participio pasivo'],
  construct: ['Сопряжённая форма', 'Estado constructo'],
  absolute: ['Самостоятельная форма', 'Forma independiente'],
  question: ['Вопрос', 'Pregunta'],
  suffix: ['С местоименным суффиксом', 'Con sufijo pronominal'],
  phrase: ['Выражение', 'Expresión'],
  agreement: ['', ''],
  pronoun: ['Местоимение', 'Pronombre'],
  preposition: ['Предлог', 'Preposición'],
  conjunction: ['Союз', 'Conjunción'],
  adverb: ['Наречие', 'Adverbio'],
  masculine: ['м. р.', 'masc.'],
  feminine: ['ж. р.', 'fem.'],
  singular: ['ед. ч.', 'sing.'],
  plural: ['мн. ч.', 'pl.'],
  dual: ['дв. ч.', 'dual'],
  possessor: ['владелец', 'poseedor'],
  complement: ['дополнение', 'complemento'],
  addressee: ['адресат', 'destinatario'],
  object: ['объект', 'objeto'],
  colloquial: ['разг.', 'coloquial'],
};
export const grammarLabel = (grammar: Grammar, locale: Locale, usage?: string) => {
  const label = (key?: string) => (key ? labels[key][locale === 'ru' ? 0 : 1] : '');
  const agreement = (a: Agreement) =>
    [
      a.person && (locale === 'ru' ? a.person + '-е л.' : a.person + '.ª pers.'),
      label(a.gender),
      label(a.number),
    ]
      .filter(Boolean)
      .join(' ');
  const parts = [label(grammar.kind), agreement(grammar), label(grammar.state)];
  for (const role of ['possessor', 'complement', 'addressee', 'object'] as const) {
    const participant = grammar[role];
    if (participant) parts.push(label(role) + ' · ' + agreement(participant));
  }
  return [...parts, label(usage)].filter(Boolean).join(' · ');
};

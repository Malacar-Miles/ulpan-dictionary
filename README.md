# Ulpan Dictionary

A Hebrew dictionary with Russian and Spanish localization for a small ulpan group. It collects words and expressions encountered in lessons and homework, with Hebrew spelling, optional niqqud, approximate Russian or Latin pronunciation, and localized translations and notes. The interface is available in Russian and Spanish.

This project is developed exclusively through **AI engineering**: changes are implemented with the help of AI agents under the project owner's direction and review.

## Getting started

Use Node.js 24 and npm for local development and the quality checks below.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To check a production build or preview one locally:

```bash
npm run build
npm run preview
```

The application uses React, TypeScript, and Vite. Search and topic filtering run in the browser; no backend or database is required.

## Dictionary data

The application's source of truth is [`src/dictionary.json`](src/dictionary.json). Edit it directly; it is not automatically synchronized with the Markdown dictionary in the parent project. Agent instructions for maintaining entries are in [`AGENTS.md`](AGENTS.md).

The file contains `updatedAt` (`YYYY-MM-DD`), `intro.ru/es`, and topic sections. Sections have permanent IDs and localized `translations.ru/es.title` and `.note`. Each entry has a permanent ID, shared `hebrew` and optional `hebrewWithNiqqud`, and `translations.ru/es` containing `pronunciation` and `meaning`. Never renumber IDs when inserting or reordering entries. Both translations are required; `tests/localizedDictionary.test.ts` checks completeness, IDs, stress counts, and form alignment.

## Installation on a phone

The app includes a web app manifest and can be added to the home screen after it is deployed over HTTPS. In Safari on iPhone, use **Share → Add to Home Screen**; on Android, use the browser's **Install app** or **Add to Home screen** option. Menu wording can vary by device and browser.

When opened as an installed app, the introductory header is hidden and the search and filters remain visible. The current app requires an internet connection; it has no offline support or automatic update notification. An already open app does not automatically load a newly deployed dictionary.

## Deployment

The app is configured to build as static files in `dist/`. The repository is connected to Cloudflare Workers Builds; when automatic builds are enabled, a push to the configured production branch triggers a build and deployment. The configured build command is `npm run build`.

## Code organization

- `src/main.tsx` mounts React; `src/App.tsx` composes the page.
- `src/components/` contains the dictionary's presentation components.
- `src/hooks/` owns dictionary state, saved preferences, and layout effects.
- `src/helpers/` contains filtering, spelling selection, highlighting segments, and touch handling.
- `src/search.ts` implements normalization, matching, and highlight ranges.
- `src/useSearchViewport.ts` manages the existing iPhone search session and cleanup.
- `src/types.ts` defines the shared dictionary types.
- `tests/` covers search semantics and dictionary interactions.

## Code quality

Use `npm ci` to install the versions in the lockfile. ESLint uses the recommended
JavaScript, TypeScript, React Hooks, and Vite React Refresh flat configurations.
Prettier owns formatting; `eslint-config-prettier` disables conflicting lint rules.
Functions use arrow syntax, and code comments are written in English.

```bash
npm run format        # Format source and configuration
npm run format:check  # Check formatting without writing files
npm run lint          # Lint with zero warnings allowed
npm run lint:fix      # Apply automatic lint fixes
npm test              # Run regression tests
npm run check         # Formatting, lint, tests, and production build
```

Dictionary data and agent instructions are excluded from automatic formatting.
The dictionary's `updatedAt` changes only when its content changes.

The interaction tests run in jsdom. They do not emulate the iOS keyboard:
verify search focus/blur, scrolling, pinch zoom, and selection on a physical
iPhone in both Safari and standalone mode before releasing viewport changes.

## Hebrew handwriting

The “Рукописный шрифт” checkbox switches Hebrew card spellings and alternate
spellings to Gveret Levin. It is independent of the niqqud checkbox, defaults to
print, and saves its preference in localStorage. Search and copied text retain
the original Hebrew characters.

The font is bundled in `public/fonts/gveret-levin/` under the SIL Open Font License;
see the included `OFL.txt`. Source: [AlefAlefAlef/gveret-levin](https://github.com/AlefAlefAlef/gveret-levin).

## Localization

The sticky controls contain a `Русский / Español` switcher. The first visit uses Spanish when the browser's primary language is Spanish, and Russian otherwise. A saved choice overrides browser language. Language changes preserve the query, selected topic, niqqud, and handwriting settings. Storage failures do not prevent switching.

UI catalogs live in `src/localization/catalogs.ts`; the language hook updates the document language and browser title. The installed-app name and manifest remain Russian. The entry count is calculated from the shared data, and the manually maintained update date is formatted in the selected language.

Search covers Hebrew and the displayed language's meanings and pronunciation. Spanish search ignores vowel accents but distinguishes `ñ` from `n` and `h` from `ch`. Russian search retains its existing h/х and е/ё/э equivalences. Highlighting preserves the original accented letters and Hebrew niqqud.

Latin phonetics follow [the student's approved conventions](docs/student-latin-phonetics.md), not generic Spanish transliteration. They are stored as reviewed data, not generated at runtime. Future dictionary additions must include both languages; use the project dictionary-addition skill.

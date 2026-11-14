# Dictionary data and loading

The source of truth is three JSON files under `src/data/`, using schema version 3:

- `dictionary.core.json`: `updatedAt`, lexemes (lemma, part of speech, root, binyan, forms, grammar, Hebrew spelling variants and usage), and ordered sections/cards with stable IDs, `addedAt`, and item/default-form references.
- `dictionary.ru.json`: Russian `intro`, section titles/notes, card meanings, form glosses, and pronunciations.
- `dictionary.es.json`: the same localization structure for Spanish.

Localization files declare their `locale`. `sections` and `entries` are maps keyed by the core section/card IDs. `lexemes[lexemeId].forms[formId]` holds an optional `gloss` and a `pronunciations` array whose positions correspond exactly to the core form's `variants` array. When adding, removing, or reordering a variant, update both pronunciation arrays together. Forms and lexemes remain keyed by stable IDs; section/card order belongs exclusively to core.

The migration preserves all vocabulary, dates, IDs, and ordering. It changes the schema version without changing the dictionary's `updatedAt`, because this is a structural change rather than a vocabulary update. Future content changes update core's `updatedAt`; translations do not duplicate that date.

## Runtime

The initial application bundle contains interface messages, grammar labels, and asset URLs, but no dictionary payload. Vite emits the JSONs as separate assets with content hashes in their filenames (`?url&no-inline`). Requests therefore address the files associated with the loaded application build, and changed content gets a new URL. No hosting configuration changes are required.

After the shell mounts, `useDictionaryData` asks `dictionaryRepository` for core and the selected locale in parallel. The repository caches in-flight promises and successful results for the lifetime of the page, sharing core across languages. The other localization is fetched only when selected. Switching to a loaded locale is synchronous and makes no new requests. Reloading starts a new in-memory cache; ordinary browser HTTP caching remains independent.

`localizeSections(core, localization, locale)` assembles the card view once per successful locale load. Search and date grouping use these loaded sections. The hook retains query, topic/date view, and display preferences while the requested locale loads. Per-locale snapshots prevent an older response from replacing the selected locale's data.

During loading, a native disabled fieldset blocks all search, language, display, and topic controls; the header link is inert. Cards and the data-dependent footer are replaced by a localized status message and CSS spinner, slowed for reduced-motion preferences. A request failure replaces the loader with a localized error and retry button, with dictionary controls still disabled. Retrying refetches failed assets while retaining successful requests. Invalid JSON, incompatible schema versions, and assembly failures also enter the recoverable error state.

There is no service worker, offline cache, prefetch of the unused locale, or update polling. The small interface catalogs remain bundled so the shell, loading status, and errors can render before dictionary data arrives.

## Verification

`npm run check` validates formatting, lint, types, tests, and the production build. Integrity tests check translation coverage, pronunciation alignment, stable IDs, default-form references, and existing linguistic examples. Loading tests cover initial Russian/Spanish selection, partial responses, disabled controls, uncached/cached switches, duplicate in-flight requests, out-of-order results, and failure/retry behavior. Existing interaction tests cover the loaded dictionary's search, filters, preferences, and virtualization.

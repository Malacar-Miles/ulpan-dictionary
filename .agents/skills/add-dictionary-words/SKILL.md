---
name: add-dictionary-words
description: Add words or lesson notes from chat to this project's Hebrew–Russian JSON dictionary, correcting language errors, completing grammatical forms, updating the UI date, and committing locally. Use for rough or mixed Hebrew/Russian notes intended for inclusion; not for translation-only questions or speaking practice.
---

# Add dictionary words

Turn the user's notes into verified entries in `src/dictionary.json`. This workflow includes a local commit, unless the user explicitly asks for a draft or no commit. Never push unless the user explicitly instructs it. Follow the current request and applicable `AGENTS.md` instructions.

## Read and interpret

- Work from the repository root. Read the current JSON, its section notes, and relevant existing entries. The parent Markdown dictionary is a separate resource: do not synchronize or edit it.
- Inspect `git status --short`, unstaged changes, and the staged diff before editing. Preserve unrelated work. Record a baseline so the eventual commit can contain only this task's changes.
- Accept unordered Hebrew, Russian translations, Russian phonetic spellings, partial forms, duplicates, and sentences. Identify the intended word, sense, part of speech, and supplied tense from context; retain meaningful expressions as expressions.
- Account for every supplied item as added, merged/already present, or unresolved. Search across all sections and spelling variants before adding a new card. Merge the same lexeme and sense, preserving useful forms and explanations. Identical unvocalized spelling alone is not proof of duplication: שם can mean “name” or “there.”
- Correct clear errors directly. If several meanings remain plausible after checking context and sources, ask one focused question rather than silently choosing. Continue with independent, unambiguous items and clearly report any deferred items. Do not treat an unanswered question as approval.
- Assign each entry to an existing category according to its intended meaning. Discover current titles from the JSON, rather than relying on a stored category list. If none fits, propose a category and ask before creating or renaming one.

## Verify language and complete forms

- Check new/corrected spellings, niqqud, stress, and added forms against reliable sources. Prefer [Pealim](https://www.pealim.com/ru/) for inflection and stress, the [Academy of the Hebrew Language](https://hebrew-academy.org.il/) for normative spelling, and established dictionaries for meanings. Open the actual entry and select the matching sense; search results can mix homographs and unrelated inflections.
- Inspect how the source marks stress. Pealim uses bold letters in transcription; extracted plain text may lose this information. Inspect the marked-up page or source HTML when necessary. An automatic vocalizer or unaccented search snippet is not sufficient evidence.
- Preserve valid variants. Explain a useful normative/colloquial distinction in `meaning` instead of silently declaring one variant wrong (for example, גרה: гара́ / conversational га́ра). Verify disagreements before changing existing data.
- Every verb lexeme needs four present-tense forms in this order: masculine singular / feminine singular / masculine plural / feminine plural. Include matching forms in all three spelling/pronunciation fields. Repeat a spelling when distinct forms coincide without niqqud, as with עונה. Do not invent four distinct forms when the language does not have them.
- If notes supply an infinitive or a past/future form, preserve that form with its tense/person explicitly identified, and add the corresponding present-tense paradigm. Keep other tenses separate from the present row. Preserve existing first-person forms in an explanation or a separate tense-specific entry. For past third-person gender/number rows, plural forms may coincide. Do not conjugate יש/אין as verbs or expand a fixed greeting into unrelated verb entries.
- For adjectives and gendered occupations, supply the applicable masculine/feminine singular/plural forms. For ordinary nouns, include grammatical gender and verified plural (or dual) forms where applicable, without fabricating a gender counterpart or a plural for a mass noun. Keep these in the current entry fields and label exceptions. Avoid adding unrelated vocabulary or full conjugations in every tense.
- Separate forms added for grammatical completeness from what the user actually supplied; do not claim the supplementary forms appeared in a lesson or were memorized.
- If a required spelling, vocalization, or intended meaning cannot be verified, defer that item and explain the gap. Do not invent niqqud to make the batch look complete, and do not erase existing valid information.

## Edit the JSON

Use the existing schema; do not introduce application features or change rendering:

- `hebrew`: ordinary modern spelling without niqqud.
- `hebrewWithNiqqud`: verified vocalized spelling. Write and verify this independently: full unvocalized spelling can contain letters absent from vocalized spelling.
- `pronunciation`: approximate Russian transcription, aligned with the Hebrew forms. Mark stress with combining acute U+0301 on the stressed vowel of each multisyllabic word, including transcription inside `meaning`. Use Latin `h` for pronounced ה and `х` for ח or fricative כ/ך. Do not pronounce a silent final ה.
- `meaning`: Russian translation, grammatical labels, and short clarifications where needed. Make slash-separated alternatives and tense distinctions understandable.

Preserve section order, unrelated entries, Unicode, and the existing JSON formatting. Do not reformat the entire dictionary. If a batch only repeats existing content and adds no information, leave the file and date unchanged and do not create an empty commit.

## Update the UI's “last update” caption

The caption is data-driven. Update it as part of every actual dictionary-content change:

1. Set the top-level `updatedAt` in `src/dictionary.json` to the actual update date in `YYYY-MM-DD`, using the user's local date (currently `Asia/Jerusalem`). Use the current session date, not a date copied from an example, the lesson date, or deployment time. Several changes on the same local day legitimately retain the same date.
2. Verify the current data path: `src/hooks/useDictionary.ts` passes `dictionary.updatedAt` to `formatUpdatedDate` in `src/helpers/dictionary.ts`; `src/App.tsx` passes the resulting `updated` prop to `src/components/DictionaryControls.tsx`.
3. `DictionaryControls` renders `{total} записей в словаре, обновлено {updated}` in `.filters-head`. The helper formats the date in Russian with `Intl.DateTimeFormat('ru-RU', ...)`. Its UTC parsing/formatting preserves the calendar date already selected for the user; do not change it to host-local date arithmetic.
4. Verify the actual rendered caption locally, using a browser or a React rendering test: it must show the new Russian calendar date and the current number of dictionary entries. The total counts cards/entries, not individual slash-separated forms. Do not hard-code a date, change the caption text, or add a second date field. If the implementation has moved, trace the same data flow in the current source.
5. A local change and commit update the caption in the new local build. They do not update the deployed website or an already-open installed app. Do not deploy or push merely to make the public caption change.

## Validate and commit

- Parse the final JSON. Review the diff against the baseline and account for every input item. Check new entries' categories, required fields, Hebrew with/without niqqud, stress, matching order/count of forms, duplicate handling, and retained meanings. Confirm four present-tense forms for each affected verb.
- Run `git diff --check` and `npm run check` (formatting, lint, tests, and production build). Verify the rendered update caption as described above. Automated checks cannot certify linguistic correctness; report source-verification limits separately.
- Fix failures introduced by this update. If verification remains blocked or fails for an unrelated reason, report the specific limitation and leave the edits uncommitted rather than bypassing checks or changing application behavior without authorization.
- Review and stage only this task's dictionary changes, normally `src/dictionary.json`. If unrelated edits share the file, stage only the task's hunks. Do not include previously staged unrelated work in the commit; use an isolated index or ask only if separation cannot be done safely. Never reset or discard the user's work.
- The user's requested dictionary-addition workflow authorizes the local commit; no routine extra confirmation is required. Create a descriptive commit, inspect its actual contents, and report its hash. Do not amend an earlier commit. If nothing changed, report that instead.
- Do not run `git push` unless explicitly instructed by the user. If pushing is separately requested, follow the project's deployment verification requirements as well.

## Report in chat

List additions with their categories and supplied/completed forms, meaningful before/after corrections, duplicates merged or already present, and unresolved items. Link the sources supporting corrections or non-obvious forms; do not claim blanket independent verification. State the `updatedAt` value, caption verification result, checks run, and commit hash (or why no commit was made). Explicitly say whether anything was pushed.

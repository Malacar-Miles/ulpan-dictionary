# Agent instructions

## Project and scope

This is a Hebrew dictionary with Russian and Spanish localization for a small ulpan group, developed exclusively through AI engineering under the owner's direction and review. Keep both interface languages complete and usable on phones and computers. Inclusion means a word or expression appeared in lessons or homework; it does not mean the user has memorized it. Follow the user's current instructions and applicable parent-project instructions.

This repository contains only the web application. Its source of truth is `src/dictionary.json`.

When adding words or lesson notes, use the [add-dictionary-words workflow](.agents/skills/add-dictionary-words/SKILL.md).

## Application behavior

- React + TypeScript + Vite; `npm run dev` starts development, `npm run build` type-checks and creates `dist/`, and `npm run preview` serves the build.
- Search (`src/search.ts`) covers Hebrew variants, pronunciation, and meaning; it searches Hebrew plus the selected language, ignoring case, accents, punctuation, and spaces. Russian treats Latin `h` as `х` and `е`, `ё`, and `э` as equivalent. Spanish preserves the distinction between `ñ` and `n`, and between `h` and `ch`. Keep highlighting consistent with matching, including Hebrew niqqud and stress marks. When a match exists only in a hidden Hebrew spelling, show that spelling and highlight the match.
- Topic filters, the niqqud toggle (saved in localStorage), sticky controls, and responsive layout are intentional. Preserve text selection inside cards and the search field. The sticky panel height is tracked by `ResizeObserver` to prevent jumps when search results shrink.
- All devices use the same scroll container. The controls stay pinned. The logo and introduction are hidden at viewport widths of 750px or less and scroll away on larger screens. The visible viewport height updates on resize only, without scroll/offsetTop compensation. The viewport meta tag also requests `interactive-widget=resizes-content`. Keep pinch zoom and text selection available. Topic choices wrap inside the collapsible filter panel on mobile. Verify keyboard behavior on a physical iPhone in Safari and standalone mode; desktop resizing does not emulate the iOS keyboard. The pre-experiment checkpoint is commit `a24ba15`.
- The web app manifest and icons are in `public/`. The current implementation has no service worker, offline support, or automatic update checker. Browser and installed-app storage can be separate; do not assume settings carry over.

## Git and deployment

- Inspect `git status --short`, unstaged changes, and the staged diff before editing. Preserve unrelated work. Record a baseline for the task.
- Stage only changes belonging to the task. If unrelated edits share a file, stage only the relevant hunks. Preserve previously staged work by using an isolated index or asking if the changes cannot be separated safely. Never reset or discard the user’s work.
- Push only when the user explicitly requests it.
- Deployment uses Cloudflare Workers Builds connected to GitHub. `npm run build` produces `dist/`; the deployment command and branch configuration are managed in Cloudflare. Do not change hosting, publish, or adjust access unless requested or authorized. When asked to push, confirm that the Git push succeeded; do not check deployment status unless the user explicitly requests that check. A successful push does not establish deployment success.

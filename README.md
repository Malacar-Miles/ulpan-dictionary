# Ulpan Dictionary

A Hebrew–Russian dictionary for a small ulpan group. It collects words and expressions encountered in lessons and homework, with Hebrew spelling, optional niqqud, approximate Russian pronunciation, and translations or notes. The interface is in Russian.

This project is developed exclusively through **AI engineering**: changes are implemented with the help of AI agents under the project owner's direction and review.

## Getting started

Requires Node.js and npm.

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

The file contains `updatedAt` (`YYYY-MM-DD`), introductory text, and topic sections. Each entry contains Hebrew spelling without niqqud, approximate pronunciation, a Russian translation or notes, and optionally a spelling with niqqud.

## Installation on a phone

The app includes a web app manifest and can be added to the home screen after it is deployed over HTTPS. In Safari on iPhone, use **Share → Add to Home Screen**; on Android, use the browser's **Install app** or **Add to Home screen** option. Menu wording can vary by device and browser.

When opened as an installed app, the introductory header is hidden and the search and filters remain visible. The current app requires an internet connection; it has no offline support or automatic update notification. An already open app does not automatically load a newly deployed dictionary.

## Deployment

The app is configured to build as static files in `dist/`. The repository is connected to Cloudflare Workers Builds; when automatic builds are enabled, a push to the configured production branch triggers a build and deployment. The configured build command is `npm run build`.

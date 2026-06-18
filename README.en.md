<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Your command center for AI-powered software development.</strong><br>
  A single window to drive Claude Code, Codex, Gemini CLI, OpenCode and more.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Website</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Downloads</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentation</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Report a bug</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <strong>English</strong> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## About this repository

This repository hosts the **public site for Devia Desktop**: the documentation, the downloads page, the published builds (as Releases) and the update feed the app checks against.

> **The source code is not here.** Devia Desktop is **FreeWare**: free and with 100% of its features, but closed-source. This repository exists to make installing it, reading the docs and reporting issues easy and transparent.

## What is Devia Desktop?

A desktop app (Windows, macOS and Linux) that turns working with agentic CLI tools into a visual, organized, multi-project experience: streaming chat with a diff viewer, a split view of up to 4 agents running in parallel isolated in git worktrees, an integrated spec-driven kanban, persistent memory, an MCP server manager, remote control via Telegram, local voice transcription and more.

Full details in the [documentation](https://dherrero.github.io/devia/docs/).

## Downloads and updates

- **Installers**: on the [downloads page](https://dherrero.github.io/devia/descargas/) or directly from this repository's [Releases](https://github.com/dherrero/devia/releases).
- **Update feed**: the app checks for new versions against [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Reporting bugs and suggestions

Found a bug in Devia Desktop or have an idea? **This repository's [Issues](https://github.com/dherrero/devia/issues) are the official channel.** When reporting a bug, please include if possible:

1. **Devia version** (Settings → About, or the installer name).
2. **Operating system** and version (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Active CLI agent** (Claude Code, Codex, Gemini CLI…) and its version.
4. **Steps to reproduce**, what you expected and what happened.
5. Screenshots or error messages, if any.

## Site structure

```
.
├── index.html  docs/  descargas/   # Pages in Spanish (default language, at the root)
├── en/  fr/  de/  …                 # One folder per language (11 in total) with the same pages
├── 404.html                        # Error page
├── updates/                        # Update manifest (+ per-platform feeds)
├── assets/                         # CSS, JS and logo
└── build/                          # i18n generator: build.mjs + i18n/<lang>.json (source)
```

Static multilingual site (11 languages), served from GitHub Pages. The `*.html` pages are **generated** from `build/i18n/<lang>.json` with `npm run build` (Node, no dependencies) and committed. The i18n architecture is documented in [`AGENTS.md`](AGENTS.md); the release publishing process, in [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop is FreeWare</p>

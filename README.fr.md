<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Votre centre de commandement pour le développement logiciel avec l'IA.</strong><br>
  Une seule fenêtre pour piloter Claude Code, Codex, Gemini CLI, OpenCode et plus encore.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Site web</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Téléchargements</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentation</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Signaler un bug</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <strong>Français</strong> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## À propos de ce dépôt

Ce dépôt héberge le **site public de Devia Desktop** : la documentation, la page de téléchargements, les builds publiées (en tant que Releases) et le flux de mises à jour que l'application consulte.

> **Le code source ne se trouve pas ici.** Devia Desktop est un **FreeWare** : gratuit et avec 100 % de ses fonctionnalités, mais à code fermé. Ce dépôt existe pour rendre son installation, sa documentation et le signalement de problèmes faciles et transparents.

## Qu'est-ce que Devia Desktop ?

Une application de bureau (Windows, macOS et Linux) qui transforme le travail avec les outils CLI agentiques en une expérience visuelle, organisée et multi-projets : chat en streaming et visionneuse de diffs, vue divisée avec jusqu'à 4 agents en parallèle isolés dans des git worktrees, kanban spec-driven intégré, mémoire persistante, gestionnaire de serveurs MCP, contrôle à distance via Telegram, transcription vocale locale et plus encore.

Tous les détails dans la [documentation](https://dherrero.github.io/devia/docs/).

## Téléchargements et mises à jour

- **Installateurs** : sur la [page de téléchargements](https://dherrero.github.io/devia/descargas/) ou directement dans les [Releases](https://github.com/dherrero/devia/releases) de ce dépôt.
- **Flux de mises à jour** : l'app vérifie les nouvelles versions via [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Signaler des bugs et des suggestions

Vous avez trouvé un bug dans Devia Desktop ou vous avez une idée ? **Les [Issues](https://github.com/dherrero/devia/issues) de ce dépôt sont le canal officiel.** Lorsque vous signalez un bug, incluez si possible :

1. **Version de Devia** (Paramètres → À propos, ou le nom de l'installateur).
2. **Système d'exploitation** et version (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Agent CLI actif** (Claude Code, Codex, Gemini CLI…) et sa version.
4. **Étapes pour reproduire**, ce que vous attendiez et ce qui s'est passé.
5. Captures d'écran ou messages d'erreur, le cas échéant.

## Structure du site

```
.
├── index.html  docs/  descargas/   # Pages en espagnol (langue par défaut, à la racine)
├── en/  fr/  de/  …                 # Un dossier par langue (11 au total) avec les mêmes pages
├── 404.html                        # Page d'erreur
├── updates/                        # Manifeste de mises à jour (+ flux par plateforme)
├── assets/                         # CSS, JS et logo
└── build/                          # Générateur i18n : build.mjs + i18n/<langue>.json (source)
```

Site statique multilingue (11 langues), servi via GitHub Pages. Les pages `*.html` sont **générées** depuis `build/i18n/<langue>.json` avec `npm run build` (Node, sans dépendances) et committées. L'architecture i18n est documentée dans [`AGENTS.md`](AGENTS.md) ; le processus de publication des versions, dans [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop est un FreeWare</p>

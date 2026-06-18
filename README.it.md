<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Il tuo centro di comando per lo sviluppo software con IA.</strong><br>
  Un'unica finestra per dirigere Claude Code, Codex, Gemini CLI, OpenCode e altro.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Sito web</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Download</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentazione</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Segnala un bug</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <strong>Italiano</strong> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## Su questo repository

Questo repository ospita il **sito pubblico di Devia Desktop**: la documentazione, la pagina dei download, le build pubblicate (come Releases) e il feed di aggiornamenti che l'applicazione consulta.

> **Il codice sorgente non è qui.** Devia Desktop è **FreeWare**: gratuito e con il 100% delle funzionalità, ma a codice chiuso. Questo repository esiste per rendere facile e trasparente installarlo, consultarne la documentazione e segnalare problemi.

## Che cos'è Devia Desktop?

Un'applicazione desktop (Windows, macOS e Linux) che trasforma il lavoro con gli strumenti CLI agentici in un'esperienza visiva, organizzata e multi-progetto: chat in streaming con visualizzatore di diff, vista divisa con fino a 4 agenti in parallelo isolati in git worktrees, kanban spec-driven integrato, memoria persistente, gestore di server MCP, controllo remoto via Telegram, trascrizione vocale locale e altro.

Tutti i dettagli nella [documentazione](https://dherrero.github.io/devia/docs/).

## Download e aggiornamenti

- **Installer**: nella [pagina dei download](https://dherrero.github.io/devia/descargas/) o direttamente nelle [Releases](https://github.com/dherrero/devia/releases) di questo repository.
- **Feed di aggiornamenti**: l'app controlla le nuove versioni su [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Segnalare bug e suggerimenti

Hai trovato un bug in Devia Desktop o hai un'idea? **Le [Issues](https://github.com/dherrero/devia/issues) di questo repository sono il canale ufficiale.** Quando segnali un bug, includi se possibile:

1. **Versione di Devia** (Impostazioni → Informazioni, o il nome dell'installer).
2. **Sistema operativo** e versione (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Agente CLI attivo** (Claude Code, Codex, Gemini CLI…) e la sua versione.
4. **Passi per riprodurlo**, cosa ti aspettavi e cosa è successo.
5. Screenshot o messaggi di errore, se presenti.

## Struttura del sito

```
.
├── index.html  docs/  descargas/   # Pagine in spagnolo (lingua predefinita, nella radice)
├── en/  fr/  de/  …                 # Una cartella per lingua (11 in totale) con le stesse pagine
├── 404.html                        # Pagina di errore
├── updates/                        # Manifest di aggiornamenti (+ feed per piattaforma)
├── assets/                         # CSS, JS e logo
└── build/                          # Generatore i18n: build.mjs + i18n/<lingua>.json (sorgente)
```

Sito statico multilingue (11 lingue), servito con GitHub Pages. Le pagine `*.html` vengono **generate** da `build/i18n/<lingua>.json` con `npm run build` (Node, senza dipendenze) e committate. L'architettura i18n è documentata in [`AGENTS.md`](AGENTS.md); il processo di pubblicazione delle versioni, in [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop è FreeWare</p>

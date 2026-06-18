<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Deine Kommandozentrale für die KI-gestützte Softwareentwicklung.</strong><br>
  Ein einziges Fenster, um Claude Code, Codex, Gemini CLI, OpenCode und mehr zu steuern.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Website</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Downloads</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Dokumentation</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Fehler melden</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <strong>Deutsch</strong> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## Über dieses Repository

Dieses Repository beherbergt die **öffentliche Website von Devia Desktop**: die Dokumentation, die Download-Seite, die veröffentlichten Builds (als Releases) und den Update-Feed, den die Anwendung abfragt.

> **Der Quellcode befindet sich nicht hier.** Devia Desktop ist **FreeWare**: kostenlos und mit 100 % der Funktionen, aber mit geschlossenem Quellcode. Dieses Repository existiert, um die Installation, die Dokumentation und das Melden von Problemen einfach und transparent zu machen.

## Was ist Devia Desktop?

Eine Desktop-App (Windows, macOS und Linux), die die Arbeit mit agentischen CLI-Tools in ein visuelles, strukturiertes und multiprojektfähiges Erlebnis verwandelt: Streaming-Chat mit Diff-Viewer, geteilte Ansicht mit bis zu 4 parallel laufenden Agenten, isoliert in git worktrees, integriertes spec-driven Kanban, persistenter Speicher, MCP-Server-Manager, Fernsteuerung über Telegram, lokale Sprachtranskription und mehr.

Alle Details in der [Dokumentation](https://dherrero.github.io/devia/docs/).

## Downloads und Updates

- **Installer**: auf der [Download-Seite](https://dherrero.github.io/devia/descargas/) oder direkt in den [Releases](https://github.com/dherrero/devia/releases) dieses Repositorys.
- **Update-Feed**: die App prüft auf neue Versionen über [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Fehler und Vorschläge melden

Hast du einen Fehler in Devia Desktop gefunden oder eine Idee? **Die [Issues](https://github.com/dherrero/devia/issues) dieses Repositorys sind der offizielle Kanal.** Wenn du einen Fehler meldest, gib nach Möglichkeit an:

1. **Devia-Version** (Einstellungen → Über, oder der Name des Installers).
2. **Betriebssystem** und Version (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Aktiver CLI-Agent** (Claude Code, Codex, Gemini CLI…) und dessen Version.
4. **Schritte zur Reproduktion**, was du erwartet hast und was passiert ist.
5. Screenshots oder Fehlermeldungen, falls vorhanden.

## Aufbau der Website

```
.
├── index.html  docs/  descargas/   # Seiten auf Spanisch (Standardsprache, im Wurzelverzeichnis)
├── en/  fr/  de/  …                 # Ein Ordner pro Sprache (11 insgesamt) mit denselben Seiten
├── 404.html                        # Fehlerseite
├── updates/                        # Update-Manifest (+ Feeds pro Plattform)
├── assets/                         # CSS, JS und Logo
└── build/                          # i18n-Generator: build.mjs + i18n/<sprache>.json (Quelle)
```

Statische mehrsprachige Website (11 Sprachen), bereitgestellt über GitHub Pages. Die `*.html`-Seiten werden aus `build/i18n/<sprache>.json` mit `npm run build` (Node, ohne Abhängigkeiten) **generiert** und committet. Die i18n-Architektur ist in [`AGENTS.md`](AGENTS.md) dokumentiert; der Veröffentlichungsprozess der Versionen in [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop ist FreeWare</p>

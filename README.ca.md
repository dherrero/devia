<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>El teu centre de comandament per al desenvolupament de programari amb IA.</strong><br>
  Una sola finestra per a dirigir Claude Code, Codex, Gemini CLI, OpenCode i més.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Lloc web</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Descàrregues</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentació</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Informar d'un error</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <strong>Valencià</strong> ·
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

## Sobre este repositori

Este repositori allotja el **lloc públic de Devia Desktop**: la documentació, la pàgina de descàrregues, les builds publicades (com a Releases) i el feed d'actualitzacions que consulta l'aplicació.

> **Ací no està el codi font.** Devia Desktop és **FreeWare**: gratis i amb el 100% de les funcionalitats, però de codi tancat. Este repositori existix per a fer que instal·lar-la, documentar-se i informar de problemes siga fàcil i transparent.

## Què és Devia Desktop?

Una aplicació d'escriptori (Windows, macOS i Linux) que convertix el treball amb agents de codificació CLI en una experiència visual, organitzada i multiprojecte: xat amb streaming i visor de diffs, vista dividida amb fins a 4 agents en paral·lel aïllats en git worktrees, kanban spec-driven integrat, memòria persistent, gestor de servidors MCP, control remot per Telegram, transcripció de veu local i més.

Tot el detall, a la [documentació](https://dherrero.github.io/devia/docs/).

## Descàrregues i actualitzacions

- **Instal·ladors**: a la [pàgina de descàrregues](https://dherrero.github.io/devia/descargas/) o directament a les [Releases](https://github.com/dherrero/devia/releases) d'este repositori.
- **Feed d'actualitzacions**: l'app comprova noves versions contra [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Informar d'errors i suggeriments

Has trobat una errada en Devia Desktop o tens una idea? **Les [Issues](https://github.com/dherrero/devia/issues) d'este repositori són el canal oficial.** En informar d'un error, inclou si és possible:

1. **Versió de Devia** (Configuració → Quant a, o el nom de l'instal·lador).
2. **Sistema operatiu** i versió (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Agent CLI actiu** (Claude Code, Codex, Gemini CLI…) i la seua versió.
4. **Passos per a reproduir-ho**, què esperaves i què va passar.
5. Captures o missatges d'error, si n'hi ha.

## Estructura del lloc

```
.
├── index.html  docs/  descargas/   # Pàgines en espanyol (idioma per defecte, a l'arrel)
├── en/  fr/  de/  …                 # Una carpeta per idioma (11 en total) amb les mateixes pàgines
├── 404.html                        # Pàgina d'error
├── updates/                        # Manifest d'actualitzacions (+ feeds per plataforma)
├── assets/                         # CSS, JS i logo
└── build/                          # Generador i18n: build.mjs + i18n/<idioma>.json (font)
```

Lloc estàtic multilingüe (11 idiomes), servit amb GitHub Pages. Les pàgines `*.html` **es generen** des de `build/i18n/<idioma>.json` amb `npm run build` (Node, sense dependències) i es committegen. L'arquitectura i18n està documentada a [`AGENTS.md`](AGENTS.md); el procés de publicació de versions, a [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop és FreeWare</p>

<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>O teu centro de comando para o desenvolvimento de software com IA.</strong><br>
  Uma única janela para dirigir Claude Code, Codex, Gemini CLI, OpenCode e mais.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Site</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Transferências</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentação</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Reportar um erro</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <strong>Português</strong> ·
  <a href="README.ru.md">Русский</a> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## Sobre este repositório

Este repositório aloja o **site público do Devia Desktop**: a documentação, a página de transferências, as builds publicadas (como Releases) e o feed de atualizações que a aplicação consulta.

> **O código-fonte não está aqui.** O Devia Desktop é **FreeWare**: gratuito e com 100% das funcionalidades, mas de código fechado. Este repositório existe para tornar fácil e transparente instalá-lo, consultar a documentação e reportar problemas.

## O que é o Devia Desktop?

Uma aplicação de ambiente de trabalho (Windows, macOS e Linux) que transforma o trabalho com ferramentas CLI agênticas numa experiência visual, organizada e multiprojeto: chat com streaming e visualizador de diffs, vista dividida com até 4 agentes em paralelo isolados em git worktrees, kanban spec-driven integrado, memória persistente, gestor de servidores MCP, controlo remoto por Telegram, transcrição de voz local e mais.

Todos os detalhes na [documentação](https://dherrero.github.io/devia/docs/).

## Transferências e atualizações

- **Instaladores**: na [página de transferências](https://dherrero.github.io/devia/descargas/) ou diretamente nas [Releases](https://github.com/dherrero/devia/releases) deste repositório.
- **Feed de atualizações**: a app verifica novas versões em [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Reportar erros e sugestões

Encontraste um erro no Devia Desktop ou tens uma ideia? **As [Issues](https://github.com/dherrero/devia/issues) deste repositório são o canal oficial.** Ao reportar um erro, inclui se possível:

1. **Versão do Devia** (Definições → Acerca de, ou o nome do instalador).
2. **Sistema operativo** e versão (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Agente CLI ativo** (Claude Code, Codex, Gemini CLI…) e a sua versão.
4. **Passos para reproduzir**, o que esperavas e o que aconteceu.
5. Capturas ou mensagens de erro, se as houver.

## Estrutura do site

```
.
├── index.html  docs/  descargas/   # Páginas em espanhol (idioma por omissão, na raiz)
├── en/  fr/  de/  …                 # Uma pasta por idioma (11 no total) com as mesmas páginas
├── 404.html                        # Página de erro
├── updates/                        # Manifesto de atualizações (+ feeds por plataforma)
├── assets/                         # CSS, JS e logótipo
└── build/                          # Gerador i18n: build.mjs + i18n/<idioma>.json (fonte)
```

Site estático multilingue (11 idiomas), servido com GitHub Pages. As páginas `*.html` são **geradas** a partir de `build/i18n/<idioma>.json` com `npm run build` (Node, sem dependências) e committadas. A arquitetura i18n está documentada em [`AGENTS.md`](AGENTS.md); o processo de publicação de versões, em [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · O Devia Desktop é FreeWare</p>

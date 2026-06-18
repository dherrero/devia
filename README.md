<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Tu centro de mando para el desarrollo de software con IA.</strong><br>
  Una sola ventana para dirigir Claude Code, Codex, Gemini CLI, OpenCode y más.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Sitio web</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Descargas</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Documentación</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Reportar un error</a>
</p>

---

## Sobre este repositorio

Este repositorio aloja el **sitio público de Devia Desktop**: la documentación, la página
de descargas, las builds publicadas (como Releases) y el feed de actualizaciones que
consulta la aplicación.

> **Aquí no está el código fuente.** Devia Desktop es **FreeWare**: gratis y con el 100%
> de las funcionalidades, pero de código cerrado. Este repositorio existe para que
> instalarla, documentarse y reportar problemas sea fácil y transparente.

## ¿Qué es Devia Desktop?

Una aplicación de escritorio (Windows, macOS y Linux) que convierte el trabajo con
agentes de codificación CLI en una experiencia visual, organizada y multiproyecto:
chat con streaming y visor de diffs, vista dividida con hasta 4 agentes en paralelo
aislados en git worktrees, kanban spec-driven integrado, memoria persistente,
gestor de servidores MCP, control remoto por Telegram, transcripción de voz local y más.

Todo el detalle, en la [documentación](https://dherrero.github.io/devia/docs/).

## Descargas y actualizaciones

- **Instaladores**: en la [página de descargas](https://dherrero.github.io/devia/descargas/)
  o directamente en las [Releases](https://github.com/dherrero/devia/releases) de este repositorio.
- **Feed de actualizaciones**: la app comprueba nuevas versiones contra
  [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Reportar errores y sugerencias

¿Has encontrado un fallo en Devia Desktop o tienes una idea? **Las
[Issues](https://github.com/dherrero/devia/issues) de este repositorio son el canal
oficial.** Al reportar un error, incluye si es posible:

1. **Versión de Devia** (Configuración → Acerca de, o el nombre del instalador).
2. **Sistema operativo** y versión (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Agente CLI activo** (Claude Code, Codex, Gemini CLI…) y su versión.
4. **Pasos para reproducirlo**, qué esperabas y qué ocurrió.
5. Capturas o mensajes de error, si los hay.

## Estructura del sitio

```
.
├── index.html  docs/  descargas/   # Páginas en español (idioma por defecto, en la raíz)
├── en/  fr/  de/  …                 # Una carpeta por idioma (11 en total) con las mismas páginas
├── 404.html                        # Página de error
├── updates/                        # Manifiesto de actualizaciones (+ feeds por plataforma)
├── assets/                         # CSS, JS y logo
└── build/                          # Generador i18n: build.mjs + i18n/<idioma>.json (fuente)
```

Sitio estático multilingüe (11 idiomas), servido con GitHub Pages. Las páginas
`*.html` **se generan** desde `build/i18n/<idioma>.json` con `npm run build`
(Node, sin dependencias) y se commitean. La arquitectura i18n está documentada
en [`AGENTS.md`](AGENTS.md); el proceso de publicación de versiones, en
[`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop es FreeWare</p>

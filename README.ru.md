<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>Ваш командный центр для разработки программного обеспечения с ИИ.</strong><br>
  Одно окно для управления Claude Code, Codex, Gemini CLI, OpenCode и не только.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 Сайт</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ Загрузки</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 Документация</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 Сообщить об ошибке</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a> ·
  <strong>Русский</strong> ·
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## Об этом репозитории

В этом репозитории размещён **публичный сайт Devia Desktop**: документация, страница загрузок, опубликованные сборки (в виде Releases) и фид обновлений, к которому обращается приложение.

> **Исходного кода здесь нет.** Devia Desktop — это **FreeWare**: бесплатно и со 100% функциональности, но с закрытым исходным кодом. Этот репозиторий существует, чтобы установка, чтение документации и сообщения о проблемах были простыми и прозрачными.

## Что такое Devia Desktop?

Десктопное приложение (Windows, macOS и Linux), которое превращает работу с агентными CLI-инструментами в визуальный, организованный и многопроектный опыт: чат с потоковым выводом и просмотром diff, разделённый вид до 4 агентов параллельно, изолированных в git worktrees, встроенный spec-driven канбан, постоянная память, менеджер MCP-серверов, удалённое управление через Telegram, локальная транскрипция голоса и многое другое.

Все подробности в [документации](https://dherrero.github.io/devia/docs/).

## Загрузки и обновления

- **Установщики**: на [странице загрузок](https://dherrero.github.io/devia/descargas/) или прямо в [Releases](https://github.com/dherrero/devia/releases) этого репозитория.
- **Фид обновлений**: приложение проверяет новые версии по [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 Сообщения об ошибках и предложения

Нашли ошибку в Devia Desktop или есть идея? **[Issues](https://github.com/dherrero/devia/issues) этого репозитория — официальный канал.** Сообщая об ошибке, по возможности укажите:

1. **Версию Devia** (Настройки → О программе, или имя установщика).
2. **Операционную систему** и версию (Windows 11, macOS 15, Ubuntu 24.04…).
3. **Активный CLI-агент** (Claude Code, Codex, Gemini CLI…) и его версию.
4. **Шаги для воспроизведения**, что вы ожидали и что произошло.
5. Скриншоты или сообщения об ошибках, если есть.

## Структура сайта

```
.
├── index.html  docs/  descargas/   # Страницы на испанском (язык по умолчанию, в корне)
├── en/  fr/  de/  …                 # По одной папке на язык (всего 11) с теми же страницами
├── 404.html                        # Страница ошибки
├── updates/                        # Манифест обновлений (+ фиды по платформам)
├── assets/                         # CSS, JS и логотип
└── build/                          # Генератор i18n: build.mjs + i18n/<язык>.json (источник)
```

Статический многоязычный сайт (11 языков), обслуживаемый через GitHub Pages. Страницы `*.html` **генерируются** из `build/i18n/<язык>.json` командой `npm run build` (Node, без зависимостей) и коммитятся. Архитектура i18n описана в [`AGENTS.md`](AGENTS.md); процесс публикации версий — в [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop — это FreeWare</p>

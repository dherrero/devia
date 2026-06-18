<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>您的 AI 软件开发指挥中心。</strong><br>
  一个窗口即可驾驭 Claude Code、Codex、Gemini CLI、OpenCode 等工具。
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 网站</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ 下载</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 文档</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 报告问题</a>
</p>

<p align="center">
  <a href="README.md">Español</a> ·
  <a href="README.en.md">English</a> ·
  <a href="README.ca.md">Valencià</a> ·
  <a href="README.fr.md">Français</a> ·
  <a href="README.de.md">Deutsch</a> ·
  <a href="README.it.md">Italiano</a> ·
  <a href="README.pt.md">Português</a> ·
  <a href="README.ru.md">Русский</a> ·
  <strong>中文</strong> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## 关于本仓库

本仓库托管 **Devia Desktop 的公开站点**：文档、下载页、已发布的构建（以 Releases 形式）以及应用查询的更新源。

> **源代码不在这里。** Devia Desktop 是 **FreeWare**（免费软件）：免费且具备 100% 的功能，但闭源。本仓库的存在是为了让安装、查阅文档和反馈问题变得简单透明。

## Devia Desktop 是什么？

一款桌面应用（Windows、macOS 和 Linux），将与 CLI Agent 工具的协作转化为可视化、有序的多项目体验：流式聊天与 diff 查看器、最多 4 个 Agent 并行的分屏视图（隔离在 git worktrees 中）、集成的 spec-driven 看板、持久化记忆、MCP 服务器管理器、通过 Telegram 的远程控制、本地语音转写等等。

完整细节请见[文档](https://dherrero.github.io/devia/docs/)。

## 下载与更新

- **安装包**：在[下载页](https://dherrero.github.io/devia/descargas/)，或直接在本仓库的 [Releases](https://github.com/dherrero/devia/releases) 中获取。
- **更新源**：应用会根据 [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json) 检查新版本。

## 🐞 报告问题与建议

在 Devia Desktop 中发现了 bug 或有想法？**本仓库的 [Issues](https://github.com/dherrero/devia/issues) 是官方渠道。** 报告 bug 时，请尽量包含：

1. **Devia 版本**（设置 → 关于，或安装包名称）。
2. **操作系统**及版本（Windows 11、macOS 15、Ubuntu 24.04…）。
3. **当前使用的 CLI Agent**（Claude Code、Codex、Gemini CLI…）及其版本。
4. **复现步骤**、你的预期以及实际发生的情况。
5. 截图或错误信息（如果有）。

## 站点结构

```
.
├── index.html  docs/  descargas/   # 西班牙语页面（默认语言，位于根目录）
├── en/  fr/  de/  …                 # 每种语言一个文件夹（共 11 个），包含相同的页面
├── 404.html                        # 错误页
├── updates/                        # 更新清单（+ 各平台的源）
├── assets/                         # CSS、JS 和 logo
└── build/                          # i18n 生成器：build.mjs + i18n/<语言>.json（源）
```

多语言静态站点（11 种语言），通过 GitHub Pages 提供。`*.html` 页面由 `npm run build`（Node，无依赖）从 `build/i18n/<语言>.json` **生成**并提交。i18n 架构记录在 [`AGENTS.md`](AGENTS.md) 中；版本发布流程见 [`PUBLISHING.md`](PUBLISHING.md)。

---

<p align="center">© 2026 Dani Herrero · Devia Desktop 是 FreeWare</p>

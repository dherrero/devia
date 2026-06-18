<div dir="rtl" align="right">

<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>مركز قيادتك لتطوير البرمجيات بالذكاء الاصطناعي.</strong><br>
  نافذة واحدة لإدارة Claude Code وCodex وGemini CLI وOpenCode والمزيد.
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 الموقع</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ التنزيلات</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 التوثيق</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 الإبلاغ عن خطأ</a>
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
  <a href="README.zh.md">中文</a> ·
  <a href="README.hi.md">हिन्दी</a> ·
  <strong>العربية</strong>
</p>

---

## حول هذا المستودع

يستضيف هذا المستودع **الموقع العام لـ Devia Desktop**: التوثيق وصفحة التنزيلات والإصدارات المنشورة (كـ Releases) وموجز التحديثات الذي يستعلم عنه التطبيق.

> **الشيفرة المصدرية ليست هنا.** Devia Desktop هو **FreeWare**: مجاني وبكامل ميزاته 100% لكنه مغلق المصدر. وُجد هذا المستودع لجعل تثبيته والاطلاع على توثيقه والإبلاغ عن المشكلات أمرًا سهلًا وشفافًا.

## ما هو Devia Desktop؟

تطبيق سطح مكتب (Windows وmacOS وLinux) يحوّل العمل مع أدوات CLI الوكيلة إلى تجربة مرئية منظّمة متعددة المشاريع: محادثة بالبث المباشر وعارض الفروقات (diffs)، وعرض مقسّم يصل إلى 4 وكلاء بالتوازي معزولين في git worktrees، ولوحة kanban متكاملة قائمة على المواصفات (spec-driven)، وذاكرة دائمة، ومدير خوادم MCP، وتحكّم عن بُعد عبر Telegram، ونسخ صوتي محلي والمزيد.

كل التفاصيل في [التوثيق](https://dherrero.github.io/devia/docs/).

## التنزيلات والتحديثات

- **برامج التثبيت**: في [صفحة التنزيلات](https://dherrero.github.io/devia/descargas/) أو مباشرةً من [Releases](https://github.com/dherrero/devia/releases) هذا المستودع.
- **موجز التحديثات**: يتحقق التطبيق من الإصدارات الجديدة مقابل [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json).

## 🐞 الإبلاغ عن الأخطاء والاقتراحات

وجدت خطأً في Devia Desktop أو لديك فكرة؟ **[Issues](https://github.com/dherrero/devia/issues) هذا المستودع هي القناة الرسمية.** عند الإبلاغ عن خطأ، أرفق إن أمكن:

1. **إصدار Devia** (الإعدادات ← حول، أو اسم برنامج التثبيت).
2. **نظام التشغيل** والإصدار (Windows 11، macOS 15، Ubuntu 24.04…).
3. **وكيل CLI النشط** (Claude Code، Codex، Gemini CLI…) وإصداره.
4. **خطوات إعادة الإنتاج**، وما الذي توقّعته وما الذي حدث.
5. لقطات الشاشة أو رسائل الخطأ، إن وُجدت.

## بنية الموقع

```
.
├── index.html  docs/  descargas/   # صفحات بالإسبانية (اللغة الافتراضية، في الجذر)
├── en/  fr/  de/  …                 # مجلد لكل لغة (11 إجمالًا) بالصفحات نفسها
├── 404.html                        # صفحة الخطأ
├── updates/                        # بيان التحديثات (+ موجزات لكل منصّة)
├── assets/                         # CSS وJS والشعار
└── build/                          # مولّد i18n: build.mjs + i18n/<اللغة>.json (المصدر)
```

موقع ثابت متعدد اللغات (11 لغة)، يُقدَّم عبر GitHub Pages. صفحات `*.html` **تُولَّد** من `build/i18n/<اللغة>.json` باستخدام `npm run build` (Node، بلا اعتماديات) وتُحفظ في الـ commit. بنية i18n موثّقة في [`AGENTS.md`](AGENTS.md)؛ وعملية نشر الإصدارات في [`PUBLISHING.md`](PUBLISHING.md).

---

<p align="center">© 2026 Dani Herrero · Devia Desktop هو FreeWare</p>
</div>

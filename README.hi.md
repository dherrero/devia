<p align="center">
  <img src="assets/img/devia.png" alt="Devia" width="96">
</p>

<h1 align="center">Devia</h1>

<p align="center">
  <strong>AI के साथ सॉफ़्टवेयर विकास के लिए आपका कमांड सेंटर।</strong><br>
  Claude Code, Codex, Gemini CLI, OpenCode और अन्य को चलाने के लिए एक ही विंडो।
</p>

<p align="center">
  <a href="https://dherrero.github.io/devia/">🌐 वेबसाइट</a> ·
  <a href="https://dherrero.github.io/devia/descargas/">⬇️ डाउनलोड</a> ·
  <a href="https://dherrero.github.io/devia/docs/">📖 दस्तावेज़</a> ·
  <a href="https://github.com/dherrero/devia/issues">🐞 बग रिपोर्ट करें</a>
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
  <strong>हिन्दी</strong> ·
  <a href="README.ar.md">العربية</a>
</p>

---

## इस रिपॉज़िटरी के बारे में

यह रिपॉज़िटरी **Devia Desktop की सार्वजनिक साइट** को होस्ट करती है: दस्तावेज़, डाउनलोड पेज, प्रकाशित बिल्ड (Releases के रूप में) और वह update feed जिसे ऐप जाँचता है।

> **स्रोत कोड यहाँ नहीं है।** Devia Desktop एक **FreeWare** है: मुफ़्त और 100% सुविधाओं के साथ, लेकिन क्लोज़्ड-सोर्स। यह रिपॉज़िटरी इसलिए मौजूद है ताकि इसे इंस्टॉल करना, दस्तावेज़ पढ़ना और समस्याएँ रिपोर्ट करना आसान और पारदर्शी हो।

## Devia Desktop क्या है?

एक डेस्कटॉप ऐप (Windows, macOS और Linux) जो agentic CLI tools के साथ काम को एक visual, व्यवस्थित और multi-project अनुभव में बदल देती है: streaming chat और diff viewer, git worktrees में अलग-अलग चलने वाले 4 तक agents की split view, एकीकृत spec-driven kanban, persistent memory, MCP server manager, Telegram के ज़रिए remote control, local voice transcription और बहुत कुछ।

सभी विवरण [दस्तावेज़](https://dherrero.github.io/devia/docs/) में।

## डाउनलोड और अपडेट

- **इंस्टॉलर**: [डाउनलोड पेज](https://dherrero.github.io/devia/descargas/) पर या सीधे इस रिपॉज़िटरी की [Releases](https://github.com/dherrero/devia/releases) में।
- **Update feed**: ऐप नई वर्शन की जाँच [`updates/latest.json`](https://dherrero.github.io/devia/updates/latest.json) के विरुद्ध करता है।

## 🐞 बग और सुझाव रिपोर्ट करना

Devia Desktop में कोई bug मिला या कोई विचार है? **इस रिपॉज़िटरी की [Issues](https://github.com/dherrero/devia/issues) ही आधिकारिक चैनल हैं।** bug रिपोर्ट करते समय, यदि संभव हो तो शामिल करें:

1. **Devia का वर्शन** (Settings → About, या इंस्टॉलर का नाम)।
2. **ऑपरेटिंग सिस्टम** और वर्शन (Windows 11, macOS 15, Ubuntu 24.04…)।
3. **सक्रिय CLI agent** (Claude Code, Codex, Gemini CLI…) और उसका वर्शन।
4. **दोहराने के चरण**, आपने क्या अपेक्षा की थी और क्या हुआ।
5. स्क्रीनशॉट या error संदेश, यदि कोई हों।

## साइट की संरचना

```
.
├── index.html  docs/  descargas/   # स्पैनिश में पेज (डिफ़ॉल्ट भाषा, रूट में)
├── en/  fr/  de/  …                 # हर भाषा के लिए एक फ़ोल्डर (कुल 11) समान पेजों के साथ
├── 404.html                        # Error पेज
├── updates/                        # Update manifest (+ प्रति-प्लेटफ़ॉर्म feeds)
├── assets/                         # CSS, JS और logo
└── build/                          # i18n जनरेटर: build.mjs + i18n/<भाषा>.json (स्रोत)
```

बहुभाषी स्टैटिक साइट (11 भाषाएँ), GitHub Pages से सर्व की जाती है। `*.html` पेज `npm run build` (Node, बिना dependencies) के साथ `build/i18n/<भाषा>.json` से **जनरेट** होते हैं और committ किए जाते हैं। i18n आर्किटेक्चर [`AGENTS.md`](AGENTS.md) में प्रलेखित है; वर्शन प्रकाशन की प्रक्रिया [`PUBLISHING.md`](PUBLISHING.md) में।

---

<p align="center">© 2026 Dani Herrero · Devia Desktop एक FreeWare है</p>

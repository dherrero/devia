#!/usr/bin/env node
/**
 * Static-site generator for the Devia Desktop GitHub Pages site.
 *
 * Renders every page (home, docs, descargas, 404) once per UI language using
 * the translated strings in `build/i18n/<lang>.json`. The HTML structure lives
 * here, in the render functions, so it is defined ONCE and every language only
 * supplies its strings — the structure can never drift between translations.
 *
 * Output layout (default language `es` lives at the site root; every other
 * language hangs off a folder segment, mirroring the URL in the path):
 *
 *   /                      /docs/                  /descargas/        (es)
 *   /en/   /en/docs/   /en/descargas/                                 (en)
 *   /fr/   /fr/docs/   /fr/descargas/                                 (fr)
 *   …
 *   /404.html                                                         (es, shared)
 *
 * Run with `node build/build.mjs` (or `npm run build`). The generated *.html
 * files are committed to the repo because GitHub Pages serves them directly.
 *
 * The catalogue below mirrors the desktop app's
 * `renderer/app/core/i18n/supported-languages.ts` — keep them in sync.
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const I18N_DIR = join(__dirname, 'i18n');

/** Absolute base URL of the published site — used for canonical + hreflang. */
const SITE_BASE = 'https://dherrero.github.io/devia/';

/** Default language: rendered at the site root with no folder segment. */
const DEFAULT_LANG = 'es';

/** UI languages, in the order shown in the language switcher (es first).
 *  Filtered at build time to those that actually have a translation file, so
 *  the site degrades gracefully while a language is still being authored. */
let LANGS = [
  { code: 'es', label: 'Español', dir: 'ltr', locale: 'es-ES' },
  { code: 'en', label: 'English', dir: 'ltr', locale: 'en-US' },
  { code: 'ca', label: 'Valencià', dir: 'ltr', locale: 'ca-ES' },
  { code: 'fr', label: 'Français', dir: 'ltr', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch', dir: 'ltr', locale: 'de-DE' },
  { code: 'it', label: 'Italiano', dir: 'ltr', locale: 'it-IT' },
  { code: 'pt', label: 'Português', dir: 'ltr', locale: 'pt-PT' },
  { code: 'ru', label: 'Русский', dir: 'ltr', locale: 'ru-RU' },
  { code: 'zh', label: '简体中文', dir: 'ltr', locale: 'zh-CN' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr', locale: 'hi-IN' },
  { code: 'ar', label: 'العربية', dir: 'rtl', locale: 'ar' },
];

/** The three content pages, in nav order. `seg` is the URL folder segment. */
const PAGES = [
  { key: 'home', seg: '' },
  { key: 'docs', seg: 'docs/' },
  { key: 'descargas', seg: 'descargas/' },
];

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

/** Escape text for use inside an HTML attribute value (title/description). */
function attr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Escape text for an element's text content (no attributes). */
function text(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Relative `../` prefix that climbs from an output dir back to the site root. */
function prefixFor(lang, page) {
  let depth = 0;
  if (lang !== DEFAULT_LANG) depth += 1; // language folder segment
  if (page.seg) depth += 1; // page folder segment
  return '../'.repeat(depth);
}

/** Site-root-relative path to a page in a given language (for nav/switcher). */
function pagePath(prefix, langCode, pageKey) {
  const langSeg = langCode === DEFAULT_LANG ? '' : `${langCode}/`;
  const page = PAGES.find((p) => p.key === pageKey);
  return `${prefix}${langSeg}${page.seg}` || './';
}

/** Absolute URL of a page (canonical + hreflang). */
function absUrl(langCode, pageKey) {
  const langSeg = langCode === DEFAULT_LANG ? '' : `${langCode}/`;
  const page = PAGES.find((p) => p.key === pageKey);
  return `${SITE_BASE}${langSeg}${page.seg}`;
}

// ---------------------------------------------------------------------------
// shared chrome (head, header/nav + language switcher, footer)
// ---------------------------------------------------------------------------

function head(t, ctx, { title, description, pageKey }) {
  const lang = LANGS.find((l) => l.code === ctx.lang);
  const alternates = LANGS.map(
    (l) => `  <link rel="alternate" hreflang="${l.code}" href="${attr(absUrl(l.code, pageKey))}">`,
  );
  alternates.push(`  <link rel="alternate" hreflang="x-default" href="${attr(absUrl(DEFAULT_LANG, pageKey))}">`);
  const dynamic = {
    heroVersionLabel: t.common.heroVersionLabel,
    publishedOn: t.common.publishedOn,
    locale: lang.locale,
  };
  return `<!DOCTYPE html>
<html lang="${ctx.lang}"${lang.dir === 'rtl' ? ' dir="rtl"' : ''} data-lang="${ctx.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${text(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${attr(absUrl(ctx.lang, pageKey))}">
${alternates.join('\n')}
  <link rel="icon" type="image/png" href="${ctx.asset('img/devia.png')}">
  <link rel="stylesheet" href="${ctx.asset('css/styles.css')}">
  <script>window.DEVIA_ROOT = '${ctx.deviaRoot}';</script>
  <script>window.DEVIA_I18N = ${JSON.stringify(dynamic)};</script>
  <script defer src="${ctx.asset('js/main.js')}"></script>
</head>`;
}

function langSwitcher(t, ctx, pageKey) {
  const options = LANGS.map((l) => {
    const url = pagePath(ctx.prefix, l.code, pageKey);
    const selected = l.code === ctx.lang ? ' selected' : '';
    return `          <option value="${attr(url)}" data-lang="${l.code}"${selected}>${text(l.label)}</option>`;
  }).join('\n');
  return `        <label class="lang-switch">
          <span class="sr-only">${text(t.common.langLabel)}</span>
          <select class="lang-select" aria-label="${attr(t.common.langLabel)}">
${options}
        </select>
        </label>`;
}

function header(t, ctx, pageKey) {
  const cur = (key) => (key === pageKey ? ' aria-current="page"' : '');
  return `  <header class="site-header">
    <nav class="container nav">
      <a class="brand" href="${pagePath(ctx.prefix, ctx.lang, 'home')}">
        <img src="${ctx.asset('img/devia.png')}" alt="" width="32" height="32">
        <span>${text(t.common.brand)}</span>
      </a>
      <button class="nav-toggle" type="button" aria-label="${attr(t.common.menuLabel)}" aria-expanded="false" aria-controls="nav-menu">☰</button>
      <div class="nav-links" id="nav-menu">
        <a href="${pagePath(ctx.prefix, ctx.lang, 'home')}#funcionalidades">${text(t.common.nav.features)}</a>
        <a href="${pagePath(ctx.prefix, ctx.lang, 'docs')}"${cur('docs')}>${text(t.common.nav.docs)}</a>
        <a href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}" class="btn btn-sm"${cur('descargas')}>${text(t.common.nav.download)}</a>
${langSwitcher(t, ctx, pageKey)}
      </div>
    </nav>
  </header>`;
}

function footer(t, ctx) {
  return `  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <strong>${text(t.common.brand)} Desktop</strong>
        <p>${text(t.common.footer.tagline)}</p>
      </div>
      <nav class="footer-links">
        <a href="${pagePath(ctx.prefix, ctx.lang, 'docs')}">${text(t.common.footer.docs)}</a>
        <a href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(t.common.footer.downloads)}</a>
        <a href="${ctx.updates}">${text(t.common.footer.updates)}</a>
      </nav>
    </div>
    <div class="container copyright">
      <p>${text(t.common.footer.copyright)}</p>
    </div>
  </footer>`;
}

function page(t, ctx, pageKey, meta, body) {
  return `${head(t, ctx, { ...meta, pageKey })}
<body>

${header(t, ctx, pageKey)}

${body}

${footer(t, ctx)}

</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// page bodies
// ---------------------------------------------------------------------------

function renderHome(t, ctx) {
  const h = t.home;
  const cards = h.features
    .map((f) => `          <article class="card">
            <h3>${f.title}</h3>
            <p>${f.body}</p>
          </article>`)
    .join('\n\n');
  const badges = h.badges
    .map((b) => `          <span class="badge">${b}</span>`)
    .join('\n');
  const steps = h.steps
    .map((s) => `          <div>
            <h3>${s.title}</h3>
            <p>${s.body}</p>
          </div>`)
    .join('\n');

  const body = `  <main>

    <section class="hero">
      <div class="container">
        <img class="hero-logo" src="${ctx.asset('img/devia.png')}" alt="${attr(h.heroLogoAlt)}" width="96" height="96">
        <h1>${h.heroTitle}</h1>
        <p class="lead">
          ${h.heroLead} <br>
          ${h.heroQuote}
        </p>
        <p class="hero-badges">
${badges}
          <span class="badge" id="hero-version" hidden></span>
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(h.ctaDownload)}</a>
          <a class="btn" href="${pagePath(ctx.prefix, ctx.lang, 'docs')}">${text(h.ctaDocs)}</a>
        </div>
      </div>
    </section>

    <section id="funcionalidades" class="section">
      <div class="container">
        <h2>${text(h.featuresTitle)}</h2>
        <div class="grid">

${cards}

        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <h2>${text(h.localTitle)}</h2>
        <p class="lead-sm">
          ${h.localLead}
        </p>
        <div class="cols-3">
${steps}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container center">
        <h2>${text(h.downloadTitle)}</h2>
        <p class="lead-sm">${h.downloadLead}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(h.downloadCta)}</a>
        </div>
      </div>
    </section>

  </main>`;

  return page(t, ctx, 'home', { title: h.meta.title, description: h.meta.description }, body);
}

function renderDocs(t, ctx) {
  const d = t.docs;
  const tocLabel = (id) => d.toc.find((x) => x.id === id).label;
  const toc = d.toc
    .map((x) => `        <a href="#${x.id}">${text(x.label)}</a>`)
    .join('\n');

  const s = d.sections;
  const list = (items) => items.map((i) => `          <li>${i}</li>`).join('\n');
  const olist = (items) => items.map((i) => `          <li>${i}</li>`).join('\n');

  const agentRows = s.agentes.rows
    .map((r) => `            <tr><td>${r.agent}</td><td>${r.notes}</td></tr>`)
    .join('\n');

  const featureGroups = s.funcionalidades.groups
    .map((g) => `        <h3>${text(g.title)}</h3>
        <ul>
${list(g.items)}
        </ul>`)
    .join('\n\n');

  const configRows = s.configuracion.rows
    .map((r) => `            <tr><td>${r.path}</td><td>${r.content}</td></tr>`)
    .join('\n');

  const faqItems = s.faq.items
    .map((i) => `        <h3>${text(i.q)}</h3>
        <p>${i.a}</p>`)
    .join('\n\n');

  const body = `  <main class="container docs-layout">

    <aside class="docs-toc" aria-label="${attr(d.tocTitle)}">
      <nav>
        <strong>${text(d.tocTitle)}</strong>
${toc}
      </nav>
    </aside>

    <article class="docs-content">

      <h1>${text(d.pageTitle)}</h1>

      <section id="que-es">
        <h2>${text(tocLabel('que-es'))}</h2>
${s.queEs.paras.map((p) => `        <p>${p}</p>`).join('\n')}
      </section>

      <section id="instalacion">
        <h2>${text(tocLabel('instalacion'))}</h2>

        <h3>${text(s.instalacion.win.title)}</h3>
        <ol>
${olist(s.instalacion.win.steps)}
        </ol>

        <h3>${text(s.instalacion.mac.title)}</h3>
        <ol>
${olist(s.instalacion.mac.steps)}
        </ol>

        <h3>${text(s.instalacion.linux.title)}</h3>
        <ol>
${olist(s.instalacion.linux.steps)}
        </ol>
      </section>

      <section id="primeros-pasos">
        <h2>${text(tocLabel('primeros-pasos'))}</h2>
        <ol>
${olist(s.primerosPasos.steps)}
        </ol>
      </section>

      <section id="agentes">
        <h2>${text(tocLabel('agentes'))}</h2>
        <p>${s.agentes.intro}</p>
        <table>
          <thead><tr><th>${text(s.agentes.tableHead.agent)}</th><th>${text(s.agentes.tableHead.notes)}</th></tr></thead>
          <tbody>
${agentRows}
          </tbody>
        </table>
        <p>${s.agentes.handoff}</p>
      </section>

      <section id="funcionalidades">
        <h2>${text(tocLabel('funcionalidades'))}</h2>

${featureGroups}
      </section>

      <section id="configuracion">
        <h2>${text(tocLabel('configuracion'))}</h2>
        <p>${s.configuracion.intro}</p>
        <table>
          <thead><tr><th>${text(s.configuracion.tableHead.path)}</th><th>${text(s.configuracion.tableHead.content)}</th></tr></thead>
          <tbody>
${configRows}
          </tbody>
        </table>
        <p>${s.configuracion.outro}</p>
      </section>

      <section id="actualizaciones">
        <h2>${text(tocLabel('actualizaciones'))}</h2>
${s.actualizaciones.paras.map((p) => `        <p>${p}</p>`).join('\n')}
        <pre><code>${text(s.actualizaciones.code)}</code></pre>
      </section>

      <section id="faq">
        <h2>${text(tocLabel('faq'))}</h2>

${faqItems}
      </section>

    </article>

  </main>`;

  return page(t, ctx, 'docs', { title: d.meta.title, description: d.meta.description }, body);
}

function renderDescargas(t, ctx) {
  const x = t.descargas;
  const p = x.platforms;
  const reqs = x.reqs.map((r) => `            <li>${r}</li>`).join('\n');

  const body = `  <main>
    <section class="section">
      <div class="container">
        <h1>${text(x.pageTitle)}</h1>
        <p class="lead-sm">
          ${text(x.lastVersionLabel)} <strong id="dl-version">—</strong>
          <span id="dl-date"></span>
        </p>

        <div class="grid grid-platforms">

          <article class="card platform" data-platform="win32-x64">
            <h2>${p.windows.title}</h2>
            <p>${p.windows.desc}</p>
            <a class="btn btn-primary dl-btn" data-key="win32-x64" href="#" hidden>${text(p.windows.btn)}</a>
            <p class="dl-fallback" data-key="win32-x64">${text(p.windows.soon)}</p>
            <p class="hint">${p.windows.hint}</p>
          </article>

          <article class="card platform" data-platform="darwin">
            <h2>${p.macos.title}</h2>
            <p>${p.macos.desc}</p>
            <a class="btn btn-primary dl-btn" data-key="darwin-arm64" href="#" hidden>${text(p.macos.btnArm)}</a>
            <a class="btn btn-primary dl-btn" data-key="darwin-x64" href="#" hidden>${text(p.macos.btnIntel)}</a>
            <p class="dl-fallback" data-key="darwin-arm64">${text(p.macos.soon)}</p>
            <p class="hint">${p.macos.hint}</p>
          </article>

          <article class="card platform" data-platform="linux">
            <h2>${p.linux.title}</h2>
            <p>${p.linux.desc}</p>
            <a class="btn btn-primary dl-btn" data-key="linux-x64-appimage" href="#" hidden>${text(p.linux.btnAppimage)}</a>
            <a class="btn btn-primary dl-btn" data-key="linux-x64-deb" href="#" hidden>${text(p.linux.btnDeb)}</a>
            <p class="dl-fallback" data-key="linux-x64-appimage">${text(p.linux.soon)}</p>
            <p class="hint">${p.linux.hint}</p>
          </article>

        </div>

        <section class="section-inner">
          <h2>${text(x.notesTitle)}</h2>
          <p id="dl-notes">—</p>
        </section>

        <section class="section-inner">
          <h2>${text(x.updatesTitle)}</h2>
          <p>${x.updatesBody}</p>
        </section>

        <section class="section-inner">
          <h2>${text(x.reqTitle)}</h2>
          <ul>
${reqs}
          </ul>
        </section>

      </div>
    </section>
  </main>`;

  return page(t, ctx, 'descargas', { title: x.meta.title, description: x.meta.description }, body);
}

/** The 404 is a standalone, self-contained page (no shared chrome): GitHub
 *  Pages serves it from the site root for any unknown path and language. */
function render404(catalogue) {
  const t = catalogue[DEFAULT_LANG];
  const n = t.notFound;
  return `<!DOCTYPE html>
<html lang="${DEFAULT_LANG}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${text(n.title)}</title>
  <style>
    body {
      margin: 0; min-height: 100vh; display: grid; place-items: center;
      background: #121212; color: #e6e6eb;
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      text-align: center;
    }
    h1 { font-size: 3rem; margin: 0 0 0.5rem; }
    p { color: #a6a6b3; }
    a { color: #8ab4f8; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>${text(n.message)}</p>
    <p><a href="javascript:history.back()">${text(n.back)}</a> · <a href="/" id="home-link">${text(n.home)}</a></p>
  </main>
  <script>
    // En una project page el sitio cuelga del primer segmento de la ruta
    // (p. ej. /devia/ o /devia.github.io/); en una org page cuelga de la raíz.
    (function () {
      var seg = location.pathname.split('/')[1];
      if (seg) document.getElementById('home-link').href = '/' + seg + '/';
    })();
  </script>
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// driver
// ---------------------------------------------------------------------------

function loadCatalogue() {
  LANGS = LANGS.filter(({ code }) => existsSync(join(I18N_DIR, `${code}.json`)));
  if (!LANGS.some((l) => l.code === DEFAULT_LANG)) {
    throw new Error(`Missing default translation file: build/i18n/${DEFAULT_LANG}.json`);
  }
  const catalogue = {};
  for (const { code } of LANGS) {
    catalogue[code] = JSON.parse(readFileSync(join(I18N_DIR, `${code}.json`), 'utf8'));
  }
  return catalogue;
}

const RENDERERS = { home: renderHome, docs: renderDocs, descargas: renderDescargas };

function ctxFor(lang, page) {
  const prefix = prefixFor(lang, page);
  return {
    lang,
    prefix,
    asset: (p) => `${prefix}assets/${p}`,
    deviaRoot: prefix ? prefix.replace(/\/$/, '') : '.',
    updates: `${prefix}updates/latest.json`,
  };
}

function outPathFor(lang, page) {
  const langSeg = lang === DEFAULT_LANG ? '' : `${lang}/`;
  return join(ROOT, `${langSeg}${page.seg}index.html`);
}

/** Remove generated language folders + root pages from a previous run so that
 *  removing a language or page never leaves stale files behind. */
function clean() {
  for (const { code } of LANGS) {
    if (code === DEFAULT_LANG) continue;
    const dir = join(ROOT, code);
    if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
  }
}

function build() {
  const catalogue = loadCatalogue();
  clean();

  let count = 0;
  for (const { code } of LANGS) {
    const t = catalogue[code];
    for (const page of PAGES) {
      const ctx = ctxFor(code, page);
      // Cross-page links inside translated strings use tokens so the relative
      // path stays correct whatever the language folder depth.
      const html = RENDERERS[page.key](t, ctx)
        .replaceAll('{{home}}', pagePath(ctx.prefix, code, 'home'))
        .replaceAll('{{docs}}', pagePath(ctx.prefix, code, 'docs'))
        .replaceAll('{{descargas}}', pagePath(ctx.prefix, code, 'descargas'))
        .replaceAll('{{updates}}', ctx.updates);
      const out = outPathFor(code, page);
      mkdirSync(dirname(out), { recursive: true });
      writeFileSync(out, html);
      count += 1;
    }
  }

  writeFileSync(join(ROOT, '404.html'), render404(catalogue));
  count += 1;

  console.log(`✔ Generated ${count} pages for ${LANGS.length} languages.`);
}

build();

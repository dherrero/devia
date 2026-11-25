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
import { schemaErrors } from './content-check.mjs';

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
  <meta name="color-scheme" content="light dark">
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
          <span class="visually-hidden">${text(t.common.langLabel)}</span>
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
      <button class="nav-toggle key key-sm" type="button" aria-label="${attr(t.common.menuLabel)}" aria-expanded="false" aria-controls="nav-menu"><span aria-hidden="true">≡</span></button>
      <div class="nav-links" id="nav-menu">
        <a href="${pagePath(ctx.prefix, ctx.lang, 'home')}#funcionalidades">${text(t.common.nav.features)}</a>
        <a href="${pagePath(ctx.prefix, ctx.lang, 'docs')}"${cur('docs')}>${text(t.common.nav.docs)}</a>
${langSwitcher(t, ctx, pageKey)}
        <a href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}" class="key key-sm key-primary"${cur('descargas')}>${text(t.common.nav.download)}</a>
      </div>
    </nav>
  </header>`;
}

function footer(t, ctx) {
  return `  <footer class="site-footer">
    <div class="container footer-mast">
      <p class="footer-word">${text(t.common.brand)} Desktop</p>
      <nav class="footer-links">
        <a href="${pagePath(ctx.prefix, ctx.lang, 'docs')}">${text(t.common.footer.docs)}</a>
        <a href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(t.common.footer.downloads)}</a>
        <a href="${ctx.updates}">${text(t.common.footer.updates)}</a>
      </nav>
    </div>
    <div class="container footer-line">
      <p>${text(t.common.footer.tagline)}</p>
      <p>${text(t.common.footer.copyright)}</p>
    </div>
  </footer>`;
}

function page(t, ctx, pageKey, meta, body, extraScript = '') {
  return `${head(t, ctx, { ...meta, pageKey })}
<body>

${header(t, ctx, pageKey)}

${body}

${footer(t, ctx)}
${extraScript}
</body>
</html>
`;
}

// ---------------------------------------------------------------------------
// page bodies
// ---------------------------------------------------------------------------

/** Language-independent product terms shown as the object of each home stage
 *  (mode names, MCP servers, kanban columns, Telegram commands): the same
 *  literals the app itself uses, so they are never translated. */
const STAGE_OBJECTS = {
  agentes: () => `<ul class="chips" aria-label="plan, apply, apply-yolo">
              <li><code>plan</code></li>
              <li><code>apply</code></li>
              <li><code>apply-yolo</code></li>
            </ul>`,
  contexto: () => `<ul class="chips" aria-label="MCP">
              <li><code>devia-memory</code></li>
              <li><code>devia-code-graph</code></li>
              <li><code>devia-code-mode</code></li>
            </ul>`,
  metodo: () => `<ul class="columns-strip" aria-label="kanban">
              <li><code>backlog</code></li>
              <li><code>todo</code></li>
              <li><code>in_progress</code></li>
              <li><code>done</code></li>
            </ul>`,
  git: () => `<ul class="panes" aria-label="git worktree">
              <li><code>worktree 1</code></li>
              <li><code>worktree 2</code></li>
              <li><code>worktree 3</code></li>
              <li><code>worktree 4</code></li>
            </ul>`,
  remoto: () => `<ul class="chips" aria-label="Telegram">
              <li><code>/status</code></li>
              <li><code>/mode</code></li>
              <li><code>/agent</code></li>
              <li><code>/stop</code></li>
            </ul>`,
};

/** The hero visual: the diff viewer built from real markup inside a slot, so
 *  a real capture of the app can replace it (assets/img/devia-app.png). */
function heroShot(alt) {
  return `<figure class="shot" data-slot="devia-app" data-alt="${attr(alt)}" role="img" aria-label="${attr(alt)}">
        <div class="shot-bar">
          <code class="shot-file">total.ts</code>
          <ul class="shot-modes" aria-hidden="true">
            <li><code>plan</code></li>
            <li class="is-on"><code>apply</code></li>
            <li><code>apply-yolo</code></li>
          </ul>
        </div>
        <pre class="shot-code" aria-hidden="true"><code><span class="ln">1</span><span class="row">export function total(items: number[]): number {</span>
<span class="ln">2</span><span class="row del">  let sum = 0;</span>
<span class="ln">3</span><span class="row del">  for (let i = 0; i &lt;= items.length; i++) sum += items[i];</span>
<span class="ln">2</span><span class="row add">  return items.reduce((sum, n) =&gt; sum + n, 0);</span>
<span class="ln">3</span><span class="row">}</span></code></pre>
        <div class="shot-bar shot-bar-2">
          <code class="shot-file">total.test.ts</code>
        </div>
        <pre class="shot-code" aria-hidden="true"><code><span class="ln">1</span><span class="row add">test("sums every item", () =&gt; {</span>
<span class="ln">2</span><span class="row add">  expect(total([1, 2, 3])).toBe(6);</span>
<span class="ln">3</span><span class="row add">});</span></code></pre>
      </figure>`;
}

function renderHome(t, ctx) {
  const h = t.home;
  const hero = h.hero;
  const stages = h.sections
    .map((s) => {
      const object = STAGE_OBJECTS[s.id] ? STAGE_OBJECTS[s.id]() : '';
      return `        <li class="stage" id="${attr(s.id)}">
          <div class="stage-text">
            <h2>${text(s.title)}</h2>
            <p>${s.body}</p>
          </div>
          <div class="stage-object">
            ${object}
          </div>
        </li>`;
    })
    .join('\n');

  const body = `  <main>

    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-text">
          <h1>${hero.title}</h1>
          <p class="lead">${hero.lead}</p>
          <div class="actions">
            <a class="key key-primary" href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(hero.cta)}</a>
            <a class="key" href="${pagePath(ctx.prefix, ctx.lang, 'docs')}">${text(hero.ctaSecondary)}</a>
          </div>
        </div>
        ${heroShot(hero.mediaAlt)}
      </div>
    </section>

    <section id="funcionalidades" class="stages-section">
      <div class="container">
        <ol class="stages">
${stages}
        </ol>
      </div>
    </section>

    <section class="band">
      <div class="container band-grid">
        <h2>${text(h.local.title)}</h2>
        <ul class="facts">
${h.local.items.map((i) => `          <li>${i}</li>`).join('\n')}
        </ul>
      </div>
    </section>

    <section class="close">
      <div class="container close-grid">
        <div>
          <h2>${text(h.download.title)}</h2>
          <p class="lead">${text(h.download.lead)}</p>
          <p class="close-meta">${text(h.download.platforms)} <span id="home-version" hidden></span></p>
        </div>
        <div class="actions">
          <a class="key key-primary" href="${pagePath(ctx.prefix, ctx.lang, 'descargas')}">${text(h.download.cta)}</a>
        </div>
      </div>
    </section>

  </main>`;

  const slotScript = `
  <script>window.hallmarkSlots = (m) => { for (const [k, v] of Object.entries(m)) { const s = document.querySelector('[data-slot="' + k + '"]'); if (!s) continue; const im = new Image(); im.src = typeof v === 'string' ? v : v.src; im.alt = (typeof v === 'object' && v.alt) || s.dataset.alt || ''; s.querySelectorAll(':scope > img').forEach((o) => o.remove()); s.prepend(im); } };
  // To show a real capture of the app instead of the built sample, put it at
  // assets/img/devia-app.png and call: hallmarkSlots({ 'devia-app': '${ctx.asset('img/devia-app.png')}' })
  </script>`;

  return page(t, ctx, 'home', { title: h.meta.title, description: h.meta.description }, body, slotScript);
}

function renderDocs(t, ctx) {
  const d = t.docs;
  const tocLabel = (id) => d.toc.find((x) => x.id === id).label;
  const toc = d.toc
    .map((x) => `        <a href="#${x.id}">${text(x.label)}</a>`)
    .join('\n');

  const s = d.sections;
  const list = (items) => items.map((i) => `          <li>${i}</li>`).join('\n');
  const olist = list;

  const agentRows = s.agentes.rows
    .map((r) => `            <tr><td>${r.agent}</td><td>${r.notes}</td></tr>`)
    .join('\n');

  const featureGroups = s.funcionalidades.groups
    .map((g) => `        <h3>${text(g.title)}</h3>
        <ul>
${list(g.items)}
        </ul>`)
    .join('\n\n');

  const cap = s.capacidades;
  const capColumn = (title, items) => `          <div class="cap">
            <h3>${text(title)}</h3>
            <ul>
${list(items)}
            </ul>
          </div>`;

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
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">${text(s.agentes.tableHead.agent)}</th><th scope="col">${text(s.agentes.tableHead.notes)}</th></tr></thead>
            <tbody>
${agentRows}
            </tbody>
          </table>
        </div>
        <p>${s.agentes.handoff}</p>
      </section>

      <section id="funcionalidades">
        <h2>${text(tocLabel('funcionalidades'))}</h2>

${featureGroups}
      </section>

      <section id="capacidades">
        <h2>${text(tocLabel('capacidades'))}</h2>
        <p>${cap.intro}</p>
        <div class="caps">
${capColumn(cap.doneTitle, cap.done)}
${capColumn(cap.partialTitle, cap.partial)}
${capColumn(cap.missingTitle, cap.missing)}
        </div>
      </section>

      <section id="configuracion">
        <h2>${text(tocLabel('configuracion'))}</h2>
        <p>${s.configuracion.intro}</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th scope="col">${text(s.configuracion.tableHead.path)}</th><th scope="col">${text(s.configuracion.tableHead.content)}</th></tr></thead>
            <tbody>
${configRows}
            </tbody>
          </table>
        </div>
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
    <section class="downloads">
      <div class="container">
        <h1>${text(x.pageTitle)}</h1>
        <p class="lead">
          ${text(x.lastVersionLabel)} <strong id="dl-version"></strong>
          <span id="dl-date"></span>
        </p>

        <div class="platforms">

          <article class="platform cut" data-platform="win32-x64">
            <h2>${text(p.windows.title)}</h2>
            <p>${p.windows.desc}</p>
            <a class="key dl-btn" data-key="win32-x64" href="#" hidden>${text(p.windows.btn)}</a>
            <p class="dl-fallback" data-key="win32-x64">${text(p.windows.soon)}</p>
            <p class="hint">${p.windows.hint}</p>
          </article>

          <article class="platform cut" data-platform="darwin">
            <h2>${text(p.macos.title)}</h2>
            <p>${p.macos.desc}</p>
            <a class="key dl-btn" data-key="darwin-arm64" href="#" hidden>${text(p.macos.btnArm)}</a>
            <a class="key dl-btn" data-key="darwin-x64" href="#" hidden>${text(p.macos.btnIntel)}</a>
            <p class="dl-fallback" data-key="darwin-arm64">${text(p.macos.soon)}</p>
            <p class="hint">${p.macos.hint}</p>
          </article>

          <article class="platform cut" data-platform="linux">
            <h2>${text(p.linux.title)}</h2>
            <p>${p.linux.desc}</p>
            <a class="key dl-btn" data-key="linux-x64-appimage" href="#" hidden>${text(p.linux.btnAppimage)}</a>
            <a class="key dl-btn" data-key="linux-x64-deb" href="#" hidden>${text(p.linux.btnDeb)}</a>
            <p class="dl-fallback" data-key="linux-x64-appimage">${text(p.linux.soon)}</p>
            <p class="hint">${p.linux.hint}</p>
          </article>

        </div>

      </div>
    </section>

    <section class="downloads-more">
      <div class="container downloads-info">
          <section>
            <h2>${text(x.notesTitle)}</h2>
            <p id="dl-notes"></p>
          </section>

          <section>
            <h2>${text(x.updatesTitle)}</h2>
            <p>${x.updatesBody}</p>
          </section>

          <section>
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
  <meta name="color-scheme" content="light dark">
  <title>${text(n.title)}</title>
  <meta name="description" content="${attr(n.message)}">
  <style>
    /* Hallmark · shape: error page, one centred column · genre: modern-minimal · theme: Cobalt, recoloured with Devia's violet tokens · redesign: full
     * hero: Corridor · nav: none · footer: none · imagery: none · signature: the number 404 set large
     * axes: light/grotesk-sans/cool · posture: restrained · contrast: pass · fold: pass · v2.0.0 */
    /* Hallmark · pre-emit critique: P3 H4 E4 S3 R5 V3 · weakest: P, an error page has little to argue; kept to one number, one line and two links */
    :root {
      color-scheme: light dark;
      --color-paper: oklch(98.5% 0.003 270); --color-ink: oklch(12% 0.015 270); --color-muted: oklch(48% 0.014 270); --color-accent: oklch(55% 0.24 280); --color-accent-ink: oklch(98.5% 0.006 285);
      --font-body: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      --space-sm: 12px; --space-xl: 40px;
    }
    @media (prefers-color-scheme: dark) {
      :root { --color-paper: oklch(9% 0.012 270); --color-ink: oklch(96% 0.004 270); --color-muted: oklch(68% 0.012 270); --color-accent: oklch(72% 0.26 295); --color-accent-ink: oklch(9% 0.012 270); }
    }
    html, body { overflow-x: clip; }
    body {
      margin: 0; min-height: 100svh; display: grid; place-items: center;
      background: var(--color-paper); color: var(--color-ink);
      font-family: var(--font-body); text-align: center; padding-inline: var(--space-xl);
    }
    ::selection { background: var(--color-accent); color: var(--color-accent-ink); }
    html { scrollbar-color: var(--color-muted) var(--color-paper); }
    h1 { font-size: 3rem; margin: 0 0 var(--space-sm); overflow-wrap: break-word; min-width: 0; text-wrap: balance; }
    p { color: var(--color-muted); }
    a { color: var(--color-accent); }
    a:hover { text-decoration-thickness: 2px; }
    a:active { opacity: 0.7; }
    a:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }
  </style>
</head>
<body>
  <main>
    <h1>404</h1>
    <p>${text(n.message)}</p>
    <p><a href="javascript:history.back()">${text(n.back)}</a><br><a href="/" id="home-link">${text(n.home)}</a></p>
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

/** `--langs es,en` builds only those languages (useful while a new content
 *  schema is still being translated); without it every language builds. */
function requestedLangs() {
  const i = process.argv.indexOf('--langs');
  return i === -1 ? null : String(process.argv[i + 1] || '').split(',').filter(Boolean);
}

function loadCatalogue() {
  const wanted = requestedLangs();
  LANGS = LANGS.filter(({ code }) => existsSync(join(I18N_DIR, `${code}.json`)) && (!wanted || wanted.includes(code)));
  if (!LANGS.some((l) => l.code === DEFAULT_LANG)) {
    throw new Error(`Missing default translation file: build/i18n/${DEFAULT_LANG}.json`);
  }
  const catalogue = {};
  for (const { code } of LANGS) {
    catalogue[code] = JSON.parse(readFileSync(join(I18N_DIR, `${code}.json`), 'utf8'));
  }
  // es.json is the reference: every other language must have exactly its keys.
  for (const { code } of LANGS) {
    if (code === DEFAULT_LANG) continue;
    const errors = schemaErrors(catalogue[code], catalogue[DEFAULT_LANG]);
    if (errors.length) {
      throw new Error(`${code}.json does not match es.json:\n  ${errors.slice(0, 10).join('\n  ')}${errors.length > 10 ? `\n  … and ${errors.length - 10} more` : ''}`);
    }
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

/** Remove generated language folders from a previous run so that removing a
 *  language or page never leaves stale files behind. */
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

/* Devia Desktop site — language handling + downloads manifest.
   - window.DEVIA_ROOT:  site-root-relative prefix ('.', '..', '../..').
   - window.DEVIA_I18N:  dynamic strings for the current language (manifest UI).
   Both are emitted per page by build/build.mjs. */
(function () {
  'use strict';

  var root = window.DEVIA_ROOT || '.';
  var i18n = window.DEVIA_I18N || {};
  var current = document.documentElement.getAttribute('data-lang') || 'es';

  // Mirrors build.mjs LANGS / the app's supported-languages.ts.
  var SUPPORTED = ['es', 'en', 'ca', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'hi', 'ar'];

  /** Closest supported code for a BCP-47 tag ('zh-CN' -> 'zh'), or null. */
  function resolveLang(tag) {
    if (!tag) return null;
    tag = String(tag).toLowerCase();
    if (SUPPORTED.indexOf(tag) !== -1) return tag;
    var primary = tag.split(/[-_]/)[0];
    return SUPPORTED.indexOf(primary) !== -1 ? primary : null;
  }

  /** URL of the current page in another language, from the switcher options. */
  function urlForLang(code) {
    var opt = document.querySelector('.lang-select option[data-lang="' + code + '"]');
    return opt ? opt.value : null;
  }

  function redirectTo(code) {
    var url = urlForLang(code);
    if (url == null) return false;
    location.replace(url + location.hash);
    return true;
  }

  // --- language selection -------------------------------------------------
  // Runs as a deferred script (DOM parsed, switcher present, before paint):
  //  1. An explicit choice (saved on switcher use) always wins, every page.
  //  2. Otherwise, on first visit of the session, follow the browser locale.
  var redirecting = false;
  try {
    var stored = localStorage.getItem('deviaLang');
    if (stored && stored !== current && SUPPORTED.indexOf(stored) !== -1) {
      redirecting = redirectTo(stored);
    } else if (!stored && !sessionStorage.getItem('deviaAuto')) {
      sessionStorage.setItem('deviaAuto', '1');
      var detected = resolveLang(
        navigator.language || (navigator.languages && navigator.languages[0]),
      );
      if (detected && detected !== current) redirecting = redirectTo(detected);
    }
  } catch (e) {
    /* storage/navigation blocked: stay on the current language */
  }
  if (redirecting) return; // leaving this page; skip the rest

  // --- nav toggle + language switcher wiring ------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (nav && toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav-links a').forEach(function (link) {
        link.addEventListener('click', function () {
          nav.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    var select = document.querySelector('.lang-select');
    if (select) {
      select.addEventListener('change', function () {
        var opt = select.options[select.selectedIndex];
        try {
          localStorage.setItem('deviaLang', opt.getAttribute('data-lang'));
        } catch (e) { /* ignore */ }
        location.href = opt.value + location.hash;
      });
    }
  });

  // --- downloads manifest -------------------------------------------------
  fetch(root + '/updates/latest.json', { cache: 'no-store' })
    .then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      return res.json();
    })
    .then(apply)
    .catch(function () { /* sin manifiesto: la página muestra los fallbacks estáticos */ });

  function apply(manifest) {
    if (!manifest || !manifest.version) return;

    var heroVersion = document.getElementById('hero-version');
    if (heroVersion) {
      heroVersion.textContent = (i18n.heroVersionLabel || 'v') + manifest.version;
      heroVersion.hidden = false;
    }

    var dlVersion = document.getElementById('dl-version');
    if (dlVersion) dlVersion.textContent = 'v' + manifest.version;

    var dlDate = document.getElementById('dl-date');
    if (dlDate && manifest.pubDate) {
      var d = new Date(manifest.pubDate);
      if (!isNaN(d)) {
        dlDate.textContent = (i18n.publishedOn || ' · ') + d.toLocaleDateString(i18n.locale || 'es-ES');
      }
    }

    var dlNotes = document.getElementById('dl-notes');
    if (dlNotes && manifest.notes) dlNotes.textContent = manifest.notes;

    var platforms = manifest.platforms || {};
    document.querySelectorAll('.dl-btn').forEach(function (btn) {
      var entry = platforms[btn.dataset.key];
      if (entry && entry.url) {
        btn.href = entry.url;
        btn.hidden = false;
        if (entry.size) {
          btn.title = (entry.size / (1024 * 1024)).toFixed(0) + ' MB';
        }
      }
    });

    document.querySelectorAll('.dl-fallback').forEach(function (el) {
      var entry = platforms[el.dataset.key];
      if (entry && entry.url) el.hidden = true;
    });
  }
})();

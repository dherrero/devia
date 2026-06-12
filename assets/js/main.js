/* Rellena versión, fecha, notas y enlaces de descarga leyendo updates/latest.json.
   window.DEVIA_ROOT lo define cada página ('.' en la raíz, '..' en subcarpetas). */
(function () {
  'use strict';

  var root = window.DEVIA_ROOT || '.';

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    if (!nav || !toggle) return;

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
  });

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
      heroVersion.textContent = 'Última versión: v' + manifest.version;
      heroVersion.hidden = false;
    }

    var dlVersion = document.getElementById('dl-version');
    if (dlVersion) dlVersion.textContent = 'v' + manifest.version;

    var dlDate = document.getElementById('dl-date');
    if (dlDate && manifest.pubDate) {
      var d = new Date(manifest.pubDate);
      if (!isNaN(d)) dlDate.textContent = ' · publicada el ' + d.toLocaleDateString('es-ES');
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

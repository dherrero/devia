# devia.github.io

Sitio público de **Devia Desktop** (GitHub Pages): mini-documentación, descargas y feed
de actualizaciones de la app de escritorio.

URL publicada: `https://dherrero.github.io/devia/`

## Estructura

```
.
├── index.html            # Landing: qué es Devia Desktop + funcionalidades
├── docs/                 # Mini-documentación (instalación, primeros pasos, FAQ…)
├── descargas/            # Página de descargas (se rellena desde updates/latest.json)
├── updates/
│   ├── latest.json       # ★ Manifiesto de actualizaciones que consulta la app
│   ├── win/              # (opcional) latest.yml de electron-updater
│   ├── mac/              # (opcional) latest-mac.yml
│   └── linux/            # (opcional) latest-linux.yml
├── assets/               # CSS, JS y logo
├── PUBLISHING.md         # Cómo publicar una versión nueva
└── .nojekyll             # Sirve los ficheros tal cual (sin Jekyll)
```

## Cómo funciona

- El sitio es **HTML/CSS/JS estático puro** — sin build, sin dependencias.
- `updates/latest.json` es la única fuente de verdad de la última versión: la página de
  descargas lo lee con `fetch` para pintar versión, fecha, notas y botones, y la app de
  escritorio lo consulta para detectar actualizaciones.
- Los binarios se publican como assets de **GitHub Releases de este repo** (GitHub Pages
  no admite ficheros > 100 MB); el manifiesto enlaza a esos assets.

## Publicar una versión

Ver [`PUBLISHING.md`](PUBLISHING.md).

## Desarrollo local

Cualquier servidor estático sirve:

```bash
npx serve .
# o
python -m http.server 8080
```

## Activar GitHub Pages

Settings → Pages → Build and deployment → Source: **Deploy from a branch** →
Branch: `main` / `/ (root)`.

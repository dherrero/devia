# AGENTS.md — sitio de Devia Desktop

Documentación pública (GitHub Pages) de **Devia Desktop**. Sitio **estático**,
servido directamente desde el repo (con `.nojekyll`), sin framework.

Base publicada: `https://dherrero.github.io/devia/`.

## Internacionalización (11 idiomas)

El sitio está traducido a los **mismos 11 idiomas que la app** (mantener en
sincronía con `apps/desktop/renderer/app/core/i18n/supported-languages.ts` del
monorepo privado):

`es` · `en` · `ca` (Valencià) · `fr` · `de` · `it` · `pt` · `ru` · `zh` · `hi` · `ar` (RTL)

### Arquitectura: páginas estáticas por idioma, generadas

Las páginas HTML **se generan**; no se editan a mano. La estructura HTML vive
una sola vez en `build/build.mjs` y cada idioma solo aporta sus textos en
`build/i18n/<código>.json`. Así la estructura nunca diverge entre traducciones.

- **Fuente de contenido:** `build/i18n/<código>.json` (mismo esquema de claves en
  todos; `es.json` es la referencia).
- **Generador:** `build/build.mjs` (Node, sin dependencias).
- **Salida (commiteada):** páginas `*.html` en la raíz y en una carpeta por idioma.

```
/            /docs/        /descargas/        → es (idioma por defecto, en la raíz)
/en/  /en/docs/  /en/descargas/               → en
/fr/  /fr/docs/  /fr/descargas/               → fr
…                                              (una carpeta por idioma)
/404.html                                      → es, compartida
```

El idioma va **reflejado en el path por carpeta** (`/en`, `/en/docs`, …). El
slug de las páginas (`docs`, `descargas`) NO se localiza: es el mismo en todos
los idiomas, para mantener simples los enlaces y la generación.

### Regenerar el sitio

Tras editar cualquier `build/i18n/*.json` o `build/build.mjs`:

```bash
npm run build        # = node build/build.mjs
```

Genera 34 páginas (11 idiomas × 3 + `404.html`) y reescribe la salida. **Commitea
los `*.html` resultantes** junto al cambio de contenido (GitHub Pages los sirve
tal cual). Si falta el JSON de un idioma, ese idioma simplemente se omite (el
sitio degrada con elegancia); `es.json` es obligatorio.

### Selección de idioma (runtime)

Lógica en `assets/js/main.js`:

- **Selector** en la cabecera (`<select class="lang-select">`): al cambiar, guarda
  la elección en `localStorage.deviaLang` y navega a la misma página en ese idioma.
- **Detección por navegador:** en la primera visita de la sesión y sin preferencia
  guardada, se redirige al idioma de `navigator.language` (mapeado al soportado más
  cercano, p. ej. `zh-CN` → `zh`). Se usa `sessionStorage.deviaAuto` como guarda
  anti-bucle.
- **La elección explícita manda:** si `deviaLang` está fijado, se respeta en cada
  página por encima de la detección.
- **SEO:** cada página lleva `<link rel="canonical">` y `hreflang` para los 11
  idiomas + `x-default` (→ `es`). La detección es solo una conveniencia JS; cada
  página es estática e indexable por separado.

### Detalles de implementación

- **Tokens de enlace entre páginas:** dentro de los textos traducidos, los enlaces
  a otras páginas usan tokens `{{home}}`, `{{docs}}`, `{{descargas}}`, `{{updates}}`
  que el build sustituye por la ruta relativa correcta según la profundidad del
  idioma. Nunca pongas rutas relativas a mano en los JSON.
- **No traducir** (mantener verbatim en los JSON): contenido dentro de `<code>…</code>`
  (rutas, comandos, nombres de fichero), el bloque `curl`, nombres de producto
  (Devia, Claude Code, Codex, Windows, macOS…), emojis y la lista de códigos
  `(es, en, ca, …)`. Sí se traducen los nombres de idioma en la FAQ.
- **Etiquetas HTML inline** (`<strong>`, `<em>`, `<a>`, `<br>`) van dentro de los
  valores de los JSON; el build las inyecta sin escapar (contenido de confianza,
  autoría propia). Los títulos y `meta description` sí se escapan como atributo.
- **RTL (árabe):** el build pone `dir="rtl"` en `<html>`; los ajustes de estilo
  están en la sección "RTL" de `assets/css/styles.css`.
- **Textos dinámicos del manifiesto** (versión, fecha de publicación) se pasan por
  página vía `window.DEVIA_I18N` y los consume `main.js` al leer
  `updates/latest.json`.

## Descargas y actualizaciones

`updates/latest.json` alimenta los botones de descarga y el badge de versión. Lo
genera el pipeline de release (ver `PUBLISHING.md`); no se edita a mano. La app
ya instalada se auto-actualiza vía las GitHub Releases de este repo.

## Convenciones

- Mantén el conteo y la lista de idiomas en sincronía con la app (web y app deben
  coincidir; hay textos que enumeran los idiomas).
- Para **añadir un idioma**: añade su entrada a `LANGS` en `build/build.mjs`, crea
  `build/i18n/<código>.json`, añade su código a `SUPPORTED` en `assets/js/main.js`
  y ejecuta `npm run build`.
- Para **cambiar contenido**: edita el `es.json` (referencia) y replica el cambio
  en los demás idiomas; luego `npm run build`.

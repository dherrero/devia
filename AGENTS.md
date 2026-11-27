# AGENTS.md — sitio de Devia Desktop

Documentación pública (GitHub Pages) de **Devia Desktop**. Sitio **estático**,
servido directamente desde el repo (con `.nojekyll`), sin framework.

Base publicada: `https://dherrero.github.io/devia/`.

## Internacionalización (11 idiomas)

El sitio está traducido a los **mismos 11 idiomas que la app** (mantener en
sincronía con `src/renderer/app/core/i18n/supported-languages.ts` del repo
[`dherrero/devia-app`](https://github.com/dherrero/devia-app)):

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
/                  /docs/                 /descargas/                → es (idioma por defecto, en la raíz)
/i18n/en/          /i18n/en/docs/         /i18n/en/descargas/        → en
/i18n/fr/          /i18n/fr/docs/         /i18n/fr/descargas/        → fr
…                                                                    (una carpeta por idioma, dentro de i18n/)
/404.html                                                            → es, compartida
```

El idioma va **reflejado en el path por carpeta** (`/i18n/en`, `/i18n/en/docs`, …); las
carpetas de todos los idiomas distintos del español cuelgan de `i18n/` para no
ensuciar la raíz del repo. (No confundir con `build/i18n/`, que guarda los
textos fuente.) Las URLs antiguas `/en/…`, de cuando cada idioma vivía en la
raíz, las redirige el script de `404.html` a `/i18n/en/…`. El
slug de las páginas (`docs`, `descargas`) NO se localiza: es el mismo en todos
los idiomas, para mantener simples los enlaces y la generación.

### Regenerar el sitio

Tras editar cualquier `build/i18n/*.json` o `build/build.mjs`:

```bash
npm run build        # = node build/build.mjs
```

Genera 34 páginas (11 idiomas × 3 + `404.html`) y reescribe la salida (el build borra
antes `i18n/` y cualquier carpeta de idioma antigua de la raíz). **Commitea
los `*.html` resultantes** junto al cambio de contenido (GitHub Pages los sirve
tal cual). Si falta el JSON de un idioma, ese idioma simplemente se omite;
`es.json` es obligatorio. Si un idioma tiene claves de más o de menos respecto a
`es.json`, el build falla con `xx.json does not match es.json` y la lista de
claves. `npm run build -- --langs es,en` construye solo esos idiomas (útil
mientras un esquema nuevo aún no está traducido).

Comprobaciones de contenido (`build/content-check.mjs`):

```bash
npm run check:content   # esquema idéntico a es.json en los 11 idiomas + límites de la portada
npm test                # pruebas del comprobador (node --test)
```

Los límites de la portada vienen de Hallmark: titular del hero de 7 palabras o
menos (50 caracteres), una frase de 12 palabras o menos, `home` con 450 palabras
visibles como máximo, sin emojis, sin `·` ni flechas en `home`, y ninguna
afirmación sobre «paletas Material 3» (la app tiene 2 familias, violeta y navy,
en claro/oscuro).

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

## Contenido: veracidad

La web describe lo que Devia **hace hoy**, no lo que promete. La fuente de verdad
es `docs/capabilities.md` y `docs/features/*.md` del repo `dherrero/devia-app`:
nada que esa matriz marque como `not implemented` va en la portada, y lo
`partial` lleva su matiz (importar sesiones solo de Claude Code, Codex y Grok;
reanudar tras un límite de uso solo con Claude Code; Telegram solo con Devia
abierto; dictado solo en español; idiomas de la app completos solo en es y en).
`docs.sections.capacidades` resume lo que hace, lo que hace en parte y lo que no
hace todavía: revísalo cada vez que cambie la matriz.

Esquema de `home` en los JSON: `hero` (title, lead, cta, ctaSecondary, mediaAlt),
`sections[]` (5 etapas: id, title, body; los ids `agentes`, `contexto`, `metodo`,
`git` y `remoto` tienen un objeto fijo en `build.mjs`, `STAGE_OBJECTS`),
`local` (title + 3 `items`) y `download`. Los textos largos van a `docs`.

## Diseño (Hallmark)

Rediseñado con la skill **Hallmark** (v2.0.0, vendorizada en
`.claude/skills/hallmark`, copia de <https://github.com/Nutlope/hallmark>;
no se ejecutó `scripts/install-hook.mjs`). Forma Narrative Workflow, tema Cobalt
recoloreado con los tokens propios de Devia (`src/libs/styles/src/lib/_tokens.scss`
de la app): acento violeta, claro por defecto y oscuro por
`prefers-color-scheme`. Fuentes autohospedadas en `assets/fonts` (Familjen
Grotesk, IBM Plex Sans, JetBrains Mono, OFL).

- `assets/css/tokens.css` (colores, escala, fuentes), `base.css` (reglas base del
  suelo de Hallmark) y `styles.css` (la página; su primera línea es el sello
  Hallmark, no la muevas). Ningún color ni familia de fuente fuera de los tokens.
- Reglas que no se pueden saltar: sin emojis como iconos, sin eyebrows ni
  etiquetas en mayúsculas, sin cadenas con `·`, sin rayas largas en el texto,
  sin métricas, testimonios ni logos inventados, sin tarjetas dentro de tarjetas.
- Las imágenes son **capturas reales de la app**, en WebP (`cwebp -q 84`) en
  `assets/img/captures/`. Salvo `grafo.webp` (una captura del propio repo de la
  app, que es público), salen de una **instancia demo**: un worktree desacoplado
  de `dev` de `dherrero/devia-app`, arrancado con un `HOME` temporal, un proyecto
  de ejemplo con cambios sin commitear y una conversación y un kanban sembrados,
  sin datos privados (vía puppeteer-core por CDP a 1440x900 @2x). Para repetirlas:
  `HOME=/tmp/devia-demo/home electron --remote-debugging-port=9223 .` desde el
  worktree, con `devia-app.config.json` apuntando `workspaceRoot` al proyecto de
  ejemplo. Las sesiones de chat se guardan en `projects/<clave>/session-<id>.json`.
  El hero usa `chat`; las etapas de la home, `agentes`, `grafo`, `kanban`,
  `comentarios` y `remoto`; `docs/` muestra el resto por grupo de funcionalidades
  (`GROUP_FIGURES` y `CAPTURES` en `build.mjs`; el pie de cada una, y su `alt`, es
  `docs.figures.*` en los JSON). Las capturas están en español en todos los
  idiomas. **Antes de publicar una captura nueva, revisa que no muestre datos
  privados** (ids de chat, rutas, nombres de proyectos o tareas internas).
- La versión publicada se muestra en el cierre de la home (`#home-version`) y en
  descargas; `main.js` resalta la descarga de la plataforma del visitante.

### Verificar el diseño

Necesita Chrome y `puppeteer-core` (no está en el repo; instálalo fuera, p. ej.
`npm i puppeteer-core` en `/tmp/hallmark-pptr`):

```bash
python3 -m http.server 8765 &
export HALLMARK_PUPPETEER=/tmp/hallmark-pptr CHROME_PATH=<chrome>
node .claude/skills/hallmark/scripts/sloplint.mjs --url http://localhost:8765/ --genre modern-minimal --render
node .claude/skills/hallmark/scripts/sloplint.mjs --url http://localhost:8765/docs/ --genre modern-minimal --render --scope app
```

`main.js` redirige según `navigator.language`, así que para comprobar `/i18n/ar/`,
`/i18n/de/`… hay que **forzar el idioma del navegador** (`--lang=ar` en un script
envoltorio que apunte `CHROME_PATH` a Chrome); si no, la página que se lintea es
la española. `docs/` y `descargas/` son páginas de referencia: se lintean con
`--scope app`. Los WARN de presupuesto de palabras (58) en la home de en, fr y de
son conocidos. Borra las carpetas `.hallmark/shots` antes de commitear (están en
`.gitignore`).

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
  en los demás idiomas; luego `npm run check:content` y `npm run build`. No
  afirmes nada que `docs/capabilities.md` de la app no respalde.

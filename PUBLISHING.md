# Publicar una versión de Devia Desktop

Desde la automatización del pipeline, **publicar es automático**: el monorepo
privado compila Devia Desktop y sube los instaladores + manifiestos a este repo
al crear una release. Esta guía documenta ese flujo y deja, al final, el
procedimiento manual de emergencia.

> Esto cubre la **publicación de versiones** (binarios + manifiesto). El
> **contenido del sitio** (landing, docs, descargas) es multilingüe y se genera
> desde `build/i18n/<idioma>.json` con `npm run build`; su arquitectura está en
> [`AGENTS.md`](AGENTS.md).

## Flujo automático (recomendado)

1. En el monorepo privado se mergea a `main` un commit `feat:` / `fix:`.
2. El workflow **🏷️ Release** sube la versión en `package.json` y crea el tag
   `vX.Y.Z`.
3. El workflow **🖥️ Desktop Release** (encadenado con `workflow_run`) compila
   **Windows, macOS (x64 + arm64) y Linux**, firma y notariza macOS, y publica
   una **GitHub Release** en este repo con:
   - los instaladores: `.exe` (NSIS), `.dmg` (mac), `.AppImage` y `.deb`;
   - los feeds de electron-updater: `latest.yml`, `latest-mac.yml`,
     `latest-linux.yml`.
4. Un último job regenera `updates/latest.json` (el manifiesto que consume el
   sitio web de descargas) y lo commitea aquí. GitHub Pages se redespliega solo.

La app ya instalada se **auto-actualiza** leyendo las Releases de este repo
(electron-updater): descarga en segundo plano e instala al reiniciar. En Linux
el auto-update solo aplica al **AppImage**; el paquete `.deb` se actualiza
manualmente.

### Requisitos (secrets, configurados en el monorepo privado)

- `PUBLIC_REPO_TOKEN` — token con permiso de escritura sobre este repo.
- `MAC_CSC_LINK` + `MAC_CSC_KEY_PASSWORD` — certificado *Developer ID
  Application* para firmar macOS.
- `APPLE_ID` + `APPLE_APP_SPECIFIC_PASSWORD` + `APPLE_TEAM_ID` — notarización.

## Dos manifiestos, dos consumidores

| Fichero                          | Lo consume                         | Lo genera                         |
| -------------------------------- | ---------------------------------- | --------------------------------- |
| `latest*.yml` (en la Release)    | La app (electron-updater) — íntegro | electron-builder                  |
| `updates/latest.json`            | El sitio web de descargas          | `scripts/gen-update-manifest.mjs` |

La verificación de integridad (sha512) de las actualizaciones la hace la app
contra los `latest*.yml`; `updates/latest.json` solo alimenta los botones de
descarga de la web.

---

## Flujo manual (emergencia / sin CI)

Si hace falta publicar a mano (por ejemplo, sin acceso al CI):

### 1. Empaquetar (en el monorepo privado)

```bash
npm run pack:desktop:win    # → apps/desktop/release/*.exe        + latest.yml
npm run pack:desktop:mac    # → apps/desktop/release/*.dmg, *.zip + latest-mac.yml
npm run pack:desktop:linux  # → apps/desktop/release/*.AppImage, *.deb + latest-linux.yml
```

### 2. Crear la Release con los binarios

```bash
gh release create vX.Y.Z \
  Devia-Setup-X.Y.Z.exe Devia-X.Y.Z-arm64.dmg Devia-X.Y.Z.dmg \
  Devia-X.Y.Z-arm64-mac.zip Devia-X.Y.Z-mac.zip \
  Devia-X.Y.Z.AppImage devia_X.Y.Z_amd64.deb \
  latest.yml latest-mac.yml latest-linux.yml \
  --repo dherrero/devia --title "Devia Desktop vX.Y.Z" --notes "Notas…"
```

> Importante: sube también los `latest*.yml`, son el feed que lee la app para
> auto-actualizarse.

### 3. Regenerar el manifiesto del sitio

```bash
gh release view vX.Y.Z --repo dherrero/devia --json assets,body > release.json
node scripts/gen-update-manifest.mjs \
  --release-json release.json --tag vX.Y.Z --version X.Y.Z \
  --out updates/latest.json
git add updates/latest.json && git commit -m "release: manifiesto web vX.Y.Z" && git push
```

(`scripts/gen-update-manifest.mjs` vive en el monorepo privado.)

## Checklist

- [ ] Builds firmadas para Windows, macOS (x64 + arm64) y Linux
- [ ] GitHub Release `vX.Y.Z` con instaladores **y** `latest*.yml`
- [ ] `updates/latest.json` actualizado (versión, notas y enlaces por plataforma)
- [ ] `https://dherrero.github.io/devia/updates/latest.json` devuelve la versión nueva

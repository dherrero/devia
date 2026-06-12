# Publicar una versión de Devia Desktop

Guía para subir builds y anunciar la actualización a las apps instaladas.

## 0. Empaquetar (en el monorepo `devia`)

```bash
npm run pack:desktop:win    # → apps/desktop/release/*.exe        + latest.yml
npm run pack:desktop:mac    # → apps/desktop/release/*.dmg, *.zip + latest-mac.yml
npm run pack:desktop:linux  # → apps/desktop/release/*.AppImage, *.deb + latest-linux.yml
```

## 1. Subir los binarios

Los instaladores de Electron suelen superar los **100 MB que GitHub Pages admite por
fichero**, así que el flujo recomendado es:

1. Crear una **GitHub Release** en este mismo repo con tag `v<versión>` (p. ej. `v0.21.0`).
2. Adjuntar como assets: `.exe`, `.dmg`, `.zip` (mac), `.AppImage` y `.deb`.

```bash
gh release create v0.21.0 \
  Devia-Setup-0.21.0.exe Devia-0.21.0-arm64.dmg Devia-0.21.0.dmg \
  Devia-0.21.0-arm64-mac.zip Devia-0.21.0-mac.zip \
  Devia-0.21.0.AppImage devia_0.21.0_amd64.deb \
  --title "Devia Desktop v0.21.0" --notes "Notas de la versión…"
```

Las URLs de los assets quedan estables con la forma:

```
https://github.com/dherrero/devia/releases/download/v<versión>/<fichero>
```

(Si algún binario pesa menos de 100 MB también puede committearse directamente en una
carpeta `releases/<versión>/` del sitio, pero Releases es preferible: no engorda el
repo git y no consume el límite de 1 GB del sitio.)

## 2. Actualizar el manifiesto `updates/latest.json`

Es **la fuente que consulta la app de escritorio** (y la página de descargas) para saber
si hay versión nueva. Editar: `version`, `pubDate` (ISO 8601), `notes` y, por plataforma,
`url` (asset de la Release), `sha512` y `size` (bytes).

```bash
# sha512 en base64 (formato que usa electron-builder):
openssl dgst -sha512 -binary Devia-Setup-0.21.0.exe | openssl base64 -A
```

Claves de plataforma: `win32-x64`, `darwin-x64`, `darwin-arm64`,
`linux-x64-appimage`, `linux-x64-deb`.

## 3. (Opcional) feeds de electron-updater

Si la app adopta `electron-updater` con proveedor `generic`, copiar además los yml
generados por electron-builder:

| Origen (`apps/desktop/release/`) | Destino             |
| -------------------------------- | ------------------- |
| `latest.yml`                     | `updates/win/`      |
| `latest-mac.yml`                 | `updates/mac/`      |
| `latest-linux.yml`               | `updates/linux/`    |

Si los binarios viven en GitHub Releases, reescribir los campos `url`/`files[].url`
de cada yml con la URL absoluta del asset.

## 4. Publicar el sitio

```bash
git add -A
git commit -m "release: v0.21.0"
git push origin main
```

GitHub Pages se redespliega solo. Verificar:

- `https://dherrero.github.io/devia/updates/latest.json` devuelve la versión nueva.
- La página de descargas muestra `v<versión>` y los botones activos.

## Checklist rápido

- [ ] Builds empaquetadas para Windows, macOS (x64+arm64) y Linux
- [ ] GitHub Release `v<versión>` creada con todos los assets
- [ ] `updates/latest.json`: `version`, `pubDate`, `notes`, `url`/`sha512`/`size` por plataforma
- [ ] (opcional) yml de electron-updater copiados a `updates/{win,mac,linux}/`
- [ ] Commit + push y comprobación del manifiesto publicado

# updates/mac — feed de electron-updater (macOS)

Carpeta reservada para el proveedor `generic` de electron-updater, si la app lo adopta.

Contenido esperado por electron-updater:

- `latest-mac.yml` — generado por electron-builder en `release/` al empaquetar macOS.
- Los `.zip` (x64 y arm64) referenciados por el yml — electron-updater en macOS
  actualiza desde el `.zip`, no desde el `.dmg` — **o** URLs absolutas en el yml
  apuntando a los assets de GitHub Releases.

Feed URL para la app:

```
https://dherrero.github.io/devia/updates/mac
```

> Aviso: GitHub Pages rechaza ficheros > 100 MB. Si los `.zip` superan ese límite,
> súbelos a GitHub Releases y deja aquí solo el `latest-mac.yml` con URLs absolutas
> (ver `PUBLISHING.md` en la raíz del repo).

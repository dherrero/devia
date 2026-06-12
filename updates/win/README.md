# updates/win — feed de electron-updater (Windows)

Carpeta reservada para el proveedor `generic` de electron-updater, si la app lo adopta.

Contenido esperado por electron-updater:

- `latest.yml` — generado por electron-builder en `release/` al empaquetar Windows.
- El instalador `.exe` referenciado por `latest.yml` (mismo directorio), **o** un campo
  `url` absoluto en el yml apuntando al asset de GitHub Releases.

Feed URL para la app:

```
https://dherrero.github.io/devia/updates/win
```

> Aviso: GitHub Pages rechaza ficheros > 100 MB. Si el instalador supera ese límite,
> súbelo a GitHub Releases y deja aquí solo el `latest.yml` con URLs absolutas
> (ver `PUBLISHING.md` en la raíz del repo).

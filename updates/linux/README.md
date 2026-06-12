# updates/linux — feed de electron-updater (Linux)

Carpeta reservada para el proveedor `generic` de electron-updater, si la app lo adopta.

Contenido esperado por electron-updater:

- `latest-linux.yml` — generado por electron-builder en `release/` al empaquetar Linux.
- El `.AppImage` referenciado por el yml (electron-updater en Linux solo auto-actualiza
  AppImage; el `.deb` se actualiza por el gestor de paquetes), **o** un campo `url`
  absoluto en el yml apuntando al asset de GitHub Releases.

Feed URL para la app:

```
https://dherrero.github.io/devia/updates/linux
```

> Aviso: GitHub Pages rechaza ficheros > 100 MB. Si el AppImage supera ese límite,
> súbelo a GitHub Releases y deja aquí solo el `latest-linux.yml` con URLs absolutas
> (ver `PUBLISHING.md` en la raíz del repo).

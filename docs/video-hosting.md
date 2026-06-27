# Hosting de videos para Instagram API

## Recomendación

Usar Cloudflare R2 para videos de producción y reservar Cloudflare Pages solo para archivos `.mp4` pequeños de prueba.

Cloudflare Pages permite servir assets estáticos, pero el límite actual por archivo es 25 MiB. Muchos videos verticales superan ese tamaño o se acercan demasiado al límite, y además versionar videos en Git hace crecer el repo sin aportar valor editorial.

Referencias oficiales:

- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare R2 public buckets: https://developers.cloudflare.com/r2/buckets/public-buckets/

## Opción A: Pages para pruebas chicas

Ruta local:

```text
videos/nombre-del-video.mp4
```

URL pública después del deploy:

```text
https://minutofinancieros.com/videos/nombre-del-video.mp4
```

Usar esta opción solo si el archivo pesa menos de 25 MiB y si el video no necesita ser administrado fuera del deploy del sitio.

En este repo ya existe la carpeta `videos/` para pruebas. El archivo `.gitkeep` solo conserva la carpeta vacía en Git.

## Opción B: Cloudflare R2 para producción

Flujo recomendado:

1. Crear un bucket en Cloudflare R2, por ejemplo `minutofinancieros-videos`.
2. Conectar un dominio público al bucket, por ejemplo `videos.minutofinancieros.com`.
3. Subir cada `.mp4` al bucket manualmente o mediante script.
4. Usar la URL pública resultante como `video_url` para la API de Instagram:

```text
https://videos.minutofinancieros.com/nombre-del-video.mp4
```

## Pasos manuales en Cloudflare

1. Entrar al dashboard de Cloudflare.
2. Ir a R2 Object Storage.
3. Crear el bucket `minutofinancieros-videos`.
4. Abrir el bucket y entrar en Settings.
5. En Custom Domains, agregar `videos.minutofinancieros.com`.
6. Confirmar el registro DNS que Cloudflare propone.
7. Subir un `.mp4` de prueba y abrirlo desde el navegador.

## Nota para futura integración

Cuando se actualice `upload_instagram.py`, el script debería subir el video a R2 y devolver la URL pública del objeto. Esa integración conviene hacerla en una sesión separada, con credenciales R2 por variables de entorno.

# Hosting de videos para Instagram API

## Estado

Infraestructura documentada. No hay integracion automatica todavia con `upload_instagram.py`.

El repo contiene la carpeta `videos/` solo para pruebas pequenas. El archivo `.gitkeep` conserva la carpeta vacia en Git.

## Recomendacion

Usar Cloudflare R2 para videos de produccion y reservar Cloudflare Pages solo para archivos `.mp4` pequenos de prueba.

Motivos:

- Cloudflare Pages tiene limite de 25 MiB por asset.
- Los videos verticales pueden superar ese tamano.
- Versionar videos en Git hace crecer el repo.
- R2 es mas adecuado para almacenamiento y entrega publica de archivos.

Referencias oficiales:

- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Cloudflare R2 public buckets: https://developers.cloudflare.com/r2/buckets/public-buckets/

## Opcion A: Pages para pruebas chicas

Ruta local:

```text
videos/nombre-del-video.mp4
```

URL publica despues del deploy:

```text
https://minutofinancieros.com/videos/nombre-del-video.mp4
```

Usar esta opcion solo si:

- el archivo pesa menos de 25 MiB;
- el video no necesita administrarse fuera del deploy del sitio;
- es una prueba puntual, no parte del pipeline definitivo.

## Opcion B: Cloudflare R2 para produccion

Flujo recomendado:

1. Crear un bucket en Cloudflare R2, por ejemplo `minutofinancieros-videos`.
2. Conectar un dominio publico al bucket, por ejemplo `videos.minutofinancieros.com`.
3. Subir cada `.mp4` al bucket manualmente o mediante script.
4. Usar la URL publica resultante como `video_url` para la API de Instagram.

Ejemplo:

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
7. Subir un `.mp4` de prueba.
8. Abrir la URL publica del video en navegador.
9. Probar esa URL como `video_url` en el flujo de Instagram.

## Variables futuras para script

Cuando se integre `upload_instagram.py`, conviene usar variables de entorno:

```text
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=minutofinancieros-videos
CLOUDFLARE_R2_PUBLIC_BASE_URL=https://videos.minutofinancieros.com
```

## Nota para futura integracion

La futura integracion deberia:

1. subir el `.mp4` a R2;
2. obtener la URL publica;
3. pasar esa URL a Instagram como `video_url`;
4. opcionalmente borrar o archivar objetos viejos si solo se necesitan temporalmente.

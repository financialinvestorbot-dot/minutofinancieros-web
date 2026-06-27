# Minuto Financieros Web

Landing pública estática para `minutofinancieros.com`, pensada para Cloudflare Pages.

## Estructura

- `/`: landing principal.
- `/links/`: hub de enlaces para bios de redes sociales.
- `/recursos/`: recursos y herramientas, alimentados desde `data/recursos.json`.
- `/blog/`: índice de artículos cortos.
- `/blog/5-errores-comunes-al-ahorrar/`: artículo de ejemplo.
- `/blog/regla-50-30-20/`: artículo de ejemplo.
- `/sobre/`: descripción del proyecto.
- `/terminos/`: Términos de Servicio.
- `/privacidad/`: Política de Privacidad.
- `/videos/`: carpeta reservada para pruebas con `.mp4` pequeños; ver `docs/video-hosting.md`.

## Marketing y analytics

Ver `README-marketing.md` para activar Google Analytics 4 y usar URLs con UTM por plataforma.

## Videos

Ver `docs/video-hosting.md` para la evaluación de Cloudflare Pages vs Cloudflare R2. La recomendación para producción es R2 con dominio público.

## Recursos afiliados

Los recursos de `/recursos/` se editan en `data/recursos.json`. Cada ítem usa esta forma:

```json
{
  "nombre": "Nombre del recurso",
  "descripcion": "Descripción corta",
  "imagen": "",
  "link_afiliado": "https://www.amazon.com/dp/PRODUCTO?tag=minutofinanci-20",
  "categoria": "Categoría"
}
```

Los productos actuales son placeholders. Antes de publicar recomendaciones reales, reemplazar los ASIN `PLACEHOLDER` y confirmar el marketplace de Amazon más adecuado para la audiencia.

## Deploy en Cloudflare Pages

- Build command: vacío.
- Build output directory: `/`.
- Framework preset: None.

El proyecto no necesita Node.js ni paso de compilación.

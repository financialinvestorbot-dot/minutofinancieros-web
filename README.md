# Minuto Financieros Web

Sitio publico estatico de `minutofinancieros.com`, desplegado en Cloudflare Pages desde GitHub.

## Estado actual

Los tres bloques principales del backlog ya estan implementados:

- Bloque 1: contenido y estructura.
- Bloque 2: infraestructura, analytics, UTMs, SEO basico y documentacion de videos.
- Bloque 3: monetizacion futura, newsletter placeholder y notas de afiliados.

Produccion:

- Sitio publico: https://minutofinancieros.com/
- Links: https://minutofinancieros.com/links/
- Recursos: https://minutofinancieros.com/recursos/
- Blog: https://minutofinancieros.com/blog/
- Sobre el proyecto: https://minutofinancieros.com/sobre/
- Terminos: https://minutofinancieros.com/terminos/
- Privacidad: https://minutofinancieros.com/privacidad/

## Stack

- HTML, CSS y JavaScript estatico.
- Sin framework.
- Sin build step.
- Deploy automatico en Cloudflare Pages desde `main`.

Configuracion Cloudflare Pages:

- Build command: vacio.
- Build output directory: `/`.
- Framework preset: None.

## Estructura

- `/`: landing principal.
- `/links/`: hub de enlaces para bios de redes sociales.
- `/recursos/`: recursos y herramientas, alimentados desde `data/recursos.json`.
- `/blog/`: indice de articulos cortos.
- `/blog/5-errores-comunes-al-ahorrar/`: articulo de ejemplo.
- `/blog/regla-50-30-20/`: articulo de ejemplo.
- `/sobre/`: descripcion del proyecto.
- `/terminos/`: Terminos de Servicio.
- `/privacidad/`: Politica de Privacidad.
- `/videos/`: carpeta reservada para pruebas con `.mp4` pequenos; ver `docs/video-hosting.md`.
- `/assets/`: estilos, imagenes, analytics, config y newsletter JS.
- `/data/`: datos editables del sitio.
- `/docs/`: documentacion operativa.

## Archivos principales

- `assets/styles.css`: estilos globales.
- `assets/site-config.js`: configuracion editable del sitio. Actualmente contiene GA4.
- `assets/analytics.js`: cargador liviano de Google Analytics 4.
- `assets/newsletter.js`: validacion frontend del newsletter placeholder.
- `data/recursos.json`: recursos afiliados/placeholder.
- `sitemap.xml`: sitemap estatico.
- `robots.txt`: permite indexacion del sitio.
- `_headers`: headers de seguridad y cache.
- `_redirects`: redirects con slash final.

## Analytics

Google Analytics 4 esta activo mediante:

```js
window.MinutoFinancierosConfig = {
  gaMeasurementId: "G-4FQBKPVL8M"
};
```

El HTML carga `assets/site-config.js` con version query para evitar cache viejo:

```html
<script src="/assets/site-config.js?v=ga4-20260627" defer></script>
```

Detalles y UTMs recomendadas: `README-marketing.md`.

## Recursos afiliados

Los recursos de `/recursos/` se editan en `data/recursos.json`. Cada item usa esta forma:

```json
{
  "nombre": "Nombre del recurso",
  "descripcion": "Descripcion corta",
  "imagen": "",
  "link_afiliado": "https://www.amazon.com/dp/PRODUCTO?tag=minutofinanci-20",
  "categoria": "Categoria"
}
```

Los productos actuales son placeholders. Antes de publicar recomendaciones reales:

- reemplazar los ASIN `PLACEHOLDER`;
- confirmar marketplace de Amazon segun audiencia;
- revisar que el tag `minutofinanci-20` siga siendo el correcto.

## Newsletter

El formulario de newsletter esta visible en el footer de todas las paginas.

Estado actual:

- valida email en frontend;
- muestra mensaje de confirmacion;
- no guarda datos;
- no envia datos a terceros.

Integracion futura: `docs/newsletter.md`.

## Videos

La recomendacion para videos de produccion es Cloudflare R2 con dominio publico, no Cloudflare Pages.

Motivo: Cloudflare Pages tiene limite de asset de 25 MiB por archivo. La carpeta `videos/` queda solo para pruebas pequenas.

Detalles: `docs/video-hosting.md`.

## Requisitos que no se deben romper

- Mantener funcionando:
  - `https://minutofinancieros.com/`
  - `https://minutofinancieros.com/terminos/`
  - `https://minutofinancieros.com/privacidad/`
- Mantener visibles los enlaces a Inicio, Terminos y Privacidad en header/footer.
- Mantener el sitio estatico y liviano.
- No agregar framework salvo necesidad clara.

## Flujo de trabajo recomendado

1. Trabajar en `G:\WorkIA\Faceles\Canales\MinutoFinancieros`.
2. Verificar con servidor local:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

3. Probar rutas principales.
4. Commit en `main`.
5. Push a GitHub.
6. Cloudflare Pages redeploya automaticamente.

## Repositorio

GitHub: https://github.com/financialinvestorbot-dot/minutofinancieros-web

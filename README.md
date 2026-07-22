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
- `/blog/3-habitos-diarios-de-gente-millonaria/`: articulo de habitos financieros.
- `/blog/como-dejar-de-procrastinar-con-tu-dinero/`: articulo de organizacion financiera.
- `/blog/fondo-de-emergencia/`: articulo de ahorro preventivo.
- `/blog/interes-compuesto-explicado-facil/`: articulo de inversion basica.
- `/blog/como-salir-de-deudas-caras/`: articulo de deudas.
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
- `assets/newsletter.js`: validacion frontend y tracking del newsletter.
- `data/recursos.json`: recursos afiliados/placeholder.
- `data/blog.json`: indice editable de articulos.
- `docs/calendario-editorial.md`: backlog editorial del blog y criterios de medicion.
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
<script src="/assets/analytics.js?v=tracking-20260722" defer></script>
```

Detalles y UTMs recomendadas: `README-marketing.md`.

## Recursos afiliados

Los recursos de `/recursos/` se editan en `data/recursos.json`. Cada item usa esta forma:

```json
{
  "nombre": "Nombre del recurso",
  "descripcion": "Descripcion corta",
  "imagen": "",
  "link_afiliado": "https://www.amazon.com/dp/PRODUCTOtag=minutofinanci-20",
  "categoria": "Categoria"
}
```

Los productos actuales son recomendaciones reales en espanol con tag Amazon Associates `minutofinanci-20`.

Cada recurso puede incluir:

- `etapa`: bloque de decision en `/recursos/`.
- `prioridad`: orden de aparicion.
- `ideal_para`: motivo breve de recomendacion.
- `articulo_relacionado`: guia interna para profundizar.

## Newsletter

El formulario de newsletter esta visible en el footer de todas las paginas.

Estado actual:

- valida email en frontend;
- envia la suscripcion a `/api/newsletter`;
- usa Cloudflare Pages Functions para conectar con Brevo;
- mide submit, exito y error en GA4.

Detalles: `docs/newsletter.md`.

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

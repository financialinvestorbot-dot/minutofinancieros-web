# Marketing, Analytics y UTMs

Documento operativo para medicion, fuentes de trafico, afiliados y newsletter de Minuto Financieros.

## Google Analytics 4

GA4 esta activo mediante el cargador propio del sitio:

- Configuracion: `assets/site-config.js`
- Loader: `assets/analytics.js`
- Measurement ID: `G-4FQBKPVL8M`

Flujo GA4 configurado:

- Nombre del flujo: `minutofinancieros.com`
- URL del flujo: `https://minutofinancieros.com`
- ID del flujo: `15162607085`
- ID de medicion: `G-4FQBKPVL8M`

El config actual es:

```js
window.MinutoFinancierosConfig = {
  gaMeasurementId: "G-4FQBKPVL8M"
};
```

Referencia oficial: https://support.google.com/analytics/answer/9304153

## Cache de config

`assets/site-config.js` no debe tener cache largo, porque ahi vive el Measurement ID.

En `_headers` existe una regla especifica:

```text
/assets/site-config.js
  Cache-Control: public, max-age=300
```

Las paginas cargan el config asi:

```html
<script src="/assets/site-config.js?v=ga4-20260627" defer></script>
<script src="/assets/analytics.js?v=lead-magnet-20260726" defer></script>
<script src="/assets/newsletter.js?v=lead-magnet-20260726" defer></script>
```

Si cambia el config en el futuro, actualizar tambien el query `v=...` para forzar refresh.

## SEO tecnico

Estado actual:

- `robots.txt` apunta a `https://minutofinancieros.com/sitemap.xml`.
- El sitemap solo incluye rutas indexables.
- `/gracias/` esta marcado como `noindex,follow` y queda fuera del sitemap.
- Las paginas principales tienen canonical.
- La home declara schema JSON-LD `Organization` y `WebSite`.
- La home y `/blog/` enlazan el feed RSS `/feed.xml`.

Cuando se agregue una ruta nueva indexable, actualizar:

- `sitemap.xml`
- `_redirects` si necesita slash final
- canonical en el `<head>`

Para cambios en articulos, regenerar `sitemap.xml` y `feed.xml` con:

```powershell
node scripts\build-seo.js
```

Antes de publicar cambios de marketing o SEO:

```powershell
node scripts\check-site.js
```

## URLs recomendadas con UTM

Usar estas URLs en bios y descripciones para distinguir el origen del trafico:

```text
Instagram bio:
https://minutofinancieros.com/links/?utm_source=instagram&utm_medium=bio

TikTok bio:
https://minutofinancieros.com/links/?utm_source=tiktok&utm_medium=bio

YouTube descripcion:
https://minutofinancieros.com/links/?utm_source=youtube&utm_medium=description

YouTube canal:
https://minutofinancieros.com/links/?utm_source=youtube&utm_medium=channel

Campaña directa a newsletter:
https://minutofinancieros.com/newsletter/?utm_source=instagram&utm_medium=bio&utm_campaign=newsletter
```

Los parametros UTM no requieren codigo especial. Las rutas son estaticas y funcionan igual con o sin query string.

## Recursos afiliados

Pagina: `/recursos/`

Datos: `data/recursos.json`

Imagenes: `assets/recursos/`

Las imagenes actuales de recursos fueron tomadas de Wikimedia Commons, con licencia CC0, y optimizadas localmente para las cards:

- `recurso-libros.jpg`: Laptop and books (Unsplash), Kari Shea.
- `recurso-calculadora.jpg`: Financial Calculator Hewlett-Packard HP-12C, Pittigrilli.
- `recurso-presupuesto.jpg`: Desktop with laptop and calculator (Unsplash).
- `recurso-inversion.jpg`: Luke Chesser / Unsplash data visualization.

Tag Amazon configurado:

```text
minutofinanci-20
```

La curaduria actual de `/recursos/` prioriza 10 recursos en español para:

- finanzas personales;
- ahorro y habitos;
- presupuesto;
- inversion basica e indexada;
- mercados y diversificacion.

Cada URL debe mantener `tag=minutofinanci-20`.

Estructura actual:

- `Para empezar`: 4 recursos.
- `Para ordenar`: 2 recursos.
- `Para invertir`: 4 recursos.

La pagina incluye accesos por etapa al inicio y badges de recomendacion para el recurso principal de cada etapa.

Los clicks en recursos de Amazon disparan el evento GA4 principal:

```text
click_amazon_resource
```

Parametros enviados:

- `resource_name`
- `resource_category`
- `resource_stage`
- `outbound_url`

Tambien se mantiene `affiliate_click` como evento legacy para no perder continuidad si ya se habia creado una exploracion en GA4.

## Eventos GA4 recomendados

Eventos actuales del sitio:

| Evento | Donde se dispara | Uso |
| --- | --- | --- |
| `click_amazon_resource` | Click en botones Amazon de `/recursos/` | Medir salida afiliada por producto y etapa |
| `affiliate_click` | Click en botones Amazon de `/recursos/` | Compatibilidad con medicion anterior |
| `resource_related_article_click` | Click desde un recurso hacia una guia | Saber que recursos generan lectura interna |
| `social_click` | Click en redes desde `/links/` | Comparar salida a YouTube, Instagram y TikTok |
| `link_hub_primary_click` | CTA principal de `/links/` | Medir el click prioritario del hub |
| `link_hub_secondary_click` | CTA secundario de `/links/` | Medir salida a recursos desde el hub |
| `link_hub_click` | Otros links internos de `/links/` | Entender orden y uso del hub |
| `blog_article_click` | Cards del indice `/blog/` | Medir que articulos atraen desde el indice |
| `blog_cta_click` | CTAs dentro de articulos | Medir conversion editorial |
| `newsletter_submit` | Envio del formulario | Medir intencion de suscripcion |
| `newsletter_success` | Alta aceptada por API | Medir registros enviados a Brevo |
| `newsletter_error` | Error de API o red | Detectar problemas de conversion |
| `newsletter_thank_you_view` | Vista de `/gracias/` | Confirmar llegada post-suscripcion |
| `lead_magnet_view` | Vista de `/checklist-financiero/` | Medir consumo del recurso |
| `lead_magnet_open` | Click desde `/gracias/` hacia la checklist | Medir interes real en el recurso |
| `lead_magnet_print` | Boton imprimir/guardar PDF de la checklist | Medir uso profundo del recurso |
| `lead_magnet_blog_click` | Click desde la checklist al blog | Medir derivacion editorial |
| `lead_magnet_resources_click` | Click desde la checklist a recursos | Medir derivacion monetizable |
| `thank_you_resources_click` | Click desde gracias a recursos | Medir salida post-suscripcion |

Para crear conversiones en GA4, marcar como eventos clave:

- `click_amazon_resource`
- `newsletter_success`
- `link_hub_primary_click`
- `blog_cta_click`

## Seguimiento futuro de afiliados

Con `/recursos/` poblado con productos reales, comparar:

- trafico a `/recursos/` desde GA4;
- fuente/medio via UTM;
- clicks hacia Amazon;
- conversiones reportadas por Amazon Associates.

Objetivo: estimar si conviene enviar trafico directo a Amazon o primero a una pagina propia.

## Newsletter

El formulario del footer esta documentado en `docs/newsletter.md`.
La secuencia sugerida para automatizar en Brevo esta en `docs/secuencia-bienvenida-brevo.md`.

Estado actual:

- valida emails en frontend;
- envia la suscripcion a `/api/newsletter`;
- usa una Cloudflare Pages Function para llamar a Brevo sin exponer la API key;
- crea o actualiza contactos directamente en Brevo;
- tiene landing dedicada en `/newsletter/`;
- redirige a `/gracias/` despues del alta correcta;
- ofrece el lead magnet `/checklist-financiero/`;
- requiere variables de entorno en Cloudflare Pages.

Proveedor elegido: Brevo.

Variables necesarias:

```text
BREVO_API_KEY=
BREVO_LIST_ID=
```

Detalles completos: `docs/newsletter.md`.

## Blog y calendario editorial

Documento operativo: `docs/calendario-editorial.md`.

Plan recomendado:

- publicar 1 articulo corto por semana;
- priorizar temas que ya funcionaron en videos;
- cerrar cada articulo con CTA medible;
- revisar mensualmente `blog_article_click`, `blog_cta_click`, `newsletter_success` y `click_amazon_resource`.

## Checklist despues de publicar cambios de marketing

- Verificar `https://minutofinancieros.com/`.
- Verificar `https://minutofinancieros.com/links/?utm_source=instagram&utm_medium=bio`.
- Verificar `https://minutofinancieros.com/assets/site-config.js?v=ga4-20260627`.
- Confirmar en GA4 Realtime que aparece una visita de prueba.
- Confirmar en GA4 DebugView/Realtimes clicks de prueba en `/links/`, `/blog/` y `/recursos/`.

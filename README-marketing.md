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
<script src="/assets/analytics.js?v=tracking-20260722" defer></script>
<script src="/assets/newsletter.js?v=tracking-20260722" defer></script>
```

Si cambia el config en el futuro, actualizar tambien el query `v=...` para forzar refresh.

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

La curaduria actual de `/recursos/` prioriza recursos en español para:

- finanzas personales;
- ahorro y habitos;
- presupuesto;
- inversion basica e indexada;
- mercados y diversificacion.

Cada URL debe mantener `tag=minutofinanci-20`.

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
| `link_hub_click` | Otros links internos de `/links/` | Entender orden y uso del hub |
| `blog_article_click` | Cards del indice `/blog/` | Medir que articulos atraen desde el indice |
| `blog_cta_click` | CTAs dentro de articulos | Medir conversion editorial |
| `newsletter_submit` | Envio del formulario | Medir intencion de suscripcion |
| `newsletter_success` | Alta aceptada por API | Medir registros enviados a Brevo |
| `newsletter_error` | Error de API o red | Detectar problemas de conversion |

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

Estado actual:

- valida emails en frontend;
- envia la suscripcion a `/api/newsletter`;
- usa una Cloudflare Pages Function para llamar a Brevo sin exponer la API key;
- usa double opt-in mediante Brevo;
- requiere variables de entorno en Cloudflare Pages.

Proveedor elegido: Brevo.

Variables necesarias:

```text
BREVO_API_KEY=
BREVO_LIST_ID=
BREVO_DOI_TEMPLATE_ID=
NEWSLETTER_REDIRECT_URL=https://minutofinancieros.com/?newsletter=confirmed
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

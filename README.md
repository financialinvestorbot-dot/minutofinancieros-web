# Minuto Financieros Web

Sitio publico estatico de `minutofinancieros.com`, desplegado en Cloudflare Pages desde GitHub.

## Estado actual

Los tres bloques principales del backlog ya estan implementados:

- Bloque 1: contenido y estructura.
- Bloque 2: infraestructura, analytics, UTMs, SEO basico y documentacion de videos.
- Bloque 3: monetizacion futura, newsletter conectado a Brevo y notas de afiliados.

Produccion:

- Sitio publico: https://minutofinancieros.com/
- Links: https://minutofinancieros.com/links/
- Recursos: https://minutofinancieros.com/recursos/
- Newsletter: https://minutofinancieros.com/newsletter/
- Checklist financiero: https://minutofinancieros.com/checklist-financiero/
- Gracias newsletter: https://minutofinancieros.com/gracias/
- Blog: https://minutofinancieros.com/blog/
- Sobre el proyecto: https://minutofinancieros.com/sobre/
- Terminos: https://minutofinancieros.com/terminos/
- Privacidad: https://minutofinancieros.com/privacidad/

## Stack

- HTML, CSS y JavaScript estatico.
- Sin framework.
- Sin build step.
- `package.json` solo agrupa scripts de mantenimiento; no requiere dependencias.
- Deploy automatico en Cloudflare Pages desde `main`.

Configuracion Cloudflare Pages:

- Build command: vacio.
- Build output directory: `/`.
- Framework preset: None.

## Estructura

- `/`: landing principal.
- `404.html`: pagina de error personalizada para recuperar trafico perdido.
- `/links/`: hub de enlaces para bios de redes sociales.
- `/recursos/`: recursos y herramientas, alimentados desde `data/recursos.json`.
- `/newsletter/`: landing dedicada para capturar emails desde redes y campañas.
- `/checklist-financiero/`: lead magnet gratuito, imprimible como PDF desde el navegador.
- `/gracias/`: pagina post-suscripcion con CTA hacia checklist, recursos y blog.
- `/blog/`: indice de articulos cortos.
- `/blog/presupuesto-mensual-desde-cero/`: guia SEO de presupuesto mensual.
- `/blog/metodo-avalancha-bola-de-nieve/`: guia SEO de metodos para pagar deudas.
- `/blog/gastos-hormiga/`: guia SEO de gastos pequenos repetidos.
- `/blog/cuanto-ahorrar-por-mes-segun-ingreso/`: guia SEO para definir porcentaje de ahorro.
- `/blog/automatizar-ahorro-en-20-minutos/`: guia SEO para automatizar el ahorro.
- `/blog/errores-comunes-tarjeta-credito/`: guia SEO para usar tarjeta de credito con mas control.
- `/blog/que-mirar-antes-comprar-curso-financiero/`: guia SEO para evaluar cursos financieros.
- `/blog/invertir-con-poco-dinero-por-donde-empezar/`: guia SEO para empezar a invertir con montos chicos.
- `/blog/diferencia-entre-ahorrar-e-invertir/`: guia SEO para comparar ahorro e inversion.
- `/blog/ordenar-finanzas-en-una-tarde/`: guia SEO para organizar finanzas personales.
- `/blog/como-evitar-compras-impulsivas/`: guia SEO para controlar compras impulsivas.
- `/blog/fondo-de-emergencia-antes-de-invertir/`: guia SEO para priorizar fondo de emergencia antes de invertir.
- `/blog/que-es-diversificar-y-por-que-reduce-riesgo/`: guia SEO para entender diversificacion y riesgo.
- `/blog/revisar-gastos-sin-vivir-obsesionado/`: guia SEO para controlar gastos sin obsesionarse.
- `/blog/inflacion-dinero-quieto/`: guia SEO sobre inflacion y poder de compra.
- `/blog/checklist-financiero-fin-de-mes/`: guia SEO para revision financiera mensual.
- `/blog/hablar-de-dinero-en-pareja/`: guia SEO para finanzas en pareja.
- `/blog/que-hacer-con-un-ingreso-extra/`: guia SEO para decidir que hacer con ingresos extra.
- `/blog/senales-deuda-peligrosa/`: guia SEO para detectar deuda peligrosa.
- `/blog/libros-finanzas-personales-para-empezar/`: guia SEO para elegir libros financieros iniciales.
- `/blog/sistema-semanal-dinero-15-minutos/`: guia SEO para revision semanal de finanzas.
- `/blog/que-hacer-si-no-llegas-a-fin-de-mes/`: guia SEO para priorizar cuando el mes queda corto.
- `/blog/ordenar-suscripciones-pagos-automaticos/`: guia SEO para ordenar suscripciones y pagos recurrentes.
- `/blog/cuando-conviene-refinanciar-deuda/`: guia SEO para evaluar refinanciacion de deudas.
- `/blog/separar-dinero-corto-largo-plazo/`: guia SEO para separar dinero por plazo y riesgo.
- `/blog/errores-invertir-por-ansiedad/`: guia SEO para evitar errores al invertir apurado.
- `/blog/preparar-mes-caro-sin-endeudarte/`: guia SEO para anticipar gastos grandes.
- `/blog/que-revisar-antes-contratar-tarjeta/`: guia SEO para evaluar tarjetas antes de contratarlas.
- `/blog/usar-aumento-sueldo-sin-inflar-gastos/`: guia SEO para aprovechar aumentos de sueldo.
- `/blog/senales-recomendacion-financiera-dudosa/`: guia SEO para detectar recomendaciones dudosas.
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
- `data/recursos.json`: recursos afiliados reales en espanol con tag Amazon Associates.
- `data/blog.json`: indice editable de articulos.
- `feed.xml`: feed RSS del blog, generado desde `data/blog.json`.
- `docs/calendario-editorial.md`: backlog editorial del blog y criterios de medicion.
- `docs/secuencia-bienvenida-brevo.md`: emails iniciales sugeridos para automatizar en Brevo.
- `scripts/build-seo.js`: regenera `sitemap.xml` y `feed.xml` desde `data/blog.json`.
- `scripts/check-site.js`: valida JSON, RSS, sitemap, canonical, links afiliados y mojibake.
- `package.json`: comandos `npm run build:seo`, `npm run check` y `npm run qa`.
- `sitemap.xml`: sitemap estatico.
- `robots.txt`: permite indexacion del sitio.
- `_headers`: headers de seguridad y cache.
- `_redirects`: redirects con slash final.

SEO:

- Las paginas indexables tienen canonical.
- `sitemap.xml` incluye `lastmod`, `changefreq` y `priority`.
- `/gracias/` usa `noindex,follow` y no esta incluido en el sitemap porque es una pagina post-suscripcion.
- La home incluye schema JSON-LD `Organization` y `WebSite`.

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
<script src="/assets/analytics.js?v=internal-filter-20260726" defer></script>
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
Cada link de Amazon debe conservar el formato `?tag=minutofinanci-20`.

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
- redirige a `/gracias/` luego del alta correcta;
- ofrece el lead magnet `/checklist-financiero/`;
- mide submit, exito, error y clicks del lead magnet en GA4.

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
- Mantener visibles los enlaces a Inicio, Terminos y Privacidad en el footer.
- Mantener el sitio estatico y liviano.
- No agregar framework salvo necesidad clara.

## Flujo de trabajo recomendado

1. Trabajar en `G:\WorkIA\Faceles\Canales\MinutoFinancieros`.
2. Verificar con servidor local:

```powershell
python -m http.server 4173 --bind 127.0.0.1
```

3. Probar rutas principales.
4. Ejecutar QA local antes de publicar:

```powershell
npm run qa
```

Comandos equivalentes por separado:

```powershell
npm run build:seo
npm run check
```

5. Commit en `main`.
6. Push a GitHub.
7. Cloudflare Pages redeploya automaticamente.

## Repositorio

GitHub: https://github.com/financialinvestorbot-dot/minutofinancieros-web

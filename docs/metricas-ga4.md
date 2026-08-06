# Métricas con GA4 Data API

Objetivo: generar reportes reales del sitio desde Google Analytics 4 sin entrar manualmente al dashboard.

## Qué se puede automatizar

El script `scripts/ga4-report.js` consulta GA4 Data API y genera:

- eventos principales;
- páginas con más vistas;
- fuentes/medios de tráfico;
- clicks hacia Amazon medidos por `click_amazon_resource`;
- eventos de newsletter.

Salidas:

```text
reports/ga4-AAAA-MM-DD.md
reports/ga4-AAAA-MM-DD.json
```

Resumen operativo:

```powershell
npm run metrics:summary
```

Ese comando toma el ultimo `reports/ga4-AAAA-MM-DD.json` disponible y genera:

```text
reports/marketing-summary-AAAA-MM-DD.md
```

## Datos necesarios

Variables:

```powershell
$env:GA4_PROPERTY_ID="543474730"
$env:GOOGLE_APPLICATION_CREDENTIALS="G:\ruta\service-account.json"
```

También se puede usar:

```powershell
$env:GOOGLE_SERVICE_ACCOUNT_JSON='{"type":"service_account",...}'
```

Importante: `GA4_PROPERTY_ID` es el ID de la propiedad GA4, no el Measurement ID `G-4FQBKPVL8M` ni necesariamente el ID de flujo `15162607085`.

Propiedad actual detectada en GA4:

```text
GA4_PROPERTY_ID=543474730
```

Dónde verlo:

```text
GA4 > Administrar > Configuración de propiedad > Detalles de propiedad > ID de propiedad
```

## Preparación en Google Cloud

1. Crear o elegir un proyecto en Google Cloud.
2. Habilitar Google Analytics Data API.
3. Crear una service account.
4. Descargar el JSON de credenciales.
5. En GA4, agregar el email de la service account como usuario de la propiedad con rol de lectura.

Comando sugerido para este proyecto:

```powershell
$env:GA4_PROPERTY_ID="543474730"
$env:GOOGLE_APPLICATION_CREDENTIALS="G:\WorkIA\Faceles\Canales\MinutoFinancieros-Secrets\google-claude-service-account.json"
npm run metrics:ga4
npm run metrics:summary
```

Si el JSON usado para Claude no aparece como usuario autorizado en GA4, crear una service account separada para Analytics o agregar el `client_email` de ese JSON en:

```text
GA4 > Administrar > Gestión de acceso a la propiedad
```

Referencias oficiales:

- https://developers.google.com/analytics/devguides/reporting/data/v1
- https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart
- https://docs.cloud.google.com/nodejs/docs/reference/data/latest

## Uso

Últimos 30 días hasta ayer:

```powershell
npm run metrics:ga4
```

Rango específico:

```powershell
npm run metrics:ga4 -- --start=2026-07-01 --end=2026-07-27
```

Propiedad por argumento:

```powershell
npm run metrics:ga4 -- --property=123456789 --start=30daysAgo --end=yesterday
```

Resumen a partir de un reporte GA4 especifico:

```powershell
npm run metrics:summary -- --ga4=reports/ga4-2026-07-29.json
```

Resumen cruzando GA4 con un export CSV de Amazon Associates:

```powershell
npm run metrics:summary -- --ga4=reports/ga4-2026-07-29.json --amazon=reports/amazon-associates-julio.csv
```

El CSV de Amazon puede venir del reporte de Amazon Associates o Content Insights. El script intenta detectar columnas comunes como clicks, ordered items, shipped items, earnings, fees o commission.

Importante: el sitio ya permite excluir pruebas propias antes de que entren a GA4 usando `?mf_internal=1`. Si una prueba ya fue enviada a GA4, no se puede borrar desde el sitio; hay que filtrarla por fecha, hora, fuente o dispositivo al analizar.

## Custom dimensions

Para que el reporte de Amazon pueda desglosar producto y etapa, registrar en GA4 estos parámetros como dimensiones personalizadas de evento:

- `resource_name`
- `resource_stage`
- `resource_category`

Si estas dimensiones todavía no existen, `npm run metrics:ga4` igualmente guarda el conteo básico de `click_amazon_resource` en `clicks-amazon-basico`, pero no puede separar por producto, etapa o categoría.

Para que el reporte de CTAs del blog pueda separar articulo, objetivo y ubicacion, registrar tambien:

- `article_slug`
- `cta_type`
- `cta_position`
- `destination`

Si no están registrados, GA4 puede seguir contando los eventos, pero el desglose por producto, articulo o CTA puede fallar o no estar disponible en Data API.

## Amazon Associates

El sitio mide clicks salientes hacia Amazon en GA4. Las compras, ingresos y comisiones reales siguen estando del lado de Amazon Associates.

Amazon Associates muestra KPIs como clicks, ordered items, shipped items y conversion rate en sus reportes, y Content Insights puede mostrar clicks, revenue, earnings, purchased ASINs y marcas por artículo/link/campaña.

Referencias oficiales:

- https://affiliate-program.amazon.com/help/node/topic/GMWAK55DQX8JEK7C
- https://affiliate-program.amazon.com/help/node/topic/GZ2P5RSW6AMWWKTM

Flujo recomendado:

1. Generar reporte GA4 con `npm run metrics:ga4`.
2. Exportar reporte de Amazon Associates/Content Insights del mismo rango.
3. Cruzar `click_amazon_resource` contra clicks/compras/earnings de Amazon.
4. Revisar recursos con muchos clicks y baja conversión para cambiar copy, producto o ubicación.

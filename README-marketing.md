# Marketing, Analytics y UTMs

## Analytics

El sitio incluye un cargador liviano de Google Analytics 4. Por defecto está desactivado.

Para activarlo, editar `assets/site-config.js` y completar:

```js
window.MinutoFinancierosConfig = {
  gaMeasurementId: "G-XXXXXXXXXX"
};
```

El Measurement ID de GA4 empieza con `G-`. Se obtiene en Google Analytics desde Admin > Data streams > Web stream.

Referencia oficial de configuración: https://support.google.com/analytics/answer/9304153

Si más adelante se decide migrar a Plausible, Umami u otra herramienta, se puede eliminar `assets/analytics.js`, `assets/site-config.js` y las dos etiquetas `<script>` incluidas en las páginas.

## URLs recomendadas con UTM

Usar estas URLs en bios y descripciones para distinguir el origen del tráfico:

```text
Instagram bio:
https://minutofinancieros.com/links/?utm_source=instagram&utm_medium=bio

TikTok bio:
https://minutofinancieros.com/links/?utm_source=tiktok&utm_medium=bio

YouTube descripción:
https://minutofinancieros.com/links/?utm_source=youtube&utm_medium=description

YouTube canal:
https://minutofinancieros.com/links/?utm_source=youtube&utm_medium=channel
```

Los parámetros UTM no requieren código especial en este sitio. Las rutas son estáticas y funcionan igual con o sin query string.

## Seguimiento futuro de afiliados

Cuando `/recursos/` tenga productos reales, comparar:

- Tráfico a `/recursos/` desde GA4.
- Clicks por fuente UTM.
- Conversiones reportadas por Amazon Associates.

Eso permitirá estimar si los videos convierten mejor enviando directo a Amazon o pasando primero por una página propia.

## Newsletter

El formulario del footer está documentado en `docs/newsletter.md`.

Estado actual:

- valida emails en frontend;
- no guarda datos;
- no envía datos a terceros;
- queda listo para reemplazar la lógica de `assets/newsletter.js` cuando se elija proveedor.

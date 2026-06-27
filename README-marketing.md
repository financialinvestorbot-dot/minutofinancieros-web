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

Tag Amazon configurado para placeholders:

```text
minutofinanci-20
```

Antes de usar productos reales:

- reemplazar los ASIN placeholder;
- confirmar marketplace correcto;
- verificar que cada URL incluya el tag de afiliado;
- mantener el disclaimer visible en `/recursos/`.

## Seguimiento futuro de afiliados

Cuando `/recursos/` tenga productos reales, comparar:

- trafico a `/recursos/` desde GA4;
- fuente/medio via UTM;
- clicks hacia Amazon;
- conversiones reportadas por Amazon Associates.

Objetivo: estimar si conviene enviar trafico directo a Amazon o primero a una pagina propia.

## Newsletter

El formulario del footer esta documentado en `docs/newsletter.md`.

Estado actual:

- valida emails en frontend;
- no guarda datos;
- no envia datos a terceros;
- queda listo para reemplazar la logica de `assets/newsletter.js` cuando se elija proveedor.

Proveedor recomendado para empezar: MailerLite.

Alternativas:

- Brevo.
- Kit.

## Checklist despues de publicar cambios de marketing

- Verificar `https://minutofinancieros.com/`.
- Verificar `https://minutofinancieros.com/links/?utm_source=instagram&utm_medium=bio`.
- Verificar `https://minutofinancieros.com/assets/site-config.js?v=ga4-20260627`.
- Confirmar en GA4 Realtime que aparece una visita de prueba.

# Newsletter

## Estado actual

El formulario de newsletter esta visible en el footer de todas las paginas y esta conectado a Brevo mediante una Cloudflare Pages Function.

Flujo actual:

1. El usuario ingresa su email en el formulario.
2. `assets/newsletter.js` valida el formato y envia `POST /api/newsletter`.
3. `functions/api/newsletter.js` llama a la API de contactos de Brevo.
4. Brevo crea o actualiza el contacto y lo agrega a la lista configurada.
5. El sitio muestra confirmacion inmediata.

Este flujo no usa double opt-in porque la cuenta Brevo aun no tiene Transaccional activo. Cuando Brevo habilite Transaccional, se puede volver al flujo con email de confirmacion.

## Proveedor elegido

Proveedor: Brevo.

Motivos:

- plan gratuito util para empezar;
- API oficial para crear contactos;
- las API keys son secretas, por eso se usan desde Cloudflare Pages Functions y no desde el navegador;
- permite mantener el formulario visual propio del sitio.

Referencias:

- Brevo pricing: https://www.brevo.com/pricing/
- Brevo contacts API: https://developers.brevo.com/reference/createcontact
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/

## Archivos relacionados

- HTML: bloque `.newsletter-box` en el footer de cada pagina.
- CSS: `assets/styles.css`.
- JS frontend: `assets/newsletter.js`.
- Function backend: `functions/api/newsletter.js`.
- Privacidad: `privacidad/index.html`.

## Variables de entorno en Cloudflare Pages

Crear estas variables en Cloudflare Pages, proyecto `minutofinancieros-web`:

```text
BREVO_API_KEY=
BREVO_LIST_ID=
```

Obligatorias:

- `BREVO_API_KEY`: API key secreta de Brevo.
- `BREVO_LIST_ID`: ID numerico de la lista/audiencia de Brevo.

No commitear ninguna API key en el repo.

## Pasos manuales en Brevo

1. Crear o elegir una lista llamada `Minuto Financieros Newsletter`.
2. Copiar el ID numerico de esa lista.
3. Crear una API key en Brevo desde SMTP & API.
4. Pegar esos valores en las variables de entorno de Cloudflare Pages.
5. Redeployar el proyecto en Cloudflare Pages.

## Pasos manuales en Cloudflare Pages

1. Entrar a Cloudflare Dashboard.
2. Ir a Workers & Pages.
3. Abrir el proyecto `minutofinancieros-web`.
4. Ir a Settings.
5. Entrar a Environment variables.
6. Agregar `BREVO_API_KEY` y `BREVO_LIST_ID` para Production.
7. Guardar.
8. Hacer un nuevo deploy para que las variables queden disponibles.

## Como probar punta a punta

1. Abrir `https://minutofinancieros.com/`.
2. Ingresar un email de prueba en el newsletter del footer.
3. Verificar que el sitio muestre: `Listo. Ya quedaste anotado para recibir tips financieros.`
4. Entrar a Brevo y verificar que el contacto aparezca en `Minuto Financieros Newsletter`.
5. Probar un email invalido para confirmar que el sitio muestra error.

## Mensajes visibles

Exito:

```text
Listo. Ya quedaste anotado para recibir tips financieros.
```

Error de email invalido:

```text
Ingresa un correo valido para continuar.
```

Error de proveedor/configuracion:

```text
No pudimos registrar tu email. Proba de nuevo en unos minutos.
```

## Como ocultarlo rapido

El bloque esta marcado con la clase `newsletter-box`. Para ocultarlo temporalmente sin borrar el codigo:

```css
.newsletter-box {
  display: none;
}
```

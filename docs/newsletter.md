# Newsletter

## Estado actual

El formulario de newsletter esta visible en el footer de todas las paginas y ahora esta conectado a Brevo mediante una Cloudflare Pages Function.

Flujo actual:

1. El usuario ingresa su email en el formulario.
2. `assets/newsletter.js` valida el formato y envia `POST /api/newsletter`.
3. `functions/api/newsletter.js` llama a la API de Brevo.
4. Brevo envia el email de doble opt-in.
5. El usuario confirma la suscripcion desde su correo.
6. El contacto queda agregado a la lista configurada en Brevo.

## Proveedor elegido

Proveedor: Brevo.

Motivos:

- plan gratuito util para empezar, con hasta 300 emails por dia segun la pagina publica de precios de Brevo;
- API oficial clara para crear contactos y usar double opt-in;
- las API keys son secretas, por eso se usan desde Cloudflare Pages Functions y no desde el navegador;
- permite mantener el formulario visual propio del sitio.

Alternativas evaluadas:

- MailerLite: simple y buena opcion editorial, pero su plan gratuito actual figura hasta 250 suscriptores y 2.500 emails mensuales.
- Kit: fuerte para creators, pero menos conveniente como primera integracion headless simple.

Referencias:

- Brevo pricing: https://www.brevo.com/pricing/
- Brevo contacts API: https://developers.brevo.com/reference/createcontact
- Brevo double opt-in API: https://developers.brevo.com/reference/createdoicontact
- Cloudflare Pages Functions: https://developers.cloudflare.com/pages/functions/
- MailerLite pricing: https://www.mailerlite.com/pricing
- Kit pricing: https://kit.com/pricing

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
BREVO_DOI_TEMPLATE_ID=
NEWSLETTER_REDIRECT_URL=https://minutofinancieros.com/?newsletter=confirmed
```

Obligatorias:

- `BREVO_API_KEY`: API key secreta de Brevo.
- `BREVO_LIST_ID`: ID numerico de la lista/audiencia de Brevo.
- `BREVO_DOI_TEMPLATE_ID`: ID numerico del template transaccional que Brevo usa para confirmar doble opt-in.

Opcional:

- `NEWSLETTER_REDIRECT_URL`: URL a la que Brevo redirige despues de confirmar. Si no se configura, el codigo usa `https://minutofinancieros.com/?newsletter=confirmed`.

No commitear ninguna API key en el repo.

## Pasos manuales en Brevo

1. Crear una cuenta en Brevo.
2. Verificar el email/dominio remitente que se usara para el newsletter.
3. Crear una lista llamada `Minuto Financieros Newsletter`.
4. Copiar el ID numerico de esa lista.
5. Crear o adaptar un template de confirmacion double opt-in.
6. Copiar el ID numerico del template.
7. Crear una API key en Brevo.
8. Pegar esos valores en las variables de entorno de Cloudflare Pages.
9. Redeployar el proyecto en Cloudflare Pages.

## Pasos manuales en Cloudflare Pages

1. Entrar a Cloudflare Dashboard.
2. Ir a Workers & Pages.
3. Abrir el proyecto `minutofinancieros-web`.
4. Ir a Settings.
5. Entrar a Environment variables.
6. Agregar las variables listadas arriba para Production.
7. Guardar.
8. Hacer un nuevo deploy para que las variables queden disponibles.

## Como probar punta a punta

1. Abrir `https://minutofinancieros.com/`.
2. Ingresar un email de prueba en el newsletter del footer.
3. Verificar que el sitio muestre: `Listo. Revisa tu correo para confirmar la suscripcion.`
4. Abrir el email de confirmacion enviado por Brevo.
5. Confirmar la suscripcion.
6. Entrar a Brevo y verificar que el contacto aparezca en `Minuto Financieros Newsletter`.
7. Probar un email invalido para confirmar que el sitio muestra error.

## Mensajes visibles

Exito:

```text
Listo. Revisa tu correo para confirmar la suscripcion.
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

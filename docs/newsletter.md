# Newsletter

## Estado actual

El sitio incluye un formulario de newsletter visible en el footer de todas las páginas.

Por ahora funciona solo en frontend:

- valida que el email tenga formato correcto;
- muestra un mensaje de confirmación;
- no guarda el email en el servidor;
- no envía datos a ningún proveedor externo.

Esto permite probar el diseño sin comprometer datos de usuarios antes de elegir herramienta.

## Recomendación de proveedor

Recomendación inicial: MailerLite.

Motivos:

- tiene formularios embebibles y landing pages;
- el plan gratuito alcanza para validar interés inicial;
- es más simple para un proyecto editorial chico que una suite de CRM completa;
- se puede reemplazar luego sin rearmar el sitio.

Alternativas razonables:

- Brevo, si se prioriza CRM/contactos ilimitados y emails transaccionales.
- Kit, si el proyecto evoluciona hacia negocio creator con productos digitales.

Referencias:

- MailerLite pricing: https://www.mailerlite.com/pricing
- Brevo pricing: https://www.brevo.com/pricing/
- Kit pricing: https://kit.com/pricing

## Integración futura

Cuando se elija proveedor:

1. Crear la cuenta y una lista/audiencia para `Minuto Financieros`.
2. Crear un formulario embebible o endpoint de suscripción.
3. Reemplazar la lógica placeholder de `assets/newsletter.js`.
4. Actualizar la Política de Privacidad con el proveedor usado y finalidad exacta.
5. Probar doble opt-in si el proveedor lo ofrece.

## Cómo ocultarlo rápido

El bloque está marcado con la clase `newsletter-box`. Para ocultarlo temporalmente sin borrar el código:

```css
.newsletter-box {
  display: none;
}
```

# Newsletter

## Estado actual

El sitio incluye un formulario de newsletter visible en el footer de todas las paginas.

Por ahora funciona solo en frontend:

- valida que el email tenga formato correcto;
- muestra un mensaje de confirmacion;
- no guarda el email en el servidor;
- no envia datos a ningun proveedor externo.

Esto permite probar el diseno sin comprometer datos de usuarios antes de elegir herramienta.

## Archivos relacionados

- HTML: bloque `.newsletter-box` en el footer de cada pagina.
- CSS: `assets/styles.css`.
- JS: `assets/newsletter.js`.
- Privacidad: `privacidad/index.html` ya contempla una futura suscripcion voluntaria.

## Recomendacion de proveedor

Recomendacion inicial: MailerLite.

Motivos:

- tiene formularios embebibles y landing pages;
- el plan gratuito alcanza para validar interes inicial;
- es simple para un proyecto editorial chico;
- se puede reemplazar luego sin rearmar el sitio.

Alternativas razonables:

- Brevo, si se prioriza CRM/contactos ilimitados y emails transaccionales.
- Kit, si el proyecto evoluciona hacia negocio creator con productos digitales.

Referencias:

- MailerLite pricing: https://www.mailerlite.com/pricing
- Brevo pricing: https://www.brevo.com/pricing/
- Kit pricing: https://kit.com/pricing

## Integracion futura

Cuando se elija proveedor:

1. Crear la cuenta y una lista/audiencia para `Minuto Financieros`.
2. Crear un formulario embebible o endpoint de suscripcion.
3. Reemplazar la logica placeholder de `assets/newsletter.js`.
4. Actualizar la Politica de Privacidad con el proveedor usado y finalidad exacta.
5. Probar doble opt-in si el proveedor lo ofrece.
6. Confirmar en mobile que el footer no queda demasiado pesado.

## Como ocultarlo rapido

El bloque esta marcado con la clase `newsletter-box`. Para ocultarlo temporalmente sin borrar el codigo:

```css
.newsletter-box {
  display: none;
}
```

## Copy actual

Titulo:

```text
Recibi un tip financiero por semana
```

Texto:

```text
Ideas breves para ahorrar, ordenar gastos e invertir con mas criterio.
```

Boton:

```text
Anotarme
```

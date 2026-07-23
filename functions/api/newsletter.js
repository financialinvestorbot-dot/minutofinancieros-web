const BREVO_CONTACTS_ENDPOINT = "https://api.brevo.com/v3/contacts";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return null;
  }
}

export async function onRequestPost({ request, env }) {
  const body = await readJson(request);
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const apiKey = env.BREVO_API_KEY;
  const listId = Number(env.BREVO_LIST_ID);

  if (!isValidEmail(email)) {
    return jsonResponse({ message: "Ingresá un correo válido para continuar." }, 400);
  }

  if (!apiKey || !Number.isInteger(listId)) {
    return jsonResponse({
      message: "La suscripción todavía no está configurada. Probá de nuevo más tarde."
    }, 503);
  }

  const brevoResponse = await fetch(BREVO_CONTACTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: {
        SOURCE: "minutofinancieros_footer"
      }
    })
  });

  if (!brevoResponse.ok) {
    let message = "No pudimos registrar tu email. Probá de nuevo en unos minutos.";

    try {
      const brevoError = await brevoResponse.json();
      if (brevoError.message) {
        message = brevoError.message;
      }
    } catch (error) {
      // Keep the generic user-facing message.
    }

    return jsonResponse({ message }, brevoResponse.status >= 500 ? 502 : 400);
  }

  return jsonResponse({
    message: "Listo. Ya quedaste anotado para recibir tips financieros."
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Allow": "POST, OPTIONS",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestGet() {
  return jsonResponse({ message: "Método no permitido." }, 405);
}

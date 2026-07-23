(function () {
  var forms = document.querySelectorAll("[data-newsletter-form]");

  forms.forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector("[data-newsletter-status]");
    var submitButton = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      if (!input || !status) {
        return;
      }

      if (!input.checkValidity()) {
        status.textContent = "Ingresá un correo válido para continuar.";
        status.dataset.state = "error";
        input.focus();
        return;
      }

      if (typeof window.MinutoFinancierosTrack === "function") {
        window.MinutoFinancierosTrack("newsletter_submit", {
          form_location: form.dataset.newsletterLocation || "footer"
        });
      }

      status.textContent = "Enviando solicitud...";
      status.dataset.state = "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Enviando...";
      }

      try {
        var response = await fetch("/api/newsletter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: input.value.trim()
          })
        });
        var data = await response.json().catch(function () {
          return {};
        });

        if (!response.ok) {
          throw new Error(data.message || "No pudimos registrar tu email. Probá de nuevo en unos minutos.");
        }

        status.textContent = data.message || "Listo. Ya quedaste anotado para recibir tips financieros.";
        status.dataset.state = "success";
        form.reset();

        if (typeof window.MinutoFinancierosTrack === "function") {
          window.MinutoFinancierosTrack("newsletter_success", {
            form_location: form.dataset.newsletterLocation || "footer"
          });
        }
      } catch (error) {
        status.textContent = error.message || "No pudimos registrar tu email. Probá de nuevo en unos minutos.";
        status.dataset.state = "error";

        if (typeof window.MinutoFinancierosTrack === "function") {
          window.MinutoFinancierosTrack("newsletter_error", {
            form_location: form.dataset.newsletterLocation || "footer",
            error_message: status.textContent
          });
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = "Anotarme";
        }
      }
    });
  });
})();

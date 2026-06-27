(function () {
  var forms = document.querySelectorAll("[data-newsletter-form]");

  forms.forEach(function (form) {
    var input = form.querySelector('input[type="email"]');
    var status = form.querySelector("[data-newsletter-status]");

    form.addEventListener("submit", function (event) {
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

      status.textContent = "Listo. La lista está preparada; falta conectar el proveedor de email.";
      status.dataset.state = "success";
      form.reset();
    });
  });
})();

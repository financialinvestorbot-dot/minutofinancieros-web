(function () {
  var config = window.MinutoFinancierosConfig || {};
  var measurementId = config.gaMeasurementId;

  if (!/^G-[A-Z0-9]+$/i.test(measurementId || "")) {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
  document.head.appendChild(script);

  window.gtag("js", new Date());
  window.gtag("config", measurementId);

  document.addEventListener("click", function (event) {
    var link = event.target.closest("[data-affiliate-link]");

    if (!link || typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", "affiliate_click", {
      event_category: "affiliate",
      event_label: link.dataset.resourceName || link.href,
      resource_name: link.dataset.resourceName || "",
      resource_category: link.dataset.resourceCategory || "",
      outbound_url: link.href
    });
  });
})();

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

  function getTrackingParams(element) {
    var params = {};

    Object.keys(element.dataset).forEach(function (key) {
      if (key.indexOf("ga") !== 0 || key === "gaEvent") {
        return;
      }

      var normalizedKey = key
        .replace(/^ga/, "")
        .replace(/^[A-Z]/, function (match) {
          return match.toLowerCase();
        })
        .replace(/[A-Z]/g, function (match) {
          return "_" + match.toLowerCase();
        });

      params[normalizedKey] = element.dataset[key];
    });

    return params;
  }

  function trackEvent(eventName, params) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, params || {});
  }

  window.MinutoFinancierosTrack = trackEvent;

  document.addEventListener("click", function (event) {
    var trackedElement = event.target.closest("[data-ga-event]");

    if (trackedElement) {
      trackEvent(trackedElement.dataset.gaEvent, Object.assign({
        link_text: trackedElement.textContent.trim(),
        link_url: trackedElement.href || ""
      }, getTrackingParams(trackedElement)));
    }

    var blogCtaLink = event.target.closest(".article-cta a");

    if (blogCtaLink) {
      trackEvent("blog_cta_click", {
        link_text: blogCtaLink.textContent.trim(),
        link_url: blogCtaLink.href || "",
        page_path: window.location.pathname
      });
    }

    var blogCardLink = event.target.closest(".article-card a");

    if (blogCardLink) {
      trackEvent("blog_article_click", {
        article_url: blogCardLink.href || "",
        article_title: blogCardLink.closest(".article-card").querySelector("h2") ? blogCardLink.closest(".article-card").querySelector("h2").textContent.trim() : "",
        page_path: window.location.pathname
      });
    }

    var link = event.target.closest("[data-affiliate-link]");

    if (!link) {
      return;
    }

    trackEvent("click_amazon_resource", {
      event_category: "affiliate",
      event_label: link.dataset.resourceName || link.href,
      resource_name: link.dataset.resourceName || "",
      resource_category: link.dataset.resourceCategory || "",
      resource_stage: link.dataset.resourceStage || "",
      outbound_url: link.href
    });

    trackEvent("affiliate_click", {
      event_category: "affiliate",
      event_label: link.dataset.resourceName || link.href,
      resource_name: link.dataset.resourceName || "",
      resource_category: link.dataset.resourceCategory || "",
      resource_stage: link.dataset.resourceStage || "",
      outbound_url: link.href
    });
  });
})();

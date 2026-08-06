const fs = require("fs");
const path = require("path");

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const found = process.argv.find((value) => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function latestGa4Report() {
  if (!fs.existsSync("reports")) {
    return "";
  }

  return fs
    .readdirSync("reports")
    .filter((file) => /^ga4-\d{4}-\d{2}-\d{2}\.json$/.test(file))
    .sort()
    .pop();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

function findReport(ga4, label) {
  return (ga4.reports || []).find((report) => report.label === label) || {};
}

function rowsFor(ga4, label) {
  const report = findReport(ga4, label);
  return report.table ? report.table.rows || [] : [];
}

function reportErrors(ga4) {
  return (ga4.reports || [])
    .filter((report) => report.error)
    .map((report) => ({ label: report.label, error: report.error }));
}

function summarizeError(error) {
  if (!error) {
    return "";
  }

  try {
    const parsed = JSON.parse(error);
    const details = parsed.error || {};
    const reason = (details.details || [])
      .map((item) => item.reason)
      .find(Boolean);
    const activationUrl = (details.details || [])
      .map((item) => item.metadata && item.metadata.activationUrl)
      .find(Boolean);
    return [
      details.status || "",
      reason || "",
      details.message || "",
      activationUrl ? `Activar: ${activationUrl}` : ""
    ].filter(Boolean).join(" - ");
  } catch (_) {
    return error;
  }
}

function number(value) {
  const parsed = Number(String(value || "0").replace(/[$,%\s]/g, "").replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function sumColumn(rows, index) {
  return rows.reduce((total, row) => total + number(row[index]), 0);
}

function valueForEvent(rows, eventName) {
  const row = rows.find((item) => item[0] === eventName);
  return row ? number(row[1]) : 0;
}

function markdownTable(headers, rows) {
  if (!rows.length) {
    return "_Sin datos para este rango._";
  }

  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`)
  ].join("\n");
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let quoted = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
      continue;
    }

    if (char === '"') {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(file) {
  const lines = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function firstMatching(row, names) {
  const key = Object.keys(row).find((item) => names.some((name) => item.includes(name)));
  return key ? row[key] : "";
}

function amazonSummary(file) {
  if (!file) {
    return null;
  }

  const rows = parseCsv(file);
  const clicks = rows.reduce((total, row) => total + number(firstMatching(row, ["click"])), 0);
  const ordered = rows.reduce((total, row) => total + number(firstMatching(row, ["ordered", "items ordered"])), 0);
  const shipped = rows.reduce((total, row) => total + number(firstMatching(row, ["shipped", "items shipped"])), 0);
  const earnings = rows.reduce((total, row) => total + number(firstMatching(row, ["earnings", "fees", "commission"])), 0);

  return {
    file,
    rows: rows.length,
    clicks,
    ordered,
    shipped,
    earnings,
    conversionRate: clicks ? (ordered / clicks) * 100 : 0
  };
}

function formatPercent(value) {
  return `${value.toFixed(2)}%`;
}

function main() {
  const ga4Path = arg("ga4", latestGa4Report() ? path.join("reports", latestGa4Report()) : "");
  const amazonPath = arg("amazon", "");
  const outPath = arg("out", "");

  if (!ga4Path) {
    throw new Error("No GA4 report found. Run npm run metrics:ga4 first or pass --ga4=reports/ga4-YYYY-MM-DD.json.");
  }

  const ga4 = readJson(ga4Path);
  const generatedAt = new Date().toISOString();
  const stamp = generatedAt.slice(0, 10);
  const outputPath = outPath || path.join("reports", `marketing-summary-${stamp}.md`);

  const eventRows = rowsFor(ga4, "eventos-principales");
  const pageRows = rowsFor(ga4, "paginas");
  const sourceRows = rowsFor(ga4, "fuentes");
  const amazonRows = rowsFor(ga4, "clicks-amazon");
  const newsletterRows = rowsFor(ga4, "newsletter");
  const amazon = amazonSummary(amazonPath);
  const errors = reportErrors(ga4);
  const hasGa4Errors = errors.length > 0;
  const allGa4ReportsFailed = errors.length > 0 && errors.length === (ga4.reports || []).length;

  const newsletterSubmit = valueForEvent(newsletterRows, "newsletter_submit");
  const newsletterSuccess = valueForEvent(newsletterRows, "newsletter_success");
  const newsletterRate = newsletterSubmit ? (newsletterSuccess / newsletterSubmit) * 100 : 0;
  const ga4AmazonClicks = sumColumn(amazonRows, 4);
  const leadMagnetViews = valueForEvent(eventRows, "lead_magnet_view");
  const blogCtaClicks = valueForEvent(eventRows, "blog_cta_click");

  const recommendations = [];

  if (allGa4ReportsFailed) {
    recommendations.push("Habilitar Google Analytics Data API en el proyecto Google Cloud usado por la service account y volver a correr `npm run metrics:ga4`.");
  }

  if (newsletterSubmit > 0 && newsletterSuccess === 0) {
    recommendations.push("Revisar newsletter: hay intentos de alta sin exitos registrados.");
  }

  if (ga4AmazonClicks > 0 && amazon && amazon.clicks === 0) {
    recommendations.push("Comparar links Amazon: GA4 registra clicks salientes, pero el export de Amazon no muestra clicks.");
  }

  if (!allGa4ReportsFailed && blogCtaClicks === 0 && pageRows.length > 0) {
    recommendations.push("Revisar CTAs del blog: hay trafico de paginas, pero no aparecen clicks de CTA.");
  }

  if (!allGa4ReportsFailed && leadMagnetViews === 0) {
    recommendations.push("Dar mas visibilidad a la checklist financiera si el rango tiene trafico pero no registra vistas del lead magnet.");
  }

  if (!recommendations.length) {
    recommendations.push("No hay alertas automaticas fuertes. Revisar manualmente los recursos con mas clicks y menor conversion.");
  }

  const content = [
    `# Resumen marketing - ${stamp}`,
    "",
    `Generado: ${generatedAt}`,
    `GA4 fuente: \`${ga4Path}\``,
    amazon ? `Amazon fuente: \`${amazon.file}\`` : "Amazon fuente: no incluida",
    "",
    "## Estado de datos",
    "",
    hasGa4Errors
      ? markdownTable(
        ["Consulta", "Estado"],
        errors.map((item) => [item.label, summarizeError(item.error)])
      )
      : "GA4 respondio correctamente para todas las consultas configuradas.",
    "",
    "## Indicadores",
    "",
    markdownTable(
      ["Indicador", "Valor"],
      [
        ["Rango GA4", `${ga4.startDate} a ${ga4.endDate}`],
        ["Eventos newsletter submit", newsletterSubmit],
        ["Eventos newsletter success", newsletterSuccess],
        ["Conversion newsletter", formatPercent(newsletterRate)],
        ["Clicks Amazon medidos por GA4", ga4AmazonClicks],
        ["Clicks CTA blog", blogCtaClicks],
        ["Vistas checklist", leadMagnetViews],
        ...(amazon ? [
          ["Clicks Amazon export", amazon.clicks],
          ["Items pedidos Amazon", amazon.ordered],
          ["Items enviados Amazon", amazon.shipped],
          ["Conversion Amazon", formatPercent(amazon.conversionRate)],
          ["Earnings Amazon", amazon.earnings.toFixed(2)]
        ] : [])
      ]
    ),
    "",
    "## Top paginas",
    "",
    markdownTable(["Pagina", "Vistas", "Usuarios", "Eventos"], pageRows.slice(0, 10)),
    "",
    "## Top fuentes",
    "",
    markdownTable(["Fuente/medio", "Sesiones", "Usuarios", "Eventos"], sourceRows.slice(0, 10)),
    "",
    "## Clicks Amazon por recurso",
    "",
    markdownTable(["Evento", "Recurso", "Etapa", "Categoria", "Clicks", "Usuarios"], amazonRows.slice(0, 10)),
    "",
    "## Recomendaciones",
    "",
    ...recommendations.map((item) => `- ${item}`),
    ""
  ].join("\n");

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, content);
  console.log(`Generated ${outputPath}`);
}

main();

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const tokenUrl = "https://oauth2.googleapis.com/token";
const scope = "https://www.googleapis.com/auth/analytics.readonly";

function arg(name, fallback) {
  const prefix = `--${name}=`;
  const found = process.argv.find((value) => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function base64Url(value) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function signJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope,
    aud: tokenUrl,
    iat: now,
    exp: now + 3600
  };

  const unsigned = `${base64Url(header)}.${base64Url(payload)}`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(unsigned)
    .sign(serviceAccount.private_key, "base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${unsigned}.${signature}`;
}

function loadServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));
  }

  throw new Error("Set GOOGLE_APPLICATION_CREDENTIALS or GOOGLE_SERVICE_ACCOUNT_JSON.");
}

async function getAccessToken(serviceAccount) {
  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signJwt(serviceAccount)
  });

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`OAuth token request failed: ${JSON.stringify(payload)}`);
  }

  return payload.access_token;
}

async function runReport(accessToken, propertyId, request) {
  const response = await fetch(`https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify(request)
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(JSON.stringify(payload));
  }

  return payload;
}

function tableFromReport(report) {
  const dimensions = report.dimensionHeaders || [];
  const metrics = report.metricHeaders || [];
  const headers = [...dimensions.map((item) => item.name), ...metrics.map((item) => item.name)];
  const rows = (report.rows || []).map((row) => [
    ...(row.dimensionValues || []).map((item) => item.value),
    ...(row.metricValues || []).map((item) => item.value)
  ]);

  return { headers, rows };
}

function markdownTable({ headers, rows }) {
  if (!rows.length) {
    return "_Sin datos para este rango._";
  }

  return [
    `| ${headers.join(" |")} |`,
    `| ${headers.map(() => "---").join(" |")} |`,
    ...rows.map((row) => `| ${row.join(" |")} |`)
  ].join("\n");
}

function reportRequest({ startDate, endDate, dimensions, metrics, dimensionFilter, limit = 25 }) {
  return {
    dateRanges: [{ startDate, endDate }],
    dimensions: dimensions.map((name) => ({ name })),
    metrics: metrics.map((name) => ({ name })),
    dimensionFilter,
    limit,
    orderBys: [{ metric: { metricName: metrics[0] }, desc: true }]
  };
}

function stringFilter(fieldName, value) {
  return {
    filter: {
      fieldName,
      stringFilter: {
        matchType: "EXACT",
        value
      }
    }
  };
}

async function optionalReport(label, fn) {
  try {
    return { label, report: await fn() };
  } catch (error) {
    return { label, error: error.message };
  }
}

async function main() {
  const propertyId = process.env.GA4_PROPERTY_ID || arg("property", "");
  const startDate = arg("start", process.env.GA4_START_DATE || "30daysAgo");
  const endDate = arg("end", process.env.GA4_END_DATE || "yesterday");

  if (!propertyId) {
    throw new Error("Set GA4_PROPERTY_ID or pass --property=PROPERTY_ID. This is the GA4 property ID, not the Measurement ID.");
  }

  const serviceAccount = loadServiceAccount();
  const accessToken = await getAccessToken(serviceAccount);

  const reports = [];

  reports.push(await optionalReport("eventos-principales", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["eventName"],
    metrics: ["eventCount", "activeUsers"],
    limit: 50
  }))));

  reports.push(await optionalReport("paginas", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["pagePath"],
    metrics: ["screenPageViews", "activeUsers", "eventCount"],
    limit: 30
  }))));

  reports.push(await optionalReport("fuentes", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["sessionSourceMedium"],
    metrics: ["sessions", "activeUsers", "eventCount"],
    limit: 30
  }))));

  reports.push(await optionalReport("clicks-amazon", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["eventName", "customEvent:resource_name", "customEvent:resource_stage", "customEvent:resource_category"],
    metrics: ["eventCount", "activeUsers"],
    dimensionFilter: stringFilter("eventName", "click_amazon_resource"),
    limit: 50
  }))));

  reports.push(await optionalReport("newsletter", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["eventName"],
    metrics: ["eventCount", "activeUsers"],
    dimensionFilter: {
      orGroup: {
        expressions: [
          stringFilter("eventName", "newsletter_submit"),
          stringFilter("eventName", "newsletter_success"),
          stringFilter("eventName", "newsletter_error"),
          stringFilter("eventName", "newsletter_thank_you_view")
        ]
      }
    },
    limit: 20
  }))));

  reports.push(await optionalReport("blog-ctas", () => runReport(accessToken, propertyId, reportRequest({
    startDate,
    endDate,
    dimensions: ["eventName", "customEvent:article_slug", "customEvent:cta_type", "customEvent:cta_position", "customEvent:destination"],
    metrics: ["eventCount", "activeUsers"],
    dimensionFilter: stringFilter("eventName", "blog_cta_click"),
    limit: 50
  }))));

  const generatedAt = new Date().toISOString();
  const output = {
    generatedAt,
    propertyId,
    startDate,
    endDate,
    reports: reports.map((item) => ({
      label: item.label,
      error: item.error,
      table: item.report ? tableFromReport(item.report) : null
    }))
  };

  fs.mkdirSync("reports", { recursive: true });
  const stamp = generatedAt.slice(0, 10);
  const jsonPath = path.join("reports", `ga4-${stamp}.json`);
  const mdPath = path.join("reports", `ga4-${stamp}.md`);

  fs.writeFileSync(jsonPath, JSON.stringify(output, null, 2));
  fs.writeFileSync(mdPath, [
    `# Reporte GA4 - ${stamp}`,
    "",
    `Rango: ${startDate} a ${endDate}`,
    `Propiedad: ${propertyId}`,
    "",
    ...output.reports.flatMap((item) => [
      `## ${item.label}`,
      "",
      item.error ? `No se pudo consultar: \`${item.error}\`` : markdownTable(item.table),
      ""
    ])
  ].join("\n"));

  console.log(`Generated ${mdPath} and ${jsonPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

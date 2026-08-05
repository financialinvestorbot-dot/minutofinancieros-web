const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const googleTokenUrl = "https://oauth2.googleapis.com/token";
const googleScope = "https://www.googleapis.com/auth/cloud-platform";

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const found = process.argv.find((value) => value.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
}

function flag(name) {
  return process.argv.includes(`--${name}`);
}

function readIfExists(file) {
  return file && fs.existsSync(file) ? fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "") : "";
}

function latestFile(dir, pattern) {
  if (!fs.existsSync(dir)) {
    return "";
  }

  return fs.readdirSync(dir).filter((file) => pattern.test(file)).sort().pop() || "";
}

function base64Url(value) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function loadServiceAccount() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
    return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return JSON.parse(fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, "utf8"));
  }

  return null;
}

function signGoogleJwt(serviceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: serviceAccount.client_email,
    scope: googleScope,
    aud: googleTokenUrl,
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

async function getGoogleAccessToken() {
  if (process.env.GOOGLE_ACCESS_TOKEN) {
    return process.env.GOOGLE_ACCESS_TOKEN;
  }

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error("Set GOOGLE_ACCESS_TOKEN, GOOGLE_APPLICATION_CREDENTIALS, or GOOGLE_SERVICE_ACCOUNT_JSON for Vertex Claude.");
  }

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion: signGoogleJwt(serviceAccount)
  });

  const response = await fetch(googleTokenUrl, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Google OAuth token request failed: ${JSON.stringify(payload)}`);
  }

  return payload.access_token;
}

function vertexHost(location) {
  if (location === "global") {
    return "https://aiplatform.googleapis.com";
  }

  if (location === "us" || location === "eu") {
    return `https://aiplatform.${location}.rep.googleapis.com`;
  }

  return `https://${location}-aiplatform.googleapis.com`;
}

function extractTextFromClaude(payload) {
  const text = (payload.content || [])
    .filter((item) => item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  return text || JSON.stringify(payload, null, 2);
}

function extractTextFromOpenAI(payload) {
  if (payload.output_text) {
    return payload.output_text.trim();
  }

  const text = (payload.output || [])
    .flatMap((item) => item.content || [])
    .filter((item) => item.type === "output_text" || item.type === "text")
    .map((item) => item.text)
    .join("\n")
    .trim();

  return text || JSON.stringify(payload, null, 2);
}

async function callVertexClaude(prompt) {
  const project = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || arg("project");
  const location = process.env.GOOGLE_CLOUD_LOCATION || process.env.CLAUDE_VERTEX_LOCATION || arg("location", "global");
  const model = process.env.CLAUDE_VERTEX_MODEL || arg("model", "claude-sonnet-5");

  if (!project) {
    throw new Error("Set GOOGLE_CLOUD_PROJECT or pass --project=PROJECT_ID.");
  }

  const accessToken = await getGoogleAccessToken();
  const endpoint = `${vertexHost(location)}/v1/projects/${encodeURIComponent(project)}/locations/${encodeURIComponent(location)}/publishers/anthropic/models/${encodeURIComponent(model)}:rawPredict`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      anthropic_version: "vertex-2023-10-16",
      max_tokens: Number(arg("max-tokens", process.env.CLAUDE_MAX_TOKENS || "1800")),
      messages: [{ role: "user", content: prompt }]
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Vertex Claude request failed: ${JSON.stringify(payload)}`);
  }

  return extractTextFromClaude(payload);
}

async function callOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || arg("model", "gpt-5.6-luna");

  if (!apiKey) {
    throw new Error("Set OPENAI_API_KEY for OpenAI editorial automation.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: prompt,
      max_output_tokens: Number(arg("max-output-tokens", process.env.OPENAI_MAX_OUTPUT_TOKENS || "1800"))
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`OpenAI request failed: ${JSON.stringify(payload)}`);
  }

  return extractTextFromOpenAI(payload);
}

async function callAnthropicClaude(prompt) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.CLAUDE_MODEL || arg("model", "claude-sonnet-5");

  if (!apiKey) {
    throw new Error("Set ANTHROPIC_API_KEY for direct Claude API.");
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: Number(arg("max-tokens", process.env.CLAUDE_MAX_TOKENS || "1800")),
      messages: [{ role: "user", content: prompt }]
    })
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(`Claude API request failed: ${JSON.stringify(payload)}`);
  }

  return extractTextFromClaude(payload);
}

function buildPrompt({ calendar, blog, summary }) {
  return [
    "Sos editor SEO y analista de marketing para Minuto Financieros, un sitio de educacion financiera en espanol.",
    "Objetivo: proponer la proxima tanda editorial y automatizaciones simples a partir del calendario, articulos publicados y metricas disponibles.",
    "",
    "Devolve SOLO Markdown con estas secciones:",
    "1. Prioridad editorial",
    "2. 5 articulos sugeridos con slug, intencion, CTA y motivo",
    "3. 3 mejoras de conversion para newsletter/recursos",
    "4. Alertas de medicion",
    "5. Prompt breve para generar el primer articulo",
    "",
    "Reglas:",
    "- No prometas resultados financieros.",
    "- Mantene tono claro, practico y educativo.",
    "- Prioriza temas que puedan convertir hacia newsletter, checklist o recursos.",
    "- Si no hay metricas reales, aclaralo y prioriza por arquitectura editorial.",
    "",
    "## Calendario editorial",
    calendar.slice(0, 14000),
    "",
    "## Blog publicado (JSON)",
    blog.slice(0, 12000),
    "",
    "## Resumen marketing disponible",
    summary ? summary.slice(0, 12000) : "No hay resumen de metricas disponible."
  ].join("\n");
}

async function main() {
  const calendarPath = arg("calendar", "docs/calendario-editorial.md");
  const blogPath = arg("blog", "data/blog.json");
  const latestSummary = latestFile("reports", /^marketing-summary-\d{4}-\d{2}-\d{2}\.md$/);
  const summaryPath = arg("summary", latestSummary ? path.join("reports", latestSummary) : "");
  const outPath = arg("out", path.join("reports", `ai-editorial-plan-${new Date().toISOString().slice(0, 10)}.md`));

  const prompt = buildPrompt({
    calendar: readIfExists(calendarPath),
    blog: readIfExists(blogPath),
    summary: readIfExists(summaryPath)
  });

  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  if (flag("prompt-only") || flag("dry-run")) {
    fs.writeFileSync(outPath, prompt);
    console.log(`Generated prompt only: ${outPath}`);
    return;
  }

  const provider = (process.env.AI_PROVIDER || process.env.CLAUDE_PROVIDER || arg("provider", "vertex")).toLowerCase();
  const text = provider === "openai"
    ? await callOpenAI(prompt)
    : provider === "anthropic"
      ? await callAnthropicClaude(prompt)
      : await callVertexClaude(prompt);

  fs.writeFileSync(outPath, text);
  console.log(`Generated AI editorial plan with ${provider}: ${outPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

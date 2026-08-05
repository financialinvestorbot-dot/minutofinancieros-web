# Automatizaciones editoriales con IA

Objetivo: usar GA4, calendario editorial y reportes de marketing para generar una propuesta editorial accionable con Claude sobre Google Cloud Agent Platform u OpenAI, sin guardar claves en el repo.

## Estado

Implementado en el repo:

- `scripts/ga4-report.js`: descarga datos de GA4.
- `scripts/marketing-summary.js`: resume GA4 y opcionalmente cruza Amazon Associates.
- `scripts/claude-editorial-automation.js`: genera un prompt o llama a un modelo para proponer prioridades editoriales.

## Flujo recomendado

```powershell
npm run metrics:ga4
npm run metrics:summary
npm run ai:editorial -- --prompt-only
```

El modo `--prompt-only` no llama a ninguna API. Genera el prompt en `reports/` para revisarlo antes de gastar tokens.

Cuando Google Cloud y Claude esten habilitados:

```powershell
$env:AI_PROVIDER="vertex"
$env:GOOGLE_CLOUD_PROJECT="tu-proyecto"
$env:GOOGLE_CLOUD_LOCATION="global"
$env:CLAUDE_VERTEX_MODEL="claude-sonnet-5"
$env:GOOGLE_APPLICATION_CREDENTIALS="G:\ruta\service-account.json"
npm run ai:editorial
```

Tambien se puede pasar un access token temporal:

```powershell
$env:GOOGLE_ACCESS_TOKEN="ya29..."
npm run ai:editorial
```

Fallback recomendado con OpenAI mientras Google aprueba cuotas:

```powershell
$env:AI_PROVIDER="openai"
$env:OPENAI_API_KEY="sk-..."
$env:OPENAI_MODEL="gpt-5.6-luna"
npm run ai:editorial
```

`gpt-5.6-luna` es el default por costo bajo. Para mas calidad, cambiar solo la variable:

```powershell
$env:OPENAI_MODEL="gpt-5.6-terra"
```

## Requisitos Google Cloud

1. Proyecto Google Cloud con billing activo.
2. Agent Platform / Vertex AI API habilitada.
3. Modelo Claude habilitado desde Model Garden.
4. Service account con rol `Vertex AI User`.
5. Credencial disponible solo en entorno local o secreto de CI, nunca en Git.

La documentacion oficial de Anthropic para Claude en Google Cloud indica dos diferencias importantes frente a la Messages API directa: el modelo se especifica en la URL del endpoint y `anthropic_version` va en el cuerpo con valor `vertex-2023-10-16`.

Referencias:

- https://platform.claude.com/docs/en/build-with-claude/claude-on-vertex-ai
- https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/partner-models/claude

## Variables

```text
AI_PROVIDER=vertex
GOOGLE_CLOUD_PROJECT=
GOOGLE_CLOUD_LOCATION=global
CLAUDE_VERTEX_MODEL=claude-sonnet-5
GOOGLE_APPLICATION_CREDENTIALS=
```

Fallback directo a Anthropic, si se decide no pasar por Google:

```text
CLAUDE_PROVIDER=anthropic
ANTHROPIC_API_KEY=
CLAUDE_MODEL=claude-sonnet-5
```

Fallback OpenAI:

```text
AI_PROVIDER=openai
OPENAI_API_KEY=
OPENAI_MODEL=gpt-5.6-luna
OPENAI_MAX_OUTPUT_TOKENS=1800
```

OpenAI usa la Responses API (`POST /v1/responses`) para este flujo.

## Salidas

```text
reports/claude-editorial-plan-AAAA-MM-DD.md
```

El reporte esperado incluye:

- prioridad editorial;
- 5 articulos sugeridos con slug, intencion, CTA y motivo;
- mejoras de conversion para newsletter/recursos;
- alertas de medicion;
- prompt breve para generar el primer articulo.

## Seguridad

- No commitear service accounts, access tokens ni API keys.
- `reports/` esta ignorado por Git porque puede contener datos reales de GA4, Amazon y prompts.
- Usar `?mf_internal=1` para excluir pruebas propias antes de medir.
- Revisar manualmente cualquier contenido generado antes de publicarlo.

## Estado de cuota Claude en Google

Si `npm run ai:editorial` con `AI_PROVIDER=vertex` devuelve `RESOURCE_EXHAUSTED`, revisar estas cuotas de Agent Platform API:

```text
Global online prediction requests per base model per minute
base_model: anthropic-claude-sonnet

Global online prediction input tokens per minute per base model
base_model: anthropic-claude-sonnet

Global online prediction output tokens per minute per base model
base_model: anthropic-claude-sonnet
```

Para una cuenta nueva puede quedar en `0` hasta que Google apruebe una solicitud o la cuenta de facturacion tenga mas historial.

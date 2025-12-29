# MCP API / Tool Contract

Purpose: define the minimal HTTP API and JSON contracts that the Chiron backend (Sidecar) and the Blender MCP server agree on. This file is a compact reference for implementers of the MCP server and the Chiron proxies.

Versioning

- API version is negotiated via header `X-MCP-Version` (default `1`). Maintain backwards-compatible changes and bump the major version for breaking changes.

Authentication

- Use an Authorization header: `Authorization: Bearer <MCP_AUTH_TOKEN>`.
- For local dev, `MCP_AUTH_TOKEN` may be omitted when `ALLOW_INSECURE_LOCAL=true`.

Endpoints

GET /health

- Response: `200` `{ "status":"ok" }`

POST /lesson

- Accepts a lesson payload (signed or unsigned). The MCP server validates and executes the lesson steps.
- Request body (application/json):

  {
  "lesson": [
  { "command": "SPEAK", "params": { "text": "Hello" } },
  { "command": "ADD_CUBE", "params": { "size": 1.0, "location": [0,0,0] } }
  ],
  "metadata": { "id": "lesson-123", "source": "chiron-sidecar", "issued_at": 1690000000 },
  "signature": "<optional-ed25519-signature-base64>"
  }

- Response: `200` `{ "status":"accepted", "id":"lesson-123", "result": null }` or `4xx/5xx` on error.

POST /run_operator

- A single operator invocation (for tightly-scoped tooling).
- Request: `{ "operator": "mesh.primitive_cube_add", "params": { "size": 1.0 } }`
- Response: `200` `{ "status":"ok", "result": { "object_name":"Cube" } }`

POST /scene_summary

- Optional read-only endpoint returning a compact description of the current Blender scene.
- Request: `{ "detail_level": "minimal" }`
- Response: `200` `{ "objects": [ {"name":"Cube","type":"MESH"}], "active": "Cube" }

Errors

- 400 Bad Request: invalid payload or schema mismatch.
- 401 Unauthorized: missing/invalid token.
- 422 Unprocessable Entity: semantic validation failed (unsafe command, disallowed params).
- 500 Internal Server Error: execution error.

Lesson Pack JSON Schema (concise)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "LessonPack",
  "type": "object",
  "required": ["lesson"],
  "properties": {
    "lesson": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["command"],
        "properties": {
          "command": { "type": "string" },
          "params": { "type": ["object", "null"] }
        },
        "additionalProperties": false
      }
    },
    "metadata": { "type": ["object", "null"] },
    "signature": { "type": ["string", "null"] }
  },
  "additionalProperties": false
}
```

Safe Command Surface (recommended)

- Implement a small whitelist of commands in MCP; examples:
  - `SPEAK` — params: `{ text: string, voice?: string, lang?: string }`
  - `ADD_CUBE` — params: `{ size?: number, location?: [number,number,number] }`
  - `DELETE_OBJECT` — params: `{ name: string }` (only allowed when matching a lesson safety policy)
  - `SELECT_OBJECT` — params: `{ name: string }`
  - `RUN_OPERATOR` — params: `{ operator: string, params?: object }` (operator namespace must be whitelisted)
  - `UI_HIGHLIGHT` — params: `{ selector: string, duration_ms?: number }` (front-end only; no Blender state changes)
  - `WAIT` — params: `{ ms: number }`

Notes: all commands must be validated server-side to ensure parameter ranges, disallow arbitrary python execution, and map to concrete MCP handlers.

Signing and Integrity

- Recommend Ed25519 for lesson signing. When `signature` is present, MCP should verify using a configured public key before executing.
- Include `metadata.issued_at` and `metadata.source` to help trace provenance.

Examples

- SPEAK example (curl):

```bash
curl -X POST http://localhost:9876/lesson \
  -H 'Content-Type: application/json' \
  -d '{"lesson":[{"command":"SPEAK","params":{"text":"Hello from Chiron","voice":"Alex"}}],"metadata":{"id":"t1"}}'
```

- ADD_CUBE example:

```bash
curl -X POST http://localhost:9876/lesson \
  -H 'Content-Type: application/json' \
  -d '{"lesson":[{"command":"ADD_CUBE","params":{"size":1.2,"location":[0,0,0]}}],"metadata":{"id":"add-cube-1"}}'
```

Versioning and Extensions

- Use `X-MCP-Version` header. New command names or param shapes should increment minor/major version accordingly.
- For non-standard or experimental commands use a namespaced command like `X_CUSTOM.do_something` and gate behind a server-side flag.

Security Checklist (quick)

- Validate JWT/Token on every request.
- Verify signatures on lesson packs when provided.
- Enforce a strict whitelist for operators and disallow `execute_raw_python` in production builds.
- Log lesson executions and provide an audit endpoint for administrators.

Where to put changes

- Implementers should keep this file in `docs/MCP_API.md` and add an OpenAPI or JSON Schema artifact if you need machine-readable validation.

---

Last updated: 2025-12-28

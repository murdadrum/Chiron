# MCP Integration (Chiron)

This document explains how to integrate the external `blender-mcp` Python server with the Chiron3D workspace. The repository includes a small placeholder Blender addon and helper scripts to run the MCP server locally.

Prerequisites

- Python 3.10+ (for MCP server)
- Node.js (16+)
- Blender 5.0

Environment variables (recommended defaults)

- `MCP_HOST=localhost`
- `MCP_PORT=9876`
- `MCP_PROTOCOL=http`
- `MCP_AUTH_TOKEN` (optional, for secure forwarding)

Quick start (macOS)

1. Add the real blender-mcp sources:

```bash
git submodule add https://github.com/murdadrum/blender-mcp third_party/blender-mcp
git submodule update --init --recursive
```

2. Start the MCP server:

```bash
./tools/run-blender-mcp.sh
```

3. Start the Chiron Node server:

```bash
cd server
npm install
node index.js
```

4. Install and enable the Blender addon (placeholder) in Blender:

Open Blender → Preferences → Add-ons → Install → choose `addon/gemini_addon.py`, then enable.

5. Generate a lesson and forward it to MCP (see smoke test below).

Smoke test (end-to-end)

1. Start MCP server (`./tools/run-blender-mcp.sh`) — verify it listens on `MCP_HOST:MCP_PORT`.
2. Start Chiron server (`cd server && node index.js`).
3. Enable the addon in Blender and use the `Test MCP Connection` button in the `Chiron` sidebar to ping `/health`.
4. Generate a lesson via Chiron's endpoint:

```bash
curl -s -X POST http://localhost:5001/api/generate-lesson -H 'Content-Type: application/json' -d '{"chapterTitle":"Modeling a cup"}' > lesson.json
```

5. Forward the lesson to the MCP server via the Node proxy:

```bash
curl -X POST http://localhost:5001/api/mcp/forward -H 'Content-Type: application/json' -d @lesson.json
```

6. Confirm Blender executed safe handler commands (e.g., a primitive added or a log in the addon console).

Security notes

- By default MCP should be bound to loopback only. Do not expose MCP to public networks without authentication and transport security.
- Do NOT allow arbitrary Python execution from the network. Use a command whitelist mapping tokens to safe handlers.

If you want, I can create a PR that adds the real `gemini_addon.py` from your blender-mcp repo into `addon/` and wire `server/index.js` to import `server/mcp_proxy.js`.

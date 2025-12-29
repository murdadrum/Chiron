# 🏹 Chiron3D — Interactive AI Sidecar (MVP)

[![Status](https://img.shields.io/badge/Status-MVP-ready-orange?style=for-the-badge)](https://github.com/murdadrum/Chiron3D)
[![Tech](https://img.shields.io/badge/Tech-React_•_Vite_•_Node_•_Python-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

Short: Chiron3D is a guided, AI-driven lesson engine that runs alongside Blender. The web UI generates and simulates lessons, while a lightweight Blender addon (Python) executes a whitelisted set of safe demo commands.

This README focuses on what you need to demo the MVP to prospective users quickly: minimal setup, demo script, and known limitations.

Contents

- Quick demo (one-command)
- What to expect in the MVP
- Run steps (backend, UI, Blender addon)
- Smoke tests and demo script
- Next steps and how to help

---

## ✨ MVP Highlights

- Generate short, context-aware lesson steps using the backend AI service (local mock available).
- Sidecar UI (React) that visualizes lessons, steps, and a lesson map.
- Blender addon loader that accepts lesson JSON and executes whitelisted commands (SPEAK, ADD_CUBE, SELECT_OBJECT, etc.).
- TTS integration (macOS `say` fallback; `pyttsx3` supported if installed in Blender Python).
- Safety: no arbitrary Python execution; lessons map to a safe command surface.

---

## 🚀 Quick Demo (one-command)

On macOS the repository includes a launcher that installs the addon into your Blender user addons dir and starts the backend + UI in the background.

Steps:

```bash
# Make launcher executable (one-time)
chmod +x tools/install_and_run.sh tools/launch_chiron.command

# Run installer + server + UI + copy addon to Blender user addons
./tools/install_and_run.sh --install-addon
```

Wait for logs in `/tmp/chiron_logs` (server + demo frontend). Open the web UI (Vite will show the local URL in its logs, typically http://localhost:5173 or 5174).

Install and enable the add-on in Blender (Preferences → Add-ons) if the script didn't copy it for you.

---

## 🛠 Manual Run (recommended for debugging)

1. Start mock MCP server and backend together (recommended for demos):

```bash
cd server
npm install
USE_MOCK_MCP=true MCP_PORT=9876 node index.js
```

2. Start the web UI:

```bash
cd web
npm install
npm run dev
```

3. Install the Blender add-on (developer flow):

```bash
# copy the addon to Blender's user addons folder (adjust Blender version path)
mkdir -p "$HOME/Library/Application Support/Blender/5.0/scripts/addons/chiron_addon"
rsync -a addon/ "$HOME/Library/Application Support/Blender/5.0/scripts/addons/chiron_addon/"
# then open Blender and enable the add-on in Preferences → Add-ons
```

4. Smoke test TTS & lesson forwarding (from your terminal):

```bash
curl -i -X POST http://localhost:5001/api/tts \
	-H 'Content-Type: application/json' \
	-d '{"text":"Hello from demo","voice":"Alex"}'
```

Confirm the mock MCP logs show receipt and that Blender (or your mock) printed a matching lesson payload.

---

## 🎬 Demo Script (5–10 minutes)

1. Show the Sidecar UI landing page and explain the Sidecar pattern (web UI + Blender).
2. Toggle `Detailed steps` in the chat area to demonstrate granular instructions generation (toggle exists in the prompt header and initial prompt).
3. Ask Chiron to "Create a simple cube and color it" (or use the prebuilt chapter). Walk through step playback.
4. Trigger TTS and show that the lesson JSON was forwarded to the MCP (mock logs) and that a SPEAK command executed.
5. Finish by summarizing safety measures: whitelisted commands, local-only defaults, and signing recommendations.

---

## ⚙️ Implementer Notes

- Location of key parts:

  - UI: `web/` (React + Vite)
  - Backend: `server/` (Node.js)
  - Addon: `addon/` (Blender loader + handlers)
  - Docs: `docs/` (integration & API)

- Important env vars:
  - `USE_MOCK_MCP=true` — run with a local mock MCP for demos.
  - `MCP_HOST`, `MCP_PORT` — where the MCP accepts lessons (defaults: localhost:9876).
  - `MCP_AUTH_TOKEN` — optional for secure deployments.

---

## Known Limitations (MVP)

- Blender integration is a loader pattern — upstream `blender-mcp` is recommended as a submodule but not required for the demo.
- TTS cross-platform requires `pyttsx3` installed into Blender's Python for non-macOS.
- Lesson schema and signing are supported as a concept; production signing/key rotation requires additional ops work.

---

## How to help / Next steps

- Add `third_party/blender-mcp` as a Git submodule (I can do that in a PR).
- Add OpenAPI/JSON Schema artifacts for `docs/MCP_API.md` and CI validation.
- Add a small acceptance test that runs the backend with `USE_MOCK_MCP=true` and posts a sample `/api/tts` to validate end-to-end.

---

Maintainers: murdadrum & contributors

License: MIT

# 🏹 Chiron3D — Interactive AI Sidecar for Blender

[![Status](https://img.shields.io/badge/Status-Phase_1:_Simulation-blueviolet?style=for-the-badge)](https://github.com/murdadrum/Chiron3D)
[![Stack](https://img.shields.io/badge/Tech-React_•_Vite_•_Node_•_Python_•_Vertex_AI-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

Chiron3D is a guided, AI-driven tutorial platform that runs alongside Blender. The web-based "Sidecar" UI (React/Vite) acts as the lesson engine while a lightweight Blender addon (Python) executes safe, deterministic demo steps and highlights UI elements.

**Quick links**

- Web UI: [web/](web)
- Backend: [server/](server)
- Blender addon: [addon/](addon) (loader + placeholder)
- MCP integration docs: [docs/mcp-integration.md](docs/mcp-integration.md)

---

## ✨ What it does

- Generate context-aware lesson steps using Vertex AI (Gemini).
- Simulate and visualize lessons in the Sidecar UI.
- Forward structured lesson JSON to Blender to execute safe, pre-defined commands.

## 📐 Architecture (high level)

- Brain (Guide): React + Vite — lesson map, UI, and prompts.
- Backend: Node.js + Express — orchestrates Gemini calls and serves APIs.
- Bridge: Socket/HTTP proxy (dev) — forwards lessons to the MCP server.
- Hands: Blender Addon (Python) — executes whitelisted commands using `bpy`.

## 🚀 Quick Start

Note: these steps assume a macOS development machine. For Linux/Windows adjust commands accordingly.

1. Start the MCP server (if you vendor `blender-mcp` under `third_party/`):

```bash
./tools/run-blender-mcp.sh
```

2. Start Chiron backend

```bash
cd server
npm install
node index.js
```

3. Start Sidecar UI

```bash
cd web
npm install
npm run dev
```

4. Install/enable the Blender addon

Open Blender → Preferences → Add-ons → Install → pick `addon/gemini_addon.py` and enable it. With `third_party/blender-mcp` present the loader will use the upstream addon; otherwise a safe test panel appears under the "Chiron" sidebar.

5. Run the smoke test from [docs/mcp-integration.md](docs/mcp-integration.md) to validate end-to-end flow.

---

## 🧭 Developer notes

- The repo contains a loader-style addon at `addon/gemini_addon.py` that will dynamically load an upstream `gemini_addon.py` if you add the upstream project into `third_party/blender-mcp/` (recommended as a submodule).
- A small proxy router `server/mcp_proxy.js` is included to forward lesson JSON to the MCP server (mount it in your Express app: `app.use('/api', require('./mcp_proxy'))`).
- Defaults: `MCP_HOST=localhost`, `MCP_PORT=9876`, Chiron server default port `5001`.

## 🛡 Safety & Security

- The Blender addon intentionally maps incoming lesson `command` tokens to a whitelist of safe handlers. It does NOT execute arbitrary Python received from the network.
- By default the MCP server should bind to `127.0.0.1` (local-only). If you bind externally, add authentication (see `MCP_AUTH_TOKEN`).

## 📁 Project layout

```
Chiron3D/
├─ addon/                # Blender addon loader + placeholder
├─ data/                 # Manual extraction & conversion scripts
├─ docs/                 # Integration & developer docs
├─ server/               # Node.js backend (AI orchestration)
└─ web/                  # React/Vite Sidecar UI
```

---

If you'd like, I can create a PR that adds the upstream `blender-mcp` as a submodule and mounts `server/mcp_proxy.js` automatically into the Express app.

Authors: murdadrum & contributors

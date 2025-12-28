# 🏹 Chiron3D
### The Interactive AI "Sidecar" for Blender 5.0

[![Status](https://img.shields.io/badge/Status-Phase_1:_Simulation-blueviolet?style=for-the-badge)](https://github.com/murdadrum/Chiron3D)
[![Stack](https://img.shields.io/badge/Tech-React_•_Vite_•_Python_•_Vertex_AI-blue?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)]()

---

## 🔮 Vision

**Chiron3D** is not just a tutorial; it's a **Lesson Engine**. By decoupling the instruction from the application, we perform "Sidecar Teaching": a rich, multimedia Web Application runs alongside Blender, communicating in real-time to:

*   **Highlight** UI elements dynamically.
*   **Execute** demo steps for you ("Show, Don't Tell").
*   **Explain** concepts using context-aware AI voice.

## 🏗 Architecture

The project follows a **Sidecar Architecture** to maximize iteration speed and UI capability.

| Component | Tech Stack | Responsibility |
| :--- | :--- | :--- |
| **The Brain** (Guide) | React + Vite | The simulation engine. Visualizes the "Lesson Map", tracks progress, and interacts with Vertex AI. |
| **The Backend** | Node.js + Express | Handles AI lesson generation via Gemini 2.0 Flash Exponential. |
| **The Bridge** | (In Dev) WebSockets | The nervous system connecting the Web App to Blender. |
| **The Hands** (Addon) | (In Dev) Python API | A lightweight Blender Addon that listens for commands and executes `bpy` operators. |

## ⚡ Quick Start (One-Click)

On macOS, you can launch the entire environment (Auth + Backend + Frontend) by double-clicking the launch script in the root directory:

1.  Open Finder and navigate to `Chiron3D/`.
2.  Double-click **`launch_chiron.command`**.
3.  The script will prompt for GCP authentication (if needed) and open separate terminal tabs for the server and web app.

---

## 🚀 Getting Started

### Prerequisites
*   **Node.js & npm**: [Download here](https://nodejs.org/)
*   **GCP Project**: For Vertex AI (Gemini) access.
*   **Blender 5.0+**: (Planned for Phase 2)

### ⚙️ Environment Setup
1. **Backend Auth**: Create a `.env` file in the `server/` directory:
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

1) Start the MCP server (if you vendor `blender-mcp` under `third_party/`):

```bash
./tools/run-blender-mcp.sh
```

2) Start Chiron backend

```bash
cd server
npm install
node index.js
```

3) Start Sidecar UI

```bash
cd web
npm install
npm run dev
```

4) Install/enable the Blender addon

Open Blender → Preferences → Add-ons → Install → pick `addon/gemini_addon.py` and enable it. With `third_party/blender-mcp` present the loader will use the upstream addon; otherwise a safe test panel appears under the "Chiron" sidebar.

5) Run the smoke test from [docs/mcp-integration.md](docs/mcp-integration.md) to validate end-to-end flow.

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

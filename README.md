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
   ```env
   GCP_PROJECT_ID=your-project-id
   PORT=5001
   ```
2. **GCP Auth**: Ensure you are authenticated with Google Cloud:
   ```bash
   gcloud auth application-default login
   ```

### 🏁 Running the App
Chiron3D requires both the backend and frontend to be running simultaneously.

#### 1. Start the AI Brain (Backend)
```bash
cd server
npm install
node index.js
```
The server will start at `http://localhost:5001`.

#### 2. Start the Sidecar UI (Frontend)
Open a **new terminal tab**:
```bash
cd web
npm install
npm run dev
```
The interface will be available at the URL provided by Vite (usually `http://localhost:5173`).

## 🗺 Roadmap

- [x] **Phase 0: Ingestion**
    - [x] Extraction of 3,000+ manual pages.
    - [x] Structural conversion to JSON Lesson Map.
- [x] **Phase 1: The Simulation (Current)**
    - [x] Interactive Lesson Tree UI.
    - [x] Vertex AI Content Generation (Gemini 2.0 Flash).
    - [x] Custom AI Request Support ("Ask Chiron...").
    - [x] Simulated "Virtual Blender" View.
    - [x] **Full-Window Conformance**: Optimized UI for premium dashboard experience.
    - [x] **Interactive Loop**: Robust "Lesson Finished" flow with session resets.
- [ ] **Phase 2: The Connector**
    - [ ] Python Addon development.
    - [ ] Web Socket Gateway integration.
    - [ ] Direct UI Highlighting system.

## 📂 Directory Structure

```text
Chiron3D/
├── data/           # Raw Manual extraction scripts & datasets
├── web/            # The React "Sidecar" Frontend
├── server/         # The Node.js AI Backend
└── addon/          # (Planned) The Blender Python Addon
```

---

*Authored by Antigravity & murdadrum.*
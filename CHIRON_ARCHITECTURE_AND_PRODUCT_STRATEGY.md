Below is a **clean, consolidated design document** you can hand directly to your **Codex agent in VS Code**.
It is written in **implementation-oriented language**, with clear boundaries, rationale, and next actions.

You can drop this into your repo as something like:

```
/docs/CHIRON_ARCHITECTURE_AND_PRODUCT_STRATEGY.md
```

---

# Chiron — Architecture, MCP Strategy, and Product Model

## 1. Project Intent (Guiding Principle)

**Chiron exists to respect Blender’s GPL ecosystem while protecting and sustaining the core educational value being created.**

Key principles:

- No rent-seeking monthly subscription
- Blender add-on remains GPL-compatible, inspectable, and minimal
- Core value lives in **pedagogy, curriculum, and guidance**, not in locking down Blender
- Users pay for **learning quality and structure**, not access to Blender itself

This aligns with:

- Open-source ethics
- Blender community expectations
- Long-term trust and adoption

---

## 2. High-Level Architecture Overview

### Core Insight

> The Blender add-on is a **gateway**, not the product.
> Chiron’s “brain” lives outside Blender.

### System Components

```
┌──────────────────────┐
│  Chiron Cloud Brain  │   (Proprietary)
│──────────────────────│
│ - Lesson engine      │
│ - Curriculum packs   │
│ - AI tutoring logic  │
│ - Model orchestration│
│ - Quality control    │
│ - Auth & entitlements│
└──────────▲───────────┘
           │ HTTPS / MCP
┌──────────┴───────────┐
│ Blender Add-on (GPL) │
│──────────────────────│
│ - UI panels          │
│ - Scene introspection│
│ - Tutorial runtime   │
│ - Step validation    │
│ - MCP tool surface   │
└──────────────────────┘
```

---

## 3. Role of MCP in Chiron

### MCP is the **Control Plane**, not the Product

MCP is used to:

- Expose Blender tools safely
- Read scene/context state
- Execute _allowed_ actions
- Support AI-guided workflows

MCP is **not** responsible for:

- Lesson sequencing logic
- Pedagogical decisions
- Product gating
- Brand quality control

Those live in Chiron Cloud.

---

## 4. Recommended MCP Architecture

### Chosen Pattern (Recommended)

**Blender = MCP Tool Server**
**Chiron Cloud = MCP Client / Brain**

Why:

- Keeps Blender add-on thin and GPL-safe
- Centralizes intelligence and evolution
- Allows multiple LLMs without re-shipping add-ons
- Enables future portability to other DCC tools

---

## 5. Changes Recommended to Current `blender-mcp`

### 5.1 Remove Arbitrary Python Execution (Production Builds)

If present:

- Disable or remove any `execute_raw_python` tool
- Keep only in a `DEV_MODE` flag for internal testing

**Reason:**

- Security
- Trust (especially for education / enterprise)
- Product integrity

---

### 5.2 Define a Safe, Granular Tool Surface

#### Read-only Tools (Safe)

```
get_scene_summary()
get_selection()
get_active_object()
get_mode()
get_node_graph_summary()
```

#### Controlled Write Tools

```
run_operator(op_name, params)
create_object(type, params)
apply_modifier(type, params)
set_material(recipe)
```

#### Tutorial-Specific Primitives (Key Differentiator)

```
lesson.start(lesson_id)
lesson.next()
lesson.prev()
lesson.get_state()

ui.highlight(target)
ui.toast(message, level)
ui.annotate(viewport_anchor, text)

step.check(step_id)
```

These tools enable **guided learning**, not just automation.

---

## 6. Tutorial Runtime (Local, Deterministic)

### Why This Must Exist Locally

- Low latency
- Works offline after content download
- Avoids constant cloud roundtrips
- Avoids “LLM vibes” validation

### Responsibilities

- Render lesson steps in Blender UI
- Highlight relevant UI / viewport elements
- Track lesson progress
- Validate step completion deterministically
- Report results to Chiron Cloud when needed

---

## 7. Lesson Pack Design (Critical)

### Lesson Packs Must Be:

- Declarative (JSON / structured)
- Versioned
- Signed
- Cacheable
- Executable without shipping code

### Example Lesson Step Schema (Conceptual)

```
step_id
instruction_text
ui_targets[]
expected_state_check
allowed_actions[]
hints[]
```

The **cloud decides what success looks like**.
The **client checks if it happened**.

---

## 8. Authentication & Gating Strategy

### Approach

- OAuth **Device Code Flow** (best UX for desktop apps)
- Add-on stores access + refresh tokens in Blender preferences
- Cloud controls:

  - lesson pack entitlements
  - AI tutoring access
  - updates

### Offline Behavior

- Lesson packs cached locally
- Tutorials run offline
- AI tutoring requires connection
- No “always-online” requirement

---

## 9. AI Model Strategy

### Design Goal

**Model-agnostic orchestration.**

- Gemini is acceptable and works today
- Abstract model interface now
- Route tasks by cost/latency:

  - Fast models → UI tutoring
  - Strong models → lesson generation, remediation, debugging

This avoids lock-in and future-proofs the product.

---

## 10. Product Model (No Subscriptions)

### Core Tenets

- No monthly rent
- Clear ownership
- Paid upgrades when value increases

### Suggested Structure

- Chiron Core (one-time purchase)
- Paid Lesson Packs (Modeling, Nodes, Animation, etc.)
- Paid major version upgrades (v1 → v2)
- Education / Lab licenses (offline-friendly)

Revenue is tied to **learning value**, not tool access.

---

## 11. What Chiron Is (Positioning)

Chiron is **not**:

- “AI that does Blender for you”

Chiron **is**:

- A guided learning system
- A tutor that verifies understanding
- A bridge between AI assistance and real skill

> Generative AI replaces execution.
> Chiron replaces confusion.

---

## 12. Immediate Next Engineering Steps

**For Codex Agent:**

1. Refactor Blender MCP fork:

   - Remove raw Python execution
   - Expose safe, granular tools

2. Implement Tutorial Runtime skeleton in Blender
3. Define Lesson Pack JSON schema
4. Implement step validation for 1 flagship lesson
5. Add OAuth device-code auth flow
6. Stub Chiron Cloud endpoints:

   - auth
   - lesson pack fetch
   - tutor request

---

## 13. Long-Term Advantage

This architecture:

- Respects GPL
- Earns community trust
- Protects core IP
- Survives the “AI-in-every-tool” future
- Scales beyond Blender

---

**This document is intentionally implementation-oriented.
Codex should treat this as authoritative design guidance.**

If you want, next I can:

- Convert this into **a task breakdown Codex can execute step-by-step**
- Produce **a minimal Lesson Pack v1 JSON schema**
- Write **the README / philosophy statement** for public release

/*
 * Simple Express router to forward lesson JSON to a local MCP server.
 * Add to your existing Express app with: `app.use('/api', require('./mcp_proxy'))`
 * Requires `axios` (install: `npm install axios`).
 */

const express = require("express");
const axios = require("axios");
const router = express.Router();

const MCP_HOST = process.env.MCP_HOST || "localhost";
const MCP_PORT = process.env.MCP_PORT || "9876";
const MCP_PROTOCOL = process.env.MCP_PROTOCOL || "http";
const MCP_AUTH_TOKEN = process.env.MCP_AUTH_TOKEN || "";

const MCP_BASE = `${MCP_PROTOCOL}://${MCP_HOST}:${MCP_PORT}`;

router.post("/mcp/forward", async (req, res) => {
  try {
    const lesson = req.body.lesson || req.body;
    if (!lesson)
      return res.status(400).json({ error: "missing lesson payload" });
    const url = `${MCP_BASE}/lesson`;
    const headers = { "Content-Type": "application/json" };
    if (MCP_AUTH_TOKEN) headers["Authorization"] = `Bearer ${MCP_AUTH_TOKEN}`;
    const r = await axios.post(url, { lesson }, { headers, timeout: 20000 });
    return res.json({ success: true, upstream: r.data });
  } catch (err) {
    console.error("mcp_forward error", err?.message || err);
    return res
      .status(502)
      .json({ error: "failed to forward to MCP", detail: err?.message });
  }
});

router.get("/mcp/health", async (req, res) => {
  try {
    const url = `${MCP_BASE}/health`;
    const r = await axios.get(url, { timeout: 4000 });
    return res.json({ success: true, health: r.data });
  } catch (err) {
    return res.status(502).json({ success: false, error: err?.message });
  }
});

module.exports = router;

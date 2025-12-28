/*
 * Simple mock MCP server for local testing.
 * Starts an HTTP server on MCP_PORT (default 9876) and responds to:
 *  - GET /health
 *  - POST /lesson   (accepts { lesson: [...] })
 *
 * Enable by setting USE_MOCK_MCP=true in env before starting `server/index.js`.
 */

const express = require("express");

function startMockMCP() {
  const app = express();
  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (req, res) => {
    res.json({ status: "ok", server: "mock-mcp" });
  });

  app.post("/lesson", (req, res) => {
    const payload = req.body;
    console.log(
      "[mock-mcp] Received lesson payload:",
      JSON.stringify(payload).slice(0, 1000)
    );
    // Respond with a simple acknowledgement
    res.json({
      success: true,
      received: Array.isArray(payload.lesson) ? payload.lesson.length : 0,
    });
  });

  const port = process.env.MCP_PORT || 9876;
  app.listen(port, "127.0.0.1", () => {
    console.log(
      `[mock-mcp] Mock MCP server listening on http://127.0.0.1:${port}`
    );
  });
}

module.exports = { startMockMCP };

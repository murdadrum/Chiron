require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { VertexAI } = require("@google-cloud/vertexai");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Mount MCP proxy if present (for forwarding lessons to Blender MCP server)
try {
  const mcpProxy = require("./mcp_proxy");
  app.use("/api", mcpProxy);
  console.log("Mounted MCP proxy at /api/mcp");
} catch (err) {
  console.log("MCP proxy not found or failed to load:", err.message);
}

// Mount TTS proxy if present
try {
  const ttsProxy = require('./tts_proxy');
  app.use('/api', ttsProxy);
  console.log('Mounted TTS proxy at /api/tts');
} catch (err) {
  console.log('TTS proxy not found or failed to load:', err.message);
}

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: "us-central1",
});

const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
});

// Endpoint to generate a lesson from a chapter title
app.post("/api/generate-lesson", async (req, res) => {
  const { chapterTitle, userRequest } = req.body;

  try {
    const target = userRequest || chapterTitle;
    const prompt = `You are Chiron, an AI Blender Instructor. 
    The user wants to learn about: "${target}".
    ${
      userRequest
        ? "The user has made a direct request, so provide a specific tutorial for this task."
        : "Based on the Blender 5.0 Manual, provide a 3-step interactive lesson script."
    }
    
    Provide a 3-step interactive lesson script in JSON format.
    Each step should include:
    - text: The spoken instruction (brief and helpful).
    - command: A simulated command (e.g., "HIGHLIGHT_INTERFACE", "ADD_CUBE", "EXTRUDE_FACE").
    - ui_target: The part of the UI to focus on (e.g., "VIEWPORT", "PROPERTIES", "TOOLBAR").

    Return ONLY the JSON array.`;

    const resp = await generativeModel.generateContent(prompt);

    if (!resp.response.candidates || resp.response.candidates.length === 0) {
      return res.status(500).json({
        success: false,
        error:
          "No candidates returned. Safety filters might have blocked the response.",
        details: resp.response,
      });
    }

    const content = resp.response.candidates[0].content.parts[0].text;
    console.log("Gemini matched:", content);

    // Simple JSON extraction (cleaning up any markdown backticks)
    const jsonStr = content.replace(/```json|```/g, "").trim();
    const lessonData = JSON.parse(jsonStr);

    res.json({
      success: true,
      chapter: target,
      steps: lessonData,
    });
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate lesson content",
      message: error.message,
      stack: error.stack,
    });
  }
});

app.listen(port, () => {
  console.log(`Chiron3D Backend listening at http://localhost:${port}`);
});

// Helpful root route for quick checks
app.get("/", (req, res) => {
  res
    .type("text")
    .send(
      `Chiron3D backend running. Available endpoints:\n- POST /api/generate-lesson\n- POST /api/mcp/forward (if proxy mounted)`
    );
});

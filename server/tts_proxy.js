/*
 * TTS proxy: accepts text and forwards a SPEAK command to the MCP server.
 * POST /api/tts { text, voice?, lang?, target?: 'blender'|'web' }
 */

const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const textToSpeech = require("@google-cloud/text-to-speech");
const router = express.Router();

const ttsClient = new textToSpeech.TextToSpeechClient();

const MCP_URL =
  process.env.MCP_URL || `http://localhost:${process.env.MCP_PORT || "9876"}`;
const MCP_FORWARD_PATH = process.env.MCP_FORWARD_PATH || "/lesson";

router.post("/tts", async (req, res) => {
  const { text, voice, lang, target = "blender" } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });

  try {
    if (target === "blender") {
      const lessonPayload = {
        lesson: [
          {
            command: "SPEAK",
            params: { text, voice, lang },
          },
        ],
      };

      await axios.post(`${MCP_URL}${MCP_FORWARD_PATH}`, lessonPayload, {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      });

      return res.json({ status: "forwarded", target: "blender" });
    }

    // Web client TTS: just echo back
    return res.json({ status: "ok", text, voice, lang });
  } catch (err) {
    console.error("tts forward error", err?.message || err);
    return res
      .status(500)
      .json({ error: "forward failed", detail: err?.message });
  }
});

// Server-side audio generation returning signed audio blobs
// POST /api/tts/audio { text, voice?, lang?, format?: 'mp3'|'wav' }
router.post("/tts/audio", async (req, res) => {
  const { text, voice, lang, format = "mp3" } = req.body || {};
  if (!text) return res.status(400).json({ error: "text required" });
  if (text.length > 5000)
    return res.status(400).json({ error: "text too long" });

  const audioEncoding = format === "wav" ? "LINEAR16" : "MP3";
  const mime = format === "wav" ? "audio/wav" : "audio/mpeg";

  try {
    const request = {
      input: { text },
      voice: { languageCode: lang || "en-US", name: voice || undefined },
      audioConfig: { audioEncoding },
    };

    const [response] = await ttsClient.synthesizeSpeech(request);
    const audioContent = response.audioContent;
    if (!audioContent) {
      return res
        .status(500)
        .json({ error: "tts_failed", detail: "no audio content returned" });
    }

    // Signing: use HMAC-SHA256 with server key (env TTS_SIGNING_KEY)
    const signingKey = process.env.TTS_SIGNING_KEY;
    if (!signingKey) {
      return res.status(500).json({ error: "signing_key_missing" });
    }

    const sig = crypto
      .createHmac("sha256", signingKey)
      .update(audioContent)
      .digest("hex");

    return res.json({
      success: true,
      mime,
      audio: audioContent.toString("base64"),
      signature: sig,
      algorithm: "HMAC-SHA256",
      key_id: process.env.TTS_SIGNING_KEY_ID || null,
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("tts.audio error", err?.message || err);
    return res.status(500).json({ error: "tts_error", detail: err?.message });
  }
});

module.exports = router;

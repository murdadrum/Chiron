/*
 * TTS proxy: accepts text and forwards a SPEAK command to the MCP server.
 * POST /api/tts { text, voice?, lang?, target?: 'blender'|'web' }
 */

const express = require('express');
const axios = require('axios');
const router = express.Router();

const MCP_URL = process.env.MCP_URL || `http://localhost:${process.env.MCP_PORT || '9876'}`;
const MCP_FORWARD_PATH = process.env.MCP_FORWARD_PATH || '/lesson/forward';

router.post('/tts', async (req, res) => {
  const { text, voice, lang, target = 'blender' } = req.body || {};
  if (!text) return res.status(400).json({ error: 'text required' });

  try {
    if (target === 'blender') {
      const lessonPayload = {
        lesson: [
          {
            command: 'SPEAK',
            params: { text, voice, lang }
          }
        ]
      };

      await axios.post(`${MCP_URL}${MCP_FORWARD_PATH}`, lessonPayload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000
      });

      return res.json({ status: 'forwarded', target: 'blender' });
    }

    // Web client TTS: just echo back
    return res.json({ status: 'ok', text, voice, lang });
  } catch (err) {
    console.error('tts forward error', err?.message || err);
    return res.status(500).json({ error: 'forward failed', detail: err?.message });
  }
});

module.exports = router;

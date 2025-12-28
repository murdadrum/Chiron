#!/usr/bin/env bash
set -euo pipefail

# Start local dev: MCP server (background) + Chiron Node server (foreground)
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Starting MCP server in background..."
"$ROOT_DIR/tools/run-blender-mcp.sh" &
MCP_PID=$!
echo "MCP PID: $MCP_PID"

echo "Starting Chiron Node server..."
cd "$ROOT_DIR/server"
npm install
node index.js

# When Node exits, kill MCP if still running
if ps -p $MCP_PID > /dev/null; then
  echo "Stopping MCP (pid $MCP_PID)"
  kill $MCP_PID || true
fi

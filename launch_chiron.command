#!/bin/bash

# Chiron3D One-Click Launch Script for macOS
# This script handles authentication and starts both backend and frontend.

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "🏹 Starting Chiron3D Environment..."

# 1. Check for GCP Authentication
if [ ! -f ~/.config/gcloud/application_default_credentials.json ]; then
    echo "🔑 GCP Credentials missing. Opening browser for auth..."
    gcloud auth application-default login
else
    read -p "🔄 GCP Credentials found. Re-authenticate? (y/N): " reauth
    if [[ $reauth == "y" || $reauth == "Y" ]]; then
        gcloud auth application-default login
    fi
fi

# 2. Start Services in new Terminal tabs
echo "🚀 launching Backend and Frontend in separate tabs..."

osascript <<EOF
tell application "Terminal"
    # Create first tab for Backend
    do script "cd '$DIR/server' && npm install && node index.js"
    
    # Create second tab for Frontend
    tell application "System Events" to keystroke "t" using command down
    do script "cd '$DIR/web' && npm install && npm run dev" in front window
end tell
EOF

echo "✨ System Launching. Check your Chrome tabs!"
echo "📡 Backend: http://localhost:5001"
echo "🎨 Frontend: Vite output"

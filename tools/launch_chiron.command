#!/usr/bin/env bash
# Double-click this file in Finder to launch Chiron (backend + demo) and install the addon.

DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/install_and_run.sh" --install-addon

echo
read -n1 -rsp $'Chiron launcher finished. Press any key to close this window...\n'

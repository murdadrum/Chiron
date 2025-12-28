Param()
# PowerShell helper to run the Python MCP server from third_party/blender-mcp
$PSScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
$ThirdParty = Join-Path $RootDir "third_party/blender-mcp"

if (-not (Test-Path $ThirdParty)) {
    Write-Error "third_party/blender-mcp not found. Add it as a git submodule or copy the blender-mcp sources into $ThirdParty"
    exit 1
}

$env:MCP_HOST = $env:MCP_HOST -or "127.0.0.1"
$env:MCP_PORT = $env:MCP_PORT -or "9876"

Push-Location $ThirdParty
if (-not (Test-Path ".venv")) {
    python -m venv .venv
    .\.venv\Scripts\Activate.ps1
    if (Test-Path requirements.txt) { pip install -r requirements.txt }
} else {
    .\.venv\Scripts\Activate.ps1
}

if (Test-Path main.py) { python main.py --host $env:MCP_HOST --port $env:MCP_PORT }
elseif (Test-Path server.py) { python server.py --host $env:MCP_HOST --port $env:MCP_PORT }
else { Write-Error "No known entrypoint (main.py/server.py). Start the MCP server manually inside $ThirdParty."; exit 1 }

Pop-Location

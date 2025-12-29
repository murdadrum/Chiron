This folder is intended to contain the upstream `blender-mcp` Python server sources.

Recommended: add the official repo as a git submodule:

```bash
git submodule add https://github.com/murdadrum/blender-mcp third_party/blender-mcp
git submodule update --init --recursive
```

After adding the submodule, run the helper:

```bash
./tools/run-blender-mcp.sh
```

If you prefer to copy sources instead of using a submodule, copy the contents of the upstream repo into this folder.

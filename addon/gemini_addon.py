"""
Loader wrapper: if the upstream `third_party/blender-mcp/gemini_addon.py`
exists (e.g., added as a submodule), load and execute it so the real addon
is active. Otherwise, provide a small safe fallback (test connection) so the
addon can be enabled while development continues.

This avoids copying large upstream files into `addon/` and makes it easy to
vendor the upstream repo under `third_party/blender-mcp`.
"""

import os
import importlib.util
import sys

THIS_DIR = os.path.dirname(os.path.realpath(__file__))
THIRD_PARTY_ADDON = os.path.normpath(os.path.join(THIS_DIR, "..", "third_party", "blender-mcp", "gemini_addon.py"))

if os.path.exists(THIRD_PARTY_ADDON):
    # Load upstream addon file dynamically
    spec = importlib.util.spec_from_file_location("chiron.upstream_gemini", THIRD_PARTY_ADDON)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    # expose module-level names if needed
    globals().update({k: getattr(module, k) for k in dir(module) if not k.startswith("__")})
else:
    # Fallback minimal safe implementation
    import bpy
    import urllib.request
    import urllib.error
    from bpy.props import StringProperty

    bl_info = {
        "name": "Chiron MCP Placeholder",
        "author": "Chiron",
        "version": (0, 1, 0),
        "blender": (5, 0, 0),
        "location": "View3D > Sidebar > Chiron",
        "description": "Placeholder UI for MCP integration; safe test operator only.",
        "category": "3D View",
    }

    class CHIRON_OT_mcp_test_connection(bpy.types.Operator):
        bl_idname = "chiron.mcp_test_connection"
        bl_label = "Test MCP Connection"
        bl_description = "Ping the MCP server health endpoint"

        def execute(self, context):
            scn = context.scene
            host = scn.chiron_mcp_host or "localhost"
            port = scn.chiron_mcp_port or "9876"
            protocol = scn.chiron_mcp_protocol or "http"
            url = f"{protocol}://{host}:{port}/health"
            try:
                with urllib.request.urlopen(url, timeout=5) as r:
                    body = r.read().decode("utf-8")
                    self.report({"INFO"}, f"MCP health: {body}")
            except urllib.error.URLError as e:
                self.report({"ERROR"}, f"MCP ping failed: {e}")
            except Exception as e:
                self.report({"ERROR"}, f"Unexpected error: {e}")
            return {"FINISHED"}


    class CHIRON_PT_mcp_panel(bpy.types.Panel):
        bl_label = "Chiron MCP"
        bl_idname = "CHIRON_PT_mcp_panel"
        bl_space_type = "VIEW_3D"
        bl_region_type = "UI"
        bl_category = "Chiron"

        def draw(self, context):
            layout = self.layout
            scn = context.scene
            layout.prop(scn, "chiron_mcp_host")
            layout.prop(scn, "chiron_mcp_port")
            layout.prop(scn, "chiron_mcp_protocol")
            layout.operator("chiron.mcp_test_connection", icon="URL")


    def register():
        bpy.types.Scene.chiron_mcp_host = StringProperty(
            name="MCP Host",
            description="Hostname for the local MCP server",
            default="localhost",
        )
        bpy.types.Scene.chiron_mcp_port = StringProperty(
            name="MCP Port",
            description="Port for the local MCP server",
            default="9876",
        )
        bpy.types.Scene.chiron_mcp_protocol = StringProperty(
            name="Protocol",
            description="http or https",
            default="http",
        )

        bpy.utils.register_class(CHIRON_OT_mcp_test_connection)
        bpy.utils.register_class(CHIRON_PT_mcp_panel)


    def unregister():
        try:
            del bpy.types.Scene.chiron_mcp_host
            del bpy.types.Scene.chiron_mcp_port
            del bpy.types.Scene.chiron_mcp_protocol
        except Exception:
            pass
        bpy.utils.unregister_class(CHIRON_PT_mcp_panel)
        bpy.utils.unregister_class(CHIRON_OT_mcp_test_connection)


    if __name__ == "__main__":
        register()

# Merge in any extra command handlers (e.g., SPEAK) provided by `addon/command_handlers.py`
try:
    from .command_handlers import COMMAND_HANDLERS as EXTRA_COMMAND_HANDLERS
except Exception:
    EXTRA_COMMAND_HANDLERS = {}

if EXTRA_COMMAND_HANDLERS:
    try:
        if 'COMMAND_HANDLERS' in globals():
            COMMAND_HANDLERS.update(EXTRA_COMMAND_HANDLERS)
        else:
            COMMAND_HANDLERS = EXTRA_COMMAND_HANDLERS
    except Exception as e:
        print('[chiron.addon] Failed to merge EXTRA_COMMAND_HANDLERS:', e)

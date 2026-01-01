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

# In production builds we must NOT execute arbitrary upstream code.
# Allow dynamic loading only in explicit development mode (CHIRON_DEV_MODE=1).
if os.path.exists(THIRD_PARTY_ADDON) and os.environ.get("CHIRON_DEV_MODE") == "1":
    # Dev-only: load upstream addon file dynamically for local testing.
    spec = importlib.util.spec_from_file_location("chiron.upstream_gemini", THIRD_PARTY_ADDON)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    # Do not blindly inject all globals; expose only a safe, minimal surface if required.
    try:
        if hasattr(module, "register") and hasattr(module, "unregister"):
            register = module.register
            unregister = module.unregister
    except Exception:
        pass
else:
    if os.path.exists(THIRD_PARTY_ADDON):
        # Upstream addon is present but we're not in dev mode — refuse to execute it.
        print("[chiron.addon] Upstream gemini_addon found but CHIRON_DEV_MODE!=1; skipping execution for safety.")
else:
    # Fallback minimal safe implementation
    import bpy
    import urllib.request
    import urllib.error
    from bpy.props import StringProperty, BoolProperty

    bl_info = {
        "name": "Chiron MCP Placeholder",
        "author": "Chiron",
        "version": (0, 1, 0),
        "blender": (5, 0, 0),
        "location": "View3D > Sidebar > Chiron",
        "description": "Placeholder UI for MCP integration; safe test operator only.",
        "category": "3D View",
    }

    class CHIRON_AddonPreferences(bpy.types.AddonPreferences):
        bl_idname = __package__ or __name__.split('.')[0]

        chiron_tts_enabled: BoolProperty(
            name="Enable TTS",
            description="Allow Chiron to play TTS audio locally (opt-in)",
            default=False,
        )

        chiron_tts_voice: StringProperty(
            name="TTS Voice",
            description="Preferred TTS voice name (optional)",
            default="",
        )

        def draw(self, context):
            layout = self.layout
            layout.label(text="Chiron Preferences")
            layout.prop(self, "chiron_tts_enabled")
            layout.prop(self, "chiron_tts_voice")

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
            # Show persisted addon preferences for TTS when available
            try:
                addon_key = __package__ or __name__.split('.')[0]
                prefs = context.preferences.addons[addon_key].preferences
                layout.prop(prefs, "chiron_tts_enabled")
                layout.prop(prefs, "chiron_tts_voice")
            except Exception:
                # Fallback to scene-level toggle if preferences unavailable
                layout.prop(scn, "chiron_tts_enabled")
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
        # Note: persistent TTS settings are stored in AddonPreferences; keep
        # a transient scene toggle for quick tests if preferences are unavailable.

        try:
            bpy.utils.register_class(CHIRON_AddonPreferences)
        except Exception:
            pass
        bpy.utils.register_class(CHIRON_OT_mcp_test_connection)
        bpy.utils.register_class(CHIRON_PT_mcp_panel)


    def unregister():
        try:
            del bpy.types.Scene.chiron_mcp_host
            del bpy.types.Scene.chiron_mcp_port
            del bpy.types.Scene.chiron_mcp_protocol
        except Exception:
            pass
        try:
            bpy.utils.unregister_class(CHIRON_PT_mcp_panel)
        except Exception:
            pass
        try:
            bpy.utils.unregister_class(CHIRON_OT_mcp_test_connection)
        except Exception:
            pass
        try:
            bpy.utils.unregister_class(CHIRON_AddonPreferences)
        except Exception:
            pass


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

bl_info = {
    "name": "Chiron MCP Integration (placeholder)",
    "author": "Chiron",
    "version": (0, 1, 0),
    "blender": (5, 0, 0),
    "location": "View3D > Sidebar > Chiron",
    "description": "Placeholder wrapper for the MCP-based Chiron addon. Replace `gemini_addon.py` with upstream file when ready.",
    "category": "3D View",
}

import importlib
import bpy

MODULE_NAME = "addon.gemini_addon"

def _get_classes_from_module(mod):
    classes = []
    for name in dir(mod):
        obj = getattr(mod, name)
        try:
            if issubclass(obj, bpy.types.Operator) or issubclass(obj, bpy.types.Panel):
                classes.append(obj)
        except Exception:
            continue
    return classes

def register():
    try:
        mod = importlib.import_module(MODULE_NAME)
    except Exception:
        # If the real addon isn't present yet, register nothing but keep addon loadable.
        print("[chiron.addon] gemini_addon not found; load placeholder only.")
        return

    classes = _get_classes_from_module(mod)
    for cls in classes:
        bpy.utils.register_class(cls)

def unregister():
    try:
        mod = importlib.import_module(MODULE_NAME)
    except Exception:
        return
    classes = _get_classes_from_module(mod)
    for cls in reversed(classes):
        try:
            bpy.utils.unregister_class(cls)
        except Exception:
            pass

if __name__ == "__main__":
    register()

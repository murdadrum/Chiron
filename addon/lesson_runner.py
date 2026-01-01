"""
Deterministic Lesson Runner skeleton for Chiron add-on.

This runner validates lesson JSON and executes a safe, whitelisted
subset of commands locally. Production behavior should not execute
arbitrary code; heavy actions (e.g., mutating the scene) must be
implemented as explicit, audited handlers.
"""
import time
import logging
from typing import Dict, Any

from .validation import validate_lesson

LOGGER = logging.getLogger("chiron.lesson_runner")

# Minimal whitelist of allowed command names
ALLOWED_COMMANDS = {
    "SPEAK",
    "WAIT",
    "UI_HIGHLIGHT",
    "RUN_OPERATOR",
}


class LessonRunner:
    def __init__(self, lesson: Dict[str, Any]):
        self.lesson = lesson

    def validate(self) -> bool:
        """Validate lesson JSON structure. Raises ValueError on failure."""
        return validate_lesson(self.lesson)

    def run(self) -> None:
        """Run the lesson deterministically by executing each step in order."""
        self.validate()
        steps = self.lesson.get("steps", [])
        for step in steps:
            try:
                self.run_step(step)
            except Exception as e:
                LOGGER.error("Step %s failed: %s", step.get("step_id"), e)
                raise

    def run_step(self, step: Dict[str, Any]) -> None:
        cmd = step.get("command")
        if not cmd:
            raise ValueError("Missing command in step")
        if cmd not in ALLOWED_COMMANDS:
            raise ValueError(f"Command not allowed: {cmd}")

        # Dispatch to handlers
        if cmd == "SPEAK":
            self._handle_speak(step.get("args", {}))
        elif cmd == "WAIT":
            self._handle_wait(step.get("args", {}))
        elif cmd == "UI_HIGHLIGHT":
            self._handle_ui_highlight(step.get("args", {}))
        elif cmd == "RUN_OPERATOR":
            self._handle_run_operator(step.get("args", {}))

    def _handle_speak(self, args: Dict[str, Any]) -> None:
        text = args.get("text") or args.get("message")
        if not text:
            LOGGER.warning("SPEAK called without text")
            return
        # Do NOT execute subprocesses here. TTS must be handled by an opt-in adapter.
        LOGGER.info("SPEAK (queued): %s", text)

    def _handle_wait(self, args: Dict[str, Any]) -> None:
        seconds = float(args.get("seconds", 0))
        if seconds > 0:
            time.sleep(seconds)

    def _handle_ui_highlight(self, args: Dict[str, Any]) -> None:
        target = args.get("target")
        LOGGER.info("UI_HIGHLIGHT requested for target: %s", target)

    def _handle_run_operator(self, args: Dict[str, Any]) -> None:
        op = args.get("operator")
        params = args.get("params", {})
        if not op or not isinstance(op, str):
            raise ValueError("RUN_OPERATOR requires an operator string")
        # In production this should map to an explicit whitelist of allowed operators
        LOGGER.info("RUN_OPERATOR (safe proxy) %s with %s", op, params)

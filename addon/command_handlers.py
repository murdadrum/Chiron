"""
Extra command handlers for Chiron addon — safe, limited TTS handler.
This file is imported by the addon loader and merged into the main
`COMMAND_HANDLERS` mapping when present.
"""
import platform
import subprocess
import threading


def _run_subprocess(cmd):
    try:
        subprocess.Popen(cmd)
    except Exception as e:
        print(f"[Chiron] TTS subprocess failed: {e}")


def speak_handler(params: dict):
    text = params.get('text') or ''
    voice = params.get('voice')
    if not text:
        print('[Chiron] SPEAK: no text provided')
        return {'status': 'no_text'}

    system = platform.system()
    try:
        if system == 'Darwin':
            cmd = ['say']
            if voice:
                cmd += ['-v', voice]
            cmd += [text]
            threading.Thread(target=_run_subprocess, args=(cmd,), daemon=True).start()
            return {'status': 'speaking', 'engine': 'say'}
        else:
            # Try pyttsx3 as a cross-platform fallback
            try:
                import pyttsx3

                def _pyttsx3_speak():
                    try:
                        engine = pyttsx3.init()
                        if voice:
                            engine.setProperty('voice', voice)
                        engine.say(text)
                        engine.runAndWait()
                    except Exception as e:
                        print('[Chiron] pyttsx3 speak failed:', e)

                threading.Thread(target=_pyttsx3_speak, daemon=True).start()
                return {'status': 'speaking', 'engine': 'pyttsx3'}
            except Exception as e:
                print('[Chiron] TTS not available (pyttsx3)', e)
                return {'status': 'no_tts_engine'}
    except Exception as e:
        print('[Chiron] SPEAK handler failed:', e)
        return {'status': 'error', 'error': str(e)}


COMMAND_HANDLERS = {
    'SPEAK': speak_handler
}

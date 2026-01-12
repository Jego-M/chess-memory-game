const AUDIO_KEY = "chessMemory.audioEnabled"

export function loadAudioEnabled(defaultValue = true): boolean {
  const raw = localStorage.getItem(AUDIO_KEY)
  return raw === null ? defaultValue : raw === "true"
}

export function saveAudioEnabled(value: boolean) {
  localStorage.setItem(AUDIO_KEY, String(value))
}

// sfx.ts
type SfxName =
  | "gameStart" | "gameEnd"
  | "moveA" | "moveB" | "capture"
  | "correct" | "wrong"
  | "timer" | "remember" | "place"

const urls: Record<SfxName, string> = {
  gameStart: "/sounds/gameStart.mp3",
  gameEnd: "/sounds/gameEnd.mp3",
  moveA: "/sounds/moveA.mp3",
  moveB: "/sounds/moveB.mp3",
  capture: "/sounds/capture.mp3",
  correct: "/sounds/correct.mp3",
  wrong: "/sounds/wrong.mp3",
  timer: "/sounds/timer.mp3",
  remember: "/sounds/remember.mp3",
  place: "/sounds/place.mp3",
}

const buffers: Partial<Record<SfxName, AudioBuffer>> = {}

let ctx: AudioContext | null = null
let initPromise: Promise<void> | null = null

function getAudioContext(): AudioContext {
  if (ctx) return ctx

  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

  ctx = new AudioCtx()
  return ctx
}

export function initSfx(): Promise<void> {
  if (initPromise) return initPromise

  initPromise = (async () => {
    const ac = getAudioContext()

    if (ac.state !== "running") {
      try {
        await ac.resume()
      } catch {
      }
    }

    await Promise.all(
      (Object.keys(urls) as SfxName[]).map(async (name) => {
        if (buffers[name]) return
        const res = await fetch(urls[name])
        const arr = await res.arrayBuffer()
        buffers[name] = await ac.decodeAudioData(arr)
      })
    );
  })()

  return initPromise;
}

export async function playSfx(name: SfxName, volume = 1) {
  if (!ctx)
      await initSfx()
  if (!ctx) return

  const buffer = buffers[name]
  if (!buffer) return;

  const source = ctx.createBufferSource()
  source.buffer = buffer

  const gain = ctx.createGain()
  gain.gain.value = volume

  source.connect(gain)
  gain.connect(ctx.destination)
  source.start()
}

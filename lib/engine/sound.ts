export type SoundCue = 'correct' | 'timeUp'

let audioContext: AudioContext | null = null

export function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctor) return null
  if (!audioContext) audioContext = new Ctor()
  if (audioContext.state === 'suspended') void audioContext.resume()
  return audioContext
}

function tone(ctx: AudioContext, frequency: number, start: number, duration: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export function playCue(cue: SoundCue, enabled: boolean) {
  if (!enabled) return
  const ctx = getAudioContext()
  if (!ctx) return
  const now = ctx.currentTime
  if (cue === 'correct') {
    tone(ctx, 660, now, 0.12)
    tone(ctx, 880, now + 0.1, 0.18)
    return
  }
  tone(ctx, 440, now, 0.2)
  tone(ctx, 330, now + 0.22, 0.2)
  tone(ctx, 220, now + 0.44, 0.35)
}

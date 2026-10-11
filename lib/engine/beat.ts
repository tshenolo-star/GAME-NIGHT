import { getAudioContext } from './sound'

const SCALE = [0, 3, 5, 7, 10, 12]

function kick(ctx: AudioContext, when: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(150, when)
  osc.frequency.exponentialRampToValueAtTime(45, when + 0.12)
  gain.gain.setValueAtTime(0.7, when)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.2)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(when)
  osc.stop(when + 0.22)
}

function hat(ctx: AudioContext, when: number, noise: AudioBuffer) {
  const src = ctx.createBufferSource()
  const filter = ctx.createBiquadFilter()
  const gain = ctx.createGain()
  src.buffer = noise
  filter.type = 'highpass'
  filter.frequency.value = 7000
  gain.gain.setValueAtTime(0.18, when)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05)
  src.connect(filter)
  filter.connect(gain)
  gain.connect(ctx.destination)
  src.start(when)
  src.stop(when + 0.06)
}

function bass(ctx: AudioContext, when: number, frequency: number, length: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'triangle'
  osc.frequency.value = frequency
  gain.gain.setValueAtTime(0.0001, when)
  gain.gain.exponentialRampToValueAtTime(0.35, when + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(when)
  osc.stop(when + length + 0.02)
}

export function startBeat(seed: number): (() => void) | null {
  const ctx = getAudioContext()
  if (!ctx) return null

  const bpm = 92 + (seed % 5) * 9
  const stepSeconds = 60 / bpm / 2
  const root = 55 * Math.pow(2, (seed * 5) % 12 / 12)
  const pattern = Array.from({ length: 8 }, (_, i) => SCALE[(seed + i * 3) % SCALE.length])

  const noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.06), ctx.sampleRate)
  const data = noise.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  let step = 0
  let nextTime = ctx.currentTime + 0.05

  const schedule = () => {
    while (nextTime < ctx.currentTime + 0.3) {
      const position = step % 8
      if (position % 4 === 0) kick(ctx, nextTime)
      if (position % 2 === 1) hat(ctx, nextTime, noise)
      if (position % 2 === 0) bass(ctx, nextTime, root * Math.pow(2, pattern[position] / 12), stepSeconds * 1.6)
      nextTime += stepSeconds
      step++
    }
  }

  schedule()
  const id = setInterval(schedule, 100)
  return () => clearInterval(id)
}

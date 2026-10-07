'use client'
import React from 'react'
import { Pause, Play } from 'lucide-react'
import { TimerControls } from '@/lib/engine'

export function TimerDisplay({ timer, accent = 'var(--gold)' }: { timer: TimerControls; accent?: string }) {
  const urgent = timer.secondsLeft <= 5 && timer.isRunning
  const paused = timer.isRunning && timer.isPaused

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 48,
          letterSpacing: 2,
          color: urgent ? 'var(--red)' : accent,
          transition: 'color 0.2s',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {timer.secondsLeft}
      </div>
      {timer.isRunning && (
        <button
          onClick={timer.pause}
          aria-label="Pause"
          style={{
            background: 'var(--bg3)', border: '1px solid var(--border2)',
            borderRadius: 20, padding: '8px 14px', color: 'var(--text)',
            display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
          }}
        >
          <Pause size={16} /> Pause
        </button>
      )}
      {paused && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 40, background: 'var(--bg)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
          }}
        >
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, letterSpacing: 3, color: 'var(--gold)' }}>Paused</div>
          <div style={{ fontSize: 14, color: 'var(--text2)' }}>{timer.secondsLeft}s left</div>
          <button
            onClick={timer.resume}
            aria-label="Resume"
            style={{
              background: 'var(--gold)', color: '#1a1200', border: 'none', borderRadius: 24,
              padding: '14px 32px', fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            <Play size={18} /> Resume
          </button>
        </div>
      )}
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import { Flag } from 'lucide-react'

export function EndGameButton({ onEnd }: { onEnd: () => void }) {
  const [confirming, setConfirming] = useState(false)

  const base: React.CSSProperties = {
    padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
    border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text2)',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }

  return (
    <div style={{ position: 'fixed', top: 10, right: 12, zIndex: 20, display: 'flex', gap: 6 }}>
      {confirming ? (
        <>
          <button type="button" onClick={onEnd} style={{ ...base, background: 'var(--red)', color: '#fff', border: '1px solid var(--red)' }}>
            Yes, end game
          </button>
          <button type="button" onClick={() => setConfirming(false)} style={base}>Keep playing</button>
        </>
      ) : (
        <button type="button" onClick={() => setConfirming(true)} style={base}>
          <Flag size={12} /> End Game
        </button>
      )}
    </div>
  )
}

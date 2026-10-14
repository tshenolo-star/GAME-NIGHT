'use client'
import React, { useState } from 'react'
import { Flag } from 'lucide-react'

export function EndGameButton({ onEnd }: { onEnd: () => void }) {
  const [confirming, setConfirming] = useState(false)

  const base: React.CSSProperties = {
    padding: '0 14px', minHeight: 40, borderRadius: 10, fontSize: 13, fontWeight: 600,
    border: '1px solid var(--border2)', background: 'var(--bg2)', color: 'var(--text2)',
    display: 'inline-flex', alignItems: 'center', gap: 6,
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '8px 12px', width: '100%' }}>
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

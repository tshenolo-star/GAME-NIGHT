'use client'
import React from 'react'
import { Bomb } from 'lucide-react'

export type TileState = 'safe' | 'boom'

export function BombBoard({
  tiles, revealed, selected = null, bombTile = null, disabled = false, onTap,
}: {
  tiles: number
  revealed: Record<number, TileState>
  selected?: number | null
  bombTile?: number | null
  disabled?: boolean
  onTap: (tile: number) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(44px, 1fr))', gap: 8, width: '100%' }}>
      {Array.from({ length: tiles }, (_, i) => i + 1).map((n) => {
        const state = revealed[n]
        const isSelected = selected === n
        const showBomb = bombTile === n && state !== 'boom'
        const background = state === 'boom' ? 'var(--red)' : state === 'safe' ? 'rgba(52, 211, 153, 0.15)' : isSelected ? 'var(--gold)' : 'var(--bg3)'
        const color = state === 'boom' ? '#fff' : state === 'safe' ? '#34d399' : isSelected ? '#1a1200' : 'var(--text)'
        const border = state === 'safe' ? '1px solid #34d399' : showBomb ? '1px solid var(--red)' : '1px solid var(--border2)'
        return (
          <button
            key={n}
            type="button"
            aria-label={`Tile ${n}`}
            disabled={disabled || state !== undefined}
            onClick={() => onTap(n)}
            style={{
              minHeight: 46, borderRadius: 12, background, color, border,
              fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              opacity: disabled && state === undefined ? 0.6 : 1,
            }}
          >
            {state === 'boom' ? <Bomb size={22} /> : state === 'safe' ? <span style={{ fontSize: 12, fontWeight: 700 }}>SAFE</span> : showBomb ? <Bomb size={20} color="var(--red)" /> : n}
          </button>
        )
      })}
    </div>
  )
}

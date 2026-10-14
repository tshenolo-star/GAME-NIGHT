'use client'
import React from 'react'
import { Player } from '@/lib/engine/types'

export function ContestantChips({
  players, scores, selectedId, onSelect,
}: {
  players: Player[]
  scores: Record<string, number>
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
      {players.map((p) => {
        const active = selectedId === p.id
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p.id)}
            style={{
              minHeight: 44, padding: '0 14px', borderRadius: 22, fontSize: 13, fontWeight: 600,
              background: active ? 'var(--gold)' : 'var(--bg3)', color: active ? '#1a1200' : 'var(--text)',
              border: active ? '1px solid var(--gold)' : '1px solid var(--border2)',
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}
          >
            {p.name}
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 15, color: active ? '#1a1200' : 'var(--gold)' }}>
              {scores[p.id] ?? 0}
            </span>
          </button>
        )
      })}
    </div>
  )
}

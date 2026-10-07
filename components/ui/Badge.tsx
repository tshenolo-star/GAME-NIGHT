'use client'
import React from 'react'

const BADGE_COLORS: Record<string, { bg: string; fg: string }> = {
  '18+': { bg: '#3a1a1a', fg: '#f5824a' },
  family: { bg: '#1a3a2a', fg: '#34d399' },
  new: { bg: '#2a1a3a', fg: '#c084fc' },
  default: { bg: 'var(--bg3)', fg: 'var(--text2)' },
}

export function Badge({ children, kind = 'default' }: { children: React.ReactNode; kind?: string }) {
  const c = BADGE_COLORS[kind] ?? BADGE_COLORS.default
  return (
    <span
      style={{
        fontSize: 10,
        padding: '2px 8px',
        borderRadius: 10,
        fontWeight: 700,
        letterSpacing: 0.5,
        background: c.bg,
        color: c.fg,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

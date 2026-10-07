'use client'
import React from 'react'

export function Surface({
  children,
  style,
  onClick,
  hoverAccent,
}: {
  children: React.ReactNode
  style?: React.CSSProperties
  onClick?: () => void
  hoverAccent?: string
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg2)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        transition: 'border-color 0.2s, transform 0.15s',
        cursor: onClick ? 'pointer' : undefined,
        ...style,
      }}
      onMouseEnter={(e) => { if (hoverAccent) e.currentTarget.style.borderColor = hoverAccent }}
      onMouseLeave={(e) => { if (hoverAccent) e.currentTarget.style.borderColor = 'var(--border)' }}
    >
      {children}
    </div>
  )
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string
  onBack?: () => void
  right?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 10,
      }}
    >
      {onBack ? (
        <button
          onClick={onBack}
          style={{
            background: 'none', border: '1px solid var(--border)', color: 'var(--text2)',
            padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          }}
        >
          ← Back
        </button>
      ) : <div style={{ width: 70 }} />}
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, color: 'var(--text)' }}>
        {title}
      </div>
      {right ?? <div style={{ width: 70 }} />}
    </div>
  )
}

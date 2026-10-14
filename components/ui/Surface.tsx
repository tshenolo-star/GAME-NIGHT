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
            padding: '0 12px', minHeight: 40, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13,
          }}
        >
          ← Back
        </button>
      ) : <div style={{ width: 70, flexShrink: 0 }} />}
      <div style={{ flex: 1, minWidth: 0, textAlign: 'center', padding: '0 8px', fontFamily: 'var(--font-display)', fontSize: 'clamp(15px, 4.8vw, 20px)', letterSpacing: 'clamp(1px, 0.7vw, 3px)', color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </div>
      {right ?? <div style={{ width: 70, flexShrink: 0 }} />}
    </div>
  )
}

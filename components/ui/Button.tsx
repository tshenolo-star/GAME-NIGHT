'use client'
import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANT_STYLES: Record<Variant, React.CSSProperties> = {
  primary: { background: 'var(--gold)', color: '#1a1200', border: '1px solid var(--gold)' },
  secondary: { background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)' },
  ghost: { background: 'transparent', color: 'var(--text2)', border: '1px solid var(--border)' },
  danger: { background: 'var(--red)', color: '#fff', border: '1px solid var(--red)' },
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth,
  disabled,
  size = 'md',
  type = 'button',
  style,
}: {
  children: React.ReactNode
  onClick?: () => void
  variant?: Variant
  fullWidth?: boolean
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  type?: 'button' | 'submit'
  style?: React.CSSProperties
}) {
  const padding = size === 'sm' ? '8px 14px' : size === 'lg' ? '16px 28px' : '12px 20px'
  const fontSize = size === 'sm' ? 13 : size === 'lg' ? 17 : 15
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...VARIANT_STYLES[variant],
        padding,
        fontSize,
        borderRadius: 'var(--radius)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        letterSpacing: 0.3,
        width: fullWidth ? '100%' : undefined,
        opacity: disabled ? 0.5 : 1,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'transform 0.1s, opacity 0.2s',
        ...style,
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'scale(0.97)' }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      {children}
    </button>
  )
}

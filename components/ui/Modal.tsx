'use client'
import React from 'react'
import { X } from 'lucide-react'

export function Modal({
  title,
  children,
  onClose,
}: {
  title: string
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--bg2)', border: '1px solid var(--border2)',
          borderRadius: '20px 20px 0 0', width: '100%', maxWidth: 560,
          maxHeight: '85vh', overflowY: 'auto', padding: 24,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--gold)' }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 20, padding: 6 }}
          >
            <X size={16} color="var(--text2)" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

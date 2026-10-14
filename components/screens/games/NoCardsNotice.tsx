'use client'
import React from 'react'
import { Button } from '../../ui/Button'

export function NoCardsNotice({ onBack }: { onBack: () => void }) {
  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16, textAlign: 'center' }}>
      <div style={{ color: 'var(--text2)', fontSize: 15, maxWidth: 340, lineHeight: 1.5 }}>
        No cards are available for this audience and intensity. Go back and change your settings.
      </div>
      <Button onClick={onBack}>Back to setup</Button>
    </div>
  )
}

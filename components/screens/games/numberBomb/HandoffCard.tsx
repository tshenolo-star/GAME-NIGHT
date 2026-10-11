'use client'
import React from 'react'
import { EyeOff } from 'lucide-react'
import { Button } from '../../../ui/Button'
import { Surface } from '../../../ui/Surface'

export function HandoffCard({
  lead, name, note, action, onContinue,
}: {
  lead: string
  name: string
  note?: string
  action: string
  onContinue: () => void
}) {
  return (
    <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380, width: '100%' }}>
      <EyeOff size={36} color="var(--text2)" style={{ marginBottom: 14 }} />
      <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 6 }}>{lead}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)', marginBottom: note ? 10 : 24 }}>{name}</div>
      {note && <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 24, lineHeight: 1.5 }}>{note}</div>}
      <Button fullWidth size="lg" onClick={onContinue}>{action}</Button>
    </Surface>
  )
}

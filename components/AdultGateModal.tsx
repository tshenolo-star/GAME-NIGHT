'use client'
import React, { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Flame } from 'lucide-react'

// Structural isolation of adult content: this is the ONLY place in the app
// that can flip settings.adultUnlocked to true, and it requires an explicit
// typed confirmation — not just a tap-through.
export function AdultGateModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  const [confirmed, setConfirmed] = useState(false)
  return (
    <Modal title="Adults Only" onClose={onCancel}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Flame size={40} color="var(--orange)" />
        </div>
        <p style={{ color: 'var(--text2)', fontSize: 14, lineHeight: 1.6, textAlign: 'center' }}>
          This mode includes explicit questions, dares, and challenges intended only for
          consenting adults. It will never appear in Family, Friends, or Co-workers modes.
        </p>
        <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' }}>
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            style={{ width: 18, height: 18 }}
          />
          Everyone playing is 18 or older and consents to adult content.
        </label>
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="ghost" fullWidth onClick={onCancel}>Cancel</Button>
          <Button variant="danger" fullWidth disabled={!confirmed} onClick={onConfirm}>
            Unlock Adults 18+
          </Button>
        </div>
      </div>
    </Modal>
  )
}

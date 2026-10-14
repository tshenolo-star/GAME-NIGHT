'use client'
import React, { useState } from 'react'
import { Users, Clock, Timer as TimerIcon, Trophy, Layers } from 'lucide-react'
import { GameIcon } from '../ui/Icon'
import { ScreenHeader } from '../ui/Surface'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Badge } from '../ui/Badge'
import { GameManifest, Card as CardT } from '@/lib/engine/types'
import { CARD_PACKS } from '@/lib/content/cards'
import { filterCards } from '@/lib/engine/cardEngine'
import { GameSettings } from '@/lib/engine/types'

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center', minWidth: 0 }}>
      <div style={{ color: 'var(--text2)' }}>{icon}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--text)', letterSpacing: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</div>
    </div>
  )
}

export function GameInfoScreen({
  game, settings, onBack, onStart,
}: { game: GameManifest; settings: GameSettings; onBack: () => void; onStart: () => void }) {
  const [showHowTo, setShowHowTo] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const previewCards: CardT[] = filterCards(CARD_PACKS[game.cardPackId] ?? [], {
    audience: settings.audience,
    maxIntensity: settings.intensity,
    adultUnlocked: settings.adultUnlocked,
  }).slice(0, 6)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <ScreenHeader title={game.name} onBack={onBack} />

      <div style={{ padding: '24px clamp(16px, 5vw, 24px) 100px', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ color: game.accent, marginBottom: 10, display: 'flex', justifyContent: 'center' }}>
            <GameIcon name={game.icon} size={44} />
          </div>
          <div style={{ fontSize: 15, color: 'var(--text2)', fontStyle: 'italic' }}>{game.tagline}</div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
            {game.audience.includes('adults') && <Badge kind="18+">18+</Badge>}
            {game.audience.includes('family') && <Badge kind="family">Family Safe</Badge>}
            <Badge>{game.ageRating === 'all' ? 'All ages' : game.ageRating}</Badge>
          </div>
        </div>

        <p style={{ color: 'var(--text)', fontSize: 14, lineHeight: 1.6, marginBottom: 24, textAlign: 'center' }}>
          {game.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(96px, 1fr))', gap: 16, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '18px 12px', marginBottom: 24 }}>
          <Stat icon={<Users size={18} />} label="Players" value={game.maxPlayers ? `${game.minPlayers}–${game.maxPlayers}` : `${game.minPlayers}+`} />
          <Stat icon={<Layers size={18} />} label="Teams" value={game.recommendedTeams} />
          <Stat icon={<Clock size={18} />} label="Duration" value={`${game.durationMinutes[0]}–${game.durationMinutes[1]}m`} />
          <Stat icon={<Trophy size={18} />} label="Difficulty" value={game.difficulty} />
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          {game.usesTimer && <Badge><TimerIcon size={10} style={{ display: 'inline', marginRight: 3 }} />Timed</Badge>}
          {game.requiresTeams && <Badge><Users size={10} style={{ display: 'inline', marginRight: 3 }} />Teams</Badge>}
          {game.usesPoints && <Badge><Trophy size={10} style={{ display: 'inline', marginRight: 3 }} />Scored</Badge>}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={() => setShowHowTo(true)}>How to Play</Button>
          {/* <Button variant="secondary" fullWidth onClick={() => setShowPreview(true)}>Preview Cards</Button> */}
          <Button variant="primary" fullWidth size="lg" onClick={onStart}>Start Game</Button>
        </div>
      </div>

      {showHowTo && (
        <Modal title="How to Play" onClose={() => setShowHowTo(false)}>
          <ol style={{ paddingLeft: 20, color: 'var(--text)', fontSize: 14, lineHeight: 2 }}>
            {game.howToPlay.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </Modal>
      )}

      {showPreview && (
        <Modal title="Preview Cards" onClose={() => setShowPreview(false)}>
          {previewCards.length === 0 ? (
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>
              No cards match your current audience/intensity settings yet — adjust them in Setup.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {previewCards.map((c) => (
                <div key={c.id} style={{ background: 'var(--bg3)', border: '1px solid var(--border2)', borderRadius: 10, padding: 12, fontSize: 13, color: 'var(--text)' }}>
                  {c.text}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

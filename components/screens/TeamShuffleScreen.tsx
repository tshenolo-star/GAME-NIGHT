'use client'
import React, { useState } from 'react'
import { Shuffle } from 'lucide-react'
import { ScreenHeader } from '../ui/Surface'
import { Button } from '../ui/Button'
import { Player, Team } from '@/lib/engine/types'
import { splitIntoTeams, numTeamsFromMode } from '@/lib/engine/teamEngine'
import { GameSettings } from '@/lib/engine/types'

export function TeamShuffleScreen({
  players, settings, teams, onBack, onChangeTeams, onStart,
}: {
  players: Player[]
  settings: GameSettings
  teams: Team[]
  onBack: () => void
  onChangeTeams: (teams: Team[]) => void
  onStart: () => void
}) {
  const [shuffling, setShuffling] = useState(false)

  const reshuffle = () => {
    setShuffling(true)
    const count = numTeamsFromMode(settings.teamMode)
    setTimeout(() => {
      onChangeTeams(splitIntoTeams(players, count))
      setShuffling(false)
    }, 450)
  }

  React.useEffect(() => {
    if (teams.length === 0) reshuffle()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playerName = (id: string) => players.find((p) => p.id === id)?.name ?? '?'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <ScreenHeader title="Team Shuffle" onBack={onBack} />
      <div style={{ padding: '24px clamp(16px, 5vw, 24px) 110px', maxWidth: 560, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid', gridTemplateColumns: teams.length > 2 ? '1fr 1fr' : '1fr', gap: 14,
            opacity: shuffling ? 0.3 : 1, transform: shuffling ? 'scale(0.97)' : 'scale(1)',
            transition: 'opacity 0.3s, transform 0.3s', marginBottom: 24,
          }}
        >
          {teams.map((t) => (
            <div key={t.id} style={{ background: 'var(--bg2)', border: `1px solid ${t.color}55`, borderRadius: 'var(--radius)', padding: 16 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 1.5, color: t.color, marginBottom: 10 }}>
                {t.name}
              </div>
              {t.playerIds.map((id) => (
                <div key={id} style={{ fontSize: 14, color: 'var(--text)', padding: '4px 0' }}>{playerName(id)}</div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Button variant="secondary" fullWidth onClick={reshuffle}>
            <Shuffle size={16} /> Shuffle Teams
          </Button>
          <Button fullWidth size="lg" onClick={onStart}>Start Playing</Button>
        </div>
      </div>
    </div>
  )
}

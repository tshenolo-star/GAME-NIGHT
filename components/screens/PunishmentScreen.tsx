'use client'
import React, { useState } from 'react'
import { Flame, Home, RotateCcw } from 'lucide-react'
import { Button } from '../ui/Button'
import { Surface } from '../ui/Surface'
import { punishmentCards } from '@/lib/content/cards/punishments'
import { filterCards, shuffle } from '@/lib/engine/cardEngine'
import { GameSettings, Team, Player } from '@/lib/engine/types'
import { getLosingTeams } from '@/lib/engine/scoringEngine'

function pickLoser(teams: Team[], players: Player[], playerScores: Record<string, number>): string {
  if (teams.length > 0) return getLosingTeams(teams).map((t) => t.name).join(' & ')
  if (players.length === 0) return 'The group'
  const scores = players.map((p) => playerScores[p.id] ?? 0)
  const lowest = Math.min(...scores)
  const lowestPlayers = players.filter((_, i) => scores[i] === lowest)
  if (lowestPlayers.length === players.length) return shuffle(players)[0].name
  return lowestPlayers.map((p) => p.name).join(' & ')
}

export function PunishmentScreen({
  settings, teams, players, playerScores, onRematch, onHome,
}: {
  settings: GameSettings
  teams: Team[]
  players: Player[]
  playerScores: Record<string, number>
  onRematch: () => void
  onHome: () => void
}) {
  const drawText = () => {
    const pool = filterCards(punishmentCards, {
      audience: settings.audience, maxIntensity: settings.intensity, adultUnlocked: settings.adultUnlocked,
    })
    return shuffle(pool)[0]?.text ?? 'Everyone give the loser a round of applause.'
  }

  const [loserLabel] = useState(() => pickLoser(teams, players, playerScores))
  const [card, setCard] = useState<string>(drawText)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Flame size={40} color="var(--orange)" style={{ marginBottom: 14 }} />
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>The punishment goes to</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--red)', marginBottom: 24 }}>{loserLabel}</div>

      <Surface style={{ padding: 28, maxWidth: 400, width: '100%', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 18, color: 'var(--text)', lineHeight: 1.5 }}>{card}</div>
      </Surface>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
        <Button variant="secondary" fullWidth onClick={() => setCard(drawText())}>Redraw</Button>
        <Button fullWidth onClick={onRematch}><RotateCcw size={16} /> Rematch</Button>
        <Button variant="ghost" fullWidth onClick={onHome}><Home size={16} /> Home</Button>
      </div>
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import { Flame, Home, RotateCcw, Shuffle, Timer } from 'lucide-react'
import { Button } from '../ui/Button'
import { Surface } from '../ui/Surface'
import { TimerDisplay } from '../ui/TimerDisplay'
import { punishmentCards } from '@/lib/content/cards/punishments'
import { shuffle } from '@/lib/engine/cardEngine'
import { choosePunishmentPool, extractSeconds } from '@/lib/engine/punishmentPool'
import { playCue } from '@/lib/engine/sound'
import { useTimer } from '@/lib/engine/useTimer'
import { GameSettings, Team, Player } from '@/lib/engine/types'
import { getLosingTeams } from '@/lib/engine/scoringEngine'

interface Loser {
  label: string
  detail: string | null
}

function pickLoser(teams: Team[], players: Player[], playerScores: Record<string, number>): Loser {
  if (teams.length > 0) {
    const losing = getLosingTeams(teams)
    const names = players.filter((p) => losing.some((t) => t.playerIds.includes(p.id))).map((p) => p.name)
    if (losing.length > 1) return { label: losing.map((t) => t.name).join(' & '), detail: 'Tied for last, so you share it.' }
    return { label: losing[0]?.name ?? 'The group', detail: names.length ? names.join(', ') : null }
  }
  if (players.length === 0) return { label: 'The group', detail: null }

  const scores = players.map((p) => playerScores[p.id] ?? 0)
  const lowest = Math.min(...scores)
  const lowestPlayers = players.filter((_, i) => scores[i] === lowest)
  if (lowestPlayers.length === players.length) {
    return { label: shuffle(players)[0].name, detail: 'Everyone was tied, so fate picked.' }
  }
  return { label: lowestPlayers.map((p) => p.name).join(' & '), detail: lowestPlayers.length > 1 ? 'Tied for last, so you share it.' : null }
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
  const [loser] = useState(() => pickLoser(teams, players, playerScores))
  const [queue] = useState(() => shuffle(choosePunishmentPool(punishmentCards, settings)))
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const card = queue[index % queue.length]
  const seconds = card ? extractSeconds(card.text) : null
  const timer = useTimer({
    durationSec: seconds ?? 30,
    onTimeUp: () => playCue('timeUp', settings.soundEnabled),
  })

  const nextCard = () => {
    const nextIndex = index + 1
    const nextCardData = queue[nextIndex % queue.length]
    setIndex(nextIndex)
    timer.reset(nextCardData ? extractSeconds(nextCardData.text) ?? 30 : 30)
  }

  const timerUntouched = !timer.isRunning && timer.secondsLeft === (seconds ?? 30)

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Flame size={40} color="var(--orange)" style={{ marginBottom: 14 }} />
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>The punishment goes to</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--red)', marginBottom: 6, textAlign: 'center' }}>{loser.label}</div>
      {loser.detail && (
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6, textAlign: 'center', maxWidth: 360 }}>{loser.detail}</div>
      )}
      <div style={{ height: 18 }} />

      {!revealed ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
          <Button size="lg" fullWidth variant="danger" onClick={() => setRevealed(true)}>Reveal the punishment</Button>
          <Button variant="ghost" fullWidth onClick={onHome}><Home size={16} /> Skip and go Home</Button>
        </div>
      ) : (
        <>
          <Surface style={{ padding: 28, maxWidth: 400, width: '100%', textAlign: 'center', marginBottom: 18 }}>
            <div style={{ fontSize: 19, color: 'var(--text)', lineHeight: 1.5 }}>{card?.text ?? 'Everyone give the loser a round of applause.'}</div>
          </Surface>

          {seconds !== null && (
            <div style={{ marginBottom: 18, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              {timerUntouched ? (
                <Button variant="secondary" onClick={timer.start}><Timer size={16} /> Start {seconds}s timer</Button>
              ) : (
                <>
                  <TimerDisplay timer={timer} accent="var(--orange)" />
                  {timer.secondsLeft === 0 && <div style={{ fontSize: 14, color: 'var(--gold)', fontWeight: 600 }}>Time&apos;s up! Punishment complete.</div>}
                </>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
            <Button variant="secondary" fullWidth onClick={nextCard}><Shuffle size={16} /> Another one</Button>
            <Button fullWidth onClick={onRematch}><RotateCcw size={16} /> Rematch</Button>
            <Button variant="ghost" fullWidth onClick={onHome}><Home size={16} /> Home</Button>
          </div>
        </>
      )}
    </div>
  )
}
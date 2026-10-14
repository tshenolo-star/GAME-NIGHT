'use client'
import React from 'react'
import { Trophy, RotateCcw, Home } from 'lucide-react'
import { Button } from '../ui/Button'
import { Surface } from '../ui/Surface'
import { GameManifest, Player, Team } from '@/lib/engine/types'
import { leaderboard, getWinningTeams } from '@/lib/engine/scoringEngine'

export function EndGameScreen({
  teams, players, playerScores, usePunishments, onPunishment, onRematch, onHome,
}: {
  game: GameManifest
  teams: Team[]
  players: Player[]
  playerScores: Record<string, number>
  usePunishments: boolean
  onPunishment: () => void
  onRematch: () => void
  onHome: () => void
}) {
  const hasTeams = teams.length > 0
  const ranked = hasTeams ? leaderboard(teams) : null
  const winners = hasTeams ? getWinningTeams(teams) : []
  const anyScored = Object.keys(playerScores).length > 0
  const playerRanked = players
    .map((p) => ({ player: p, score: playerScores[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)
  const topPlayers = playerRanked.filter((r) => r.score === playerRanked[0]?.score)

  const headline = hasTeams
    ? winners.length > 1 ? "It's a tie!" : `${winners[0]?.name} wins!`
    : !anyScored ? 'Nice game!'
    : topPlayers.length > 1 ? "It's a tie!"
    : `${topPlayers[0].player.name} wins!`

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Trophy size={48} color="var(--gold)" style={{ marginBottom: 14 }} />
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, letterSpacing: 3, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 6 }}>
        Game Over
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, letterSpacing: 2, color: 'var(--gold)', marginBottom: 28, textAlign: 'center' }}>
        {headline}
      </div>

      <Surface style={{ padding: 20, width: '100%', maxWidth: 400, marginBottom: 28 }}>
        {hasTeams
          ? ranked!.map((t, i) => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < ranked!.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: t.color, fontWeight: 600, fontSize: 14 }}>{i + 1}. {t.name}</span>
                <span style={{ color: 'var(--text)', fontSize: 14 }}>{t.score} pts</span>
              </div>
            ))
          : !anyScored
          ? <div style={{ color: 'var(--text2)', fontSize: 13, textAlign: 'center' }}>No points recorded — thanks for playing!</div>
          : playerRanked.map(({ player, score }, i) => (
              <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: i < playerRanked.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--text)', fontSize: 14 }}>{i + 1}. {player.name}</span>
                <span style={{ color: 'var(--gold)', fontSize: 14 }}>{score} pts</span>
              </div>
            ))}
      </Surface>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 400 }}>
        {usePunishments && <Button variant="danger" fullWidth onClick={onPunishment}>Loser Punishment</Button>}
        <Button fullWidth onClick={onRematch}><RotateCcw size={16} /> Rematch</Button>
        <Button variant="ghost" fullWidth onClick={onHome}><Home size={16} /> Home</Button>
      </div>
    </div>
  )
}

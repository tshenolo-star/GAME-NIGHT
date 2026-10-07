'use client'
import React, { useState } from 'react'
import { Check, X, Flame, HelpCircle } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { Badge } from '../../ui/Badge'
import { CARD_PACKS } from '@/lib/content/cards'
import { Card } from '@/lib/engine/types'
import { useGameRound } from './useGameRound'
import { playCue } from '@/lib/engine/sound'
import { EndGameButton } from './EndGameButton'
import { NoCardsNotice } from './NoCardsNotice'
import { GameplayProps } from './types'

const TYPE_LABELS: Record<string, string> = {
  dare: 'Dare',
  callout: 'Callout',
  challenge: 'Challenge',
  truth: 'Truth',
}

export function TruthOrDareGameplay({ settings, players, teams, onScoreTeam, onScorePlayer, onFinish, onBack }: GameplayProps) {
  const { currentPlayer, turn, nextTurn, deck, award } = useGameRound(players, teams, CARD_PACKS.truthOrDare, settings, { onScoreTeam, onScorePlayer })
  const [card, setCard] = useState<Card | null>(null)
  const [round, setRound] = useState(0)
  const MAX_ROUNDS = players.length * 3

  if (deck.totalSize === 0) return <NoCardsNotice onBack={onBack} />

  const draw = (want: 'truth' | 'dare' | 'random') => {
    setCard(want === 'random' ? deck.draw() : deck.drawWhere((c) => c.type === want || c.type === 'callout'))
  }

  const advance = (completed: boolean) => {
    if (completed) playCue('correct', settings.soundEnabled)
    award(completed ? 'correct' : 'penalty')
    setCard(null)
    if (round + 1 >= MAX_ROUNDS) { onFinish(); return }
    setRound((r) => r + 1)
    nextTurn()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '16px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Round {turn.round} · {round + 1} / {MAX_ROUNDS}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)', letterSpacing: 1.5, marginTop: 4 }}>
          {currentPlayer?.name ?? 'Player'}&apos;s Turn
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        {!card ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 340 }}>
            <Button size="lg" fullWidth onClick={() => draw('truth')}><HelpCircle size={18} /> Truth</Button>
            <Button size="lg" fullWidth variant="danger" onClick={() => draw('dare')}><Flame size={18} /> Dare</Button>
            <Button size="lg" fullWidth variant="secondary" onClick={() => draw('random')}>Random</Button>
          </div>
        ) : (
          <Surface style={{ padding: 28, maxWidth: 420, width: '100%', textAlign: 'center' }}>
            <div style={{ marginBottom: 10 }}>
              <Badge>{TYPE_LABELS[card.type] ?? 'Truth'}</Badge>
            </div>
            <div style={{ fontSize: 19, color: 'var(--text)', lineHeight: 1.5, marginBottom: 24 }}>{card.text}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" fullWidth onClick={() => advance(true)}><Check size={16} /> Done (+1)</Button>
              <Button variant="ghost" fullWidth onClick={() => advance(false)}><X size={16} /> Refused (−1)</Button>
            </div>
          </Surface>
        )}
      </div>
    </div>
  )
}

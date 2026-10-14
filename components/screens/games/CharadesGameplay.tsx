'use client'
import React, { useState } from 'react'
import { EyeOff, Eye, Check, SkipForward } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { CARD_PACKS } from '@/lib/content/cards'
import { useGameRound } from './useGameRound'
import { playCue } from '@/lib/engine/sound'
import { EndGameButton } from './EndGameButton'
import { GameplayProps } from './types'

const TURN_SECONDS = 60

export function CharadesGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, currentTeam, nextTurn, deck, award } = useGameRound(players, teams, CARD_PACKS.wordBank, settings, { onScoreTeam, onScorePlayer })
  const [phase, setPhase] = useState<'privacy' | 'reveal' | 'playing' | 'turnEnd'>('privacy')
  const [word, setWord] = useState<string | null>(null)
  const [correctCount, setCorrectCount] = useState(0)
  const MAX_TURNS = Math.max(players.length, teams.length * 2)
  const [turnsPlayed, setTurnsPlayed] = useState(0)

  const timer = useTimer({
    durationSec: TURN_SECONDS,
    onTimeUp: () => { playCue('timeUp', settings.soundEnabled); setPhase('turnEnd') },
  })

  const reveal = () => {
    const card = deck.draw()
    setWord(card?.text ?? '—')
    setPhase('reveal')
  }

  const startActing = () => {
    setCorrectCount(0)
    setPhase('playing')
    timer.start()
  }

  const markCorrect = () => {
    playCue('correct', settings.soundEnabled)
    setCorrectCount((c) => c + 1)
    const card = deck.draw()
    setWord(card?.text ?? '—')
  }

  const skip = () => {
    const card = deck.draw()
    setWord(card?.text ?? '—')
  }

  const endTurn = () => {
    award('correct', correctCount)
    const nextCount = turnsPlayed + 1
    setTurnsPlayed(nextCount)
    timer.reset()
    if (nextCount >= MAX_TURNS) { onFinish(); return }
    nextTurn()
    setPhase('privacy')
    setWord(null)
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2 }}>
          {currentTeam ? currentTeam.name : 'Turn'} · Turn {turnsPlayed + 1} / {MAX_TURNS}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        {phase === 'privacy' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <EyeOff size={36} color="var(--text2)" style={{ marginBottom: 14 }} />
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 6 }}>Pass the device to</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 24 }}>
              {currentPlayer?.name ?? 'the next player'}
            </div>
            <Button fullWidth onClick={reveal}><Eye size={16} /> I&apos;m {currentPlayer?.name ?? 'ready'}, reveal my word</Button>
          </Surface>
        )}

        {phase === 'reveal' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Your word</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text)', marginBottom: 24 }}>{word}</div>
            <Button fullWidth size="lg" onClick={startActing}>Start Acting — {TURN_SECONDS}s</Button>
          </Surface>
        )}

        {phase === 'playing' && (
          <>
            <TimerDisplay timer={timer} accent={game.accent} />
            <Surface style={{ padding: 28, textAlign: 'center', maxWidth: 380, width: '100%' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--text)', marginBottom: 6 }}>{word}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Correct: {correctCount}</div>
            </Surface>
            <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 380 }}>
              <Button variant="secondary" fullWidth onClick={skip}><SkipForward size={16} /> Skip</Button>
              <Button fullWidth onClick={markCorrect}><Check size={16} /> Got It</Button>
            </div>
          </>
        )}

        {phase === 'turnEnd' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>Time&apos;s up!</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', marginBottom: 24 }}>
              +{correctCount} points
            </div>
            <Button fullWidth size="lg" onClick={endTurn}>Next Turn</Button>
          </Surface>
        )}
      </div>
    </div>
  )
}

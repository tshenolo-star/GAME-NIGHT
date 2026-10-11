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

const WORDS_PER_TURN = 5
const TURN_SECONDS = 30

export function ThirtySecondsGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, currentTeam, nextTurn, deck, award } = useGameRound(players, teams, CARD_PACKS.wordBank, settings, { onScoreTeam, onScorePlayer })
  const [phase, setPhase] = useState<'privacy' | 'playing' | 'turnEnd'>('privacy')
  const [words, setWords] = useState<string[]>([])
  const [wordIndex, setWordIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const MAX_TURNS = Math.max(teams.length * 3, players.length)
  const [turnsPlayed, setTurnsPlayed] = useState(0)

  const timer = useTimer({ durationSec: TURN_SECONDS, onTimeUp: () => { playCue('timeUp', settings.soundEnabled); setPhase('turnEnd') } })

  const startTurn = () => {
    const drawn: string[] = []
    for (let i = 0; i < WORDS_PER_TURN; i++) {
      const c = deck.draw()
      if (c) drawn.push(c.text)
    }
    setWords(drawn)
    setWordIndex(0)
    setCorrectCount(0)
    setPhase('playing')
    timer.start()
  }

  const mark = (correct: boolean) => {
    if (correct) { playCue('correct', settings.soundEnabled); setCorrectCount((c) => c + 1) }
    if (wordIndex + 1 >= words.length) { timer.pause(); setPhase('turnEnd'); return }
    setWordIndex((i) => i + 1)
  }

  const endTurn = () => {
    award('correct', correctCount)
    const next = turnsPlayed + 1
    setTurnsPlayed(next)
    timer.reset()
    if (next >= MAX_TURNS) { onFinish(); return }
    nextTurn()
    setPhase('privacy')
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
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 6 }}>Describing this turn:</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 24 }}>
              {currentPlayer?.name ?? 'Next player'}
            </div>
            <Button fullWidth onClick={startTurn}><Eye size={16} /> Reveal 5 Words — {TURN_SECONDS}s</Button>
          </Surface>
        )}

        {phase === 'playing' && (
          <>
            <TimerDisplay timer={timer} accent={game.accent} />
            <Surface style={{ padding: 28, textAlign: 'center', maxWidth: 380, width: '100%' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>
                Word {wordIndex + 1} of {words.length}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text)', marginBottom: 6 }}>{words[wordIndex]}</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Correct so far: {correctCount}</div>
            </Surface>
            <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 380 }}>
              <Button variant="secondary" fullWidth onClick={() => mark(false)}><SkipForward size={16} /> Skip</Button>
              <Button fullWidth onClick={() => mark(true)}><Check size={16} /> Got It</Button>
            </div>
          </>
        )}

        {phase === 'turnEnd' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>Turn over!</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', marginBottom: 24 }}>
              {currentTeam?.name ?? currentPlayer?.name ?? ''} +{correctCount}
            </div>
            <Button fullWidth size="lg" onClick={endTurn}>Next Turn</Button>
          </Surface>
        )}
      </div>
    </div>
  )
}

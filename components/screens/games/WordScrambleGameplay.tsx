'use client'
import React, { useEffect, useState } from 'react'
import { Check, SkipForward } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { playCue } from '@/lib/engine/sound'
import { shuffle } from '@/lib/engine/cardEngine'
import { scrambleWord } from '@/lib/engine/scramble'
import { SCRAMBLE_WORDS, ScrambleWord } from '@/lib/content/scrambleWords'
import { useGameRound } from './useGameRound'
import { EndGameButton } from './EndGameButton'
import { GameplayProps } from './types'

const TURN_SECONDS = 25

interface Puzzle {
  entry: ScrambleWord
  letters: string[]
}

function buildPuzzle(entry: ScrambleWord): Puzzle {
  return { entry, letters: scrambleWord(entry.word) }
}

export function WordScrambleGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, nextTurn, award } = useGameRound(players, teams, [], settings, { onScoreTeam, onScorePlayer })
  const [queue] = useState(() => shuffle(SCRAMBLE_WORDS))
  const [cursor, setCursor] = useState(0)
  const [puzzle, setPuzzle] = useState<Puzzle>(() => buildPuzzle(queue[0]))
  const [revealed, setRevealed] = useState(false)
  const [turnsPlayed, setTurnsPlayed] = useState(0)
  const MAX_TURNS = Math.max(players.length * 2, 8)

  const timer = useTimer({ durationSec: TURN_SECONDS, onTimeUp: () => { playCue('timeUp', settings.soundEnabled); setRevealed(true) } })
  const startTimer = timer.start

  useEffect(() => { startTimer() }, [startTimer])

  const mark = (correct: boolean) => {
    if (correct) { playCue('correct', settings.soundEnabled); award('correct', 1) }
    const next = turnsPlayed + 1
    setTurnsPlayed(next)
    if (next >= MAX_TURNS) { onFinish(); return }
    nextTurn()
    const nextCursor = cursor + 1
    setCursor(nextCursor)
    setPuzzle(buildPuzzle(queue[nextCursor % queue.length]))
    setRevealed(false)
    timer.start()
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2 }}>
          {currentPlayer?.name ?? 'Player'} · Round {turnsPlayed + 1} / {MAX_TURNS}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 20 }}>
        <TimerDisplay timer={timer} accent={game.accent} />
        <Surface style={{ padding: 24, textAlign: 'center', maxWidth: 400, width: '100%' }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 14 }}>
            {puzzle.entry.category} · {puzzle.letters.length} letters
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
            {puzzle.letters.map((letter, i) => (
              <span
                key={i}
                style={{
                  width: 34, height: 42, borderRadius: 8, background: 'var(--bg3)', border: '1px solid var(--border2)',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--text)',
                }}
              >
                {letter}
              </span>
            ))}
          </div>
          {revealed && (
            <div style={{ fontSize: 18, color: 'var(--gold)', marginTop: 18, fontFamily: 'var(--font-display)', letterSpacing: 2, textTransform: 'uppercase' }}>
              Answer: {puzzle.entry.word}
            </div>
          )}
        </Surface>
        {!revealed ? (
          <Button variant="secondary" onClick={() => setRevealed(true)}>Reveal Answer</Button>
        ) : (
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 400 }}>
            <Button variant="secondary" fullWidth onClick={() => mark(false)}><SkipForward size={16} /> Missed</Button>
            <Button fullWidth onClick={() => mark(true)}><Check size={16} /> Got It</Button>
          </div>
        )}
      </div>
    </div>
  )
}
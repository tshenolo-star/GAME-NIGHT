'use client'
import React, { useEffect, useState } from 'react'
import { Check, SkipForward } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { Deck } from '@/lib/engine/cardEngine'
import { CARD_PACKS } from '@/lib/content/cards'
import { useGameRound } from './useGameRound'
import { playCue } from '@/lib/engine/sound'
import { EndGameButton } from './EndGameButton'
import { GameplayProps } from './types'

const TURN_SECONDS = 20

function scramble(word: string): string {
  const letters = word.replace(/\s/g, '').split('')
  let attempt = letters.join('')
  let tries = 0
  while (attempt.toLowerCase() === letters.join('').toLowerCase() && tries < 10) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[letters[i], letters[j]] = [letters[j], letters[i]]
    }
    attempt = letters.join('')
    tries++
  }
  return attempt.toUpperCase().split('').join(' ')
}

function pickWord(deck: Deck): { word: string; scrambled: string } {
  let c = deck.draw()
  let tries = 0
  while (c && c.text.replace(/\s/g, '').length < 4 && tries < 5) { c = deck.draw(); tries++ }
  const word = c?.text ?? 'PARTY'
  return { word, scrambled: scramble(word) }
}

export function WordScrambleGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, nextTurn, deck, award } = useGameRound(players, teams, CARD_PACKS.wordBank, settings, { onScoreTeam, onScorePlayer })
  const [current, setCurrent] = useState(() => pickWord(deck))
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
    setCurrent(pickWord(deck))
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
        <Surface style={{ padding: 28, textAlign: 'center', maxWidth: 380, width: '100%' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, letterSpacing: 4, color: 'var(--text)', marginBottom: revealed ? 10 : 0, wordBreak: 'break-word' }}>
            {current.scrambled}
          </div>
          {revealed && <div style={{ fontSize: 14, color: 'var(--gold)', marginTop: 8 }}>Answer: {current.word}</div>}
        </Surface>
        {!revealed ? (
          <Button variant="secondary" onClick={() => setRevealed(true)}>Reveal Answer</Button>
        ) : (
          <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 380 }}>
            <Button variant="secondary" fullWidth onClick={() => mark(false)}><SkipForward size={16} /> Missed</Button>
            <Button fullWidth onClick={() => mark(true)}><Check size={16} /> Got It</Button>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import React, { useState } from 'react'
import { Bomb, ShieldCheck, Skull } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { playCue } from '@/lib/engine/sound'
import { useGameRound } from './useGameRound'
import { EndGameButton } from './EndGameButton'
import { BombBoard, TileState } from './numberBomb/BombBoard'
import { HandoffCard } from './numberBomb/HandoffCard'
import { pickBomber } from './numberBomb/pickBomber'
import { GameplayProps } from './types'

const TILES = 30
const TARGET_STEPS = 28
const TURN_SECONDS = 120
const WIN_POINTS = 40

type Phase = 'handoffBomber' | 'pickBomb' | 'handoffStepper' | 'playing' | 'result'
type Outcome = 'survived' | 'boom' | 'timeout'

export function NumberBombGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, currentTeam, nextTurn } = useGameRound(players, teams, [], settings)
  const [duel, setDuel] = useState(0)
  const [phase, setPhase] = useState<Phase>('handoffBomber')
  const [picked, setPicked] = useState<number | null>(null)
  const [bombTile, setBombTile] = useState<number | null>(null)
  const [revealed, setRevealed] = useState<Record<number, TileState>>({})
  const [outcome, setOutcome] = useState<Outcome | null>(null)
  const MAX_DUELS = players.length

  const bomber = pickBomber(currentPlayer?.id ?? null, players, teams, duel)
  const safeSteps = Object.values(revealed).filter((s) => s === 'safe').length

  const awardTo = (playerId: string) => {
    onScorePlayer(playerId, 'correct', WIN_POINTS)
    const team = teams.find((t) => t.playerIds.includes(playerId))
    if (team) onScoreTeam(team.id, 'correct', WIN_POINTS)
  }

  const finishDuel = (result: Outcome) => {
    timer.reset()
    setOutcome(result)
    setPhase('result')
    const winner = result === 'survived' ? currentPlayer : bomber
    if (winner) awardTo(winner.id)
    playCue(result === 'survived' ? 'correct' : 'timeUp', settings.soundEnabled)
  }

  const timer = useTimer({ durationSec: TURN_SECONDS, onTimeUp: () => finishDuel('timeout') })

  const armBomb = () => {
    setBombTile(picked)
    setPhase('handoffStepper')
  }

  const beginStepping = () => {
    setRevealed({})
    setPhase('playing')
    timer.start()
  }

  const step = (tile: number) => {
    if (tile === bombTile) {
      setRevealed((r) => ({ ...r, [tile]: 'boom' }))
      finishDuel('boom')
      return
    }
    setRevealed((r) => ({ ...r, [tile]: 'safe' }))
    if (safeSteps + 1 >= TARGET_STEPS) finishDuel('survived')
  }

  const nextDuel = () => {
    if (duel + 1 >= MAX_DUELS) { onFinish(); return }
    setDuel((d) => d + 1)
    nextTurn()
    setPicked(null)
    setBombTile(null)
    setRevealed({})
    setOutcome(null)
    setPhase('handoffBomber')
  }

  const winnerName = outcome === 'survived' ? currentPlayer?.name : bomber?.name

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2 }}>
          {currentTeam ? `${currentTeam.name} · ` : ''}Duel {duel + 1} / {MAX_DUELS}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 }}>
        {phase === 'handoffBomber' && (
          <HandoffCard
            lead="Bomber, take the device"
            name={bomber?.name ?? 'Player B'}
            note={`${currentPlayer?.name ?? 'The Stepper'} must look away while you arm the bomb.`}
            action="I'm ready to arm the bomb"
            onContinue={() => setPhase('pickBomb')}
          />
        )}

        {phase === 'pickBomb' && (
          <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ textAlign: 'center' }}>
              <Bomb size={30} color="var(--red)" />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)', marginTop: 6 }}>Pick the secret bomb tile</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 4 }}>Tap a number, then arm it.</div>
            </div>
            <BombBoard tiles={TILES} revealed={{}} selected={picked} onTap={setPicked} />
            <Button fullWidth size="lg" disabled={picked === null} onClick={armBomb}>
              {picked === null ? 'Choose a tile' : `Arm tile ${picked}`}
            </Button>
          </div>
        )}

        {phase === 'handoffStepper' && (
          <HandoffCard
            lead="Bomb armed. Pass the device to"
            name={currentPlayer?.name ?? 'Player A'}
            note={`Take ${TARGET_STEPS} safe steps in ${TURN_SECONDS} seconds without hitting the bomb.`}
            action={`Start stepping — ${TURN_SECONDS}s`}
            onContinue={beginStepping}
          />
        )}

        {phase === 'playing' && (
          <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <TimerDisplay timer={timer} accent={game.accent} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <div style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'rgba(232, 41, 74, 0.12)', border: '1px solid var(--red)', color: 'var(--text)' }}>
                {bomber?.name ?? 'Player B'} Bomb: Armed (Secret)
              </div>
              <div style={{ padding: '8px 12px', borderRadius: 10, fontSize: 12, fontWeight: 600, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}>
                Safe Steps: {safeSteps} / {TARGET_STEPS}
              </div>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text2)' }}>{currentPlayer?.name ?? 'Player A'} is stepping</div>
            <BombBoard tiles={TILES} revealed={revealed} onTap={step} />
          </div>
        )}

        {phase === 'result' && (
          <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
            <Surface style={{ padding: 28, textAlign: 'center', width: '100%' }}>
              {outcome === 'survived' ? <ShieldCheck size={40} color="#34d399" /> : <Skull size={40} color="var(--red)" />}
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: outcome === 'survived' ? '#34d399' : 'var(--red)', margin: '10px 0 6px' }}>
                {outcome === 'survived' ? 'Survived!' : outcome === 'boom' ? 'BOOM!' : "Time's up!"}
              </div>
              <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 14, lineHeight: 1.5 }}>
                {outcome === 'survived' && `${currentPlayer?.name} took all ${TARGET_STEPS} safe steps.`}
                {outcome === 'boom' && `${currentPlayer?.name} hit the bomb on tile ${bombTile} after ${safeSteps} safe steps.`}
                {outcome === 'timeout' && `${currentPlayer?.name} only managed ${safeSteps} safe steps. The bomb was on tile ${bombTile}.`}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: 'var(--gold)' }}>
                {winnerName} +{WIN_POINTS}
              </div>
            </Surface>
            <BombBoard tiles={TILES} revealed={revealed} bombTile={bombTile} disabled onTap={() => undefined} />
            <Button fullWidth size="lg" onClick={nextDuel}>{duel + 1 >= MAX_DUELS ? 'Finish Game' : 'Next Duel'}</Button>
          </div>
        )}
      </div>
    </div>
  )
}

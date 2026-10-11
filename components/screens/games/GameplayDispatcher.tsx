'use client'
import React from 'react'
import { GameplayComponentKey } from '@/lib/engine/types'
import { GameplayProps } from './types'
import { TruthOrDareGameplay } from './TruthOrDareGameplay'
import { NeverHaveIEverGameplay } from './NeverHaveIEverGameplay'
import { MostLikelyToGameplay } from './MostLikelyToGameplay'
import { CharadesGameplay } from './CharadesGameplay'
import { ThirtySecondsGameplay } from './ThirtySecondsGameplay'
import { SketchAndGuessGameplay } from './SketchAndGuessGameplay'
import { WordScrambleGameplay } from './WordScrambleGameplay'
import { NumberBombGameplay } from './NumberBombGameplay'
import { TrackAttackGameplay } from './TrackAttackGameplay'

// The one place that maps a manifest's `component` key to its actual
// gameplay screen. Adding a new game with an existing component type needs
// no change here at all.
const REGISTRY: Record<GameplayComponentKey, React.ComponentType<GameplayProps>> = {
  truthOrDare: TruthOrDareGameplay,
  neverHaveIEver: NeverHaveIEverGameplay,
  mostLikelyTo: MostLikelyToGameplay,
  charades: CharadesGameplay,
  thirtySeconds: ThirtySecondsGameplay,
  sketchAndGuess: SketchAndGuessGameplay,
  wordScramble: WordScrambleGameplay,
  numberBomb: NumberBombGameplay,
  trackAttack: TrackAttackGameplay,
}

export function GameplayDispatcher(props: GameplayProps) {
  const Cmp = REGISTRY[props.game.component]
  if (!Cmp) return <div style={{ padding: 40, color: 'var(--text2)' }}>This game isn&apos;t wired up yet.</div>
  return <Cmp {...props} />
}

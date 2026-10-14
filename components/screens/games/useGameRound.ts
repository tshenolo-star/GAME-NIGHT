'use client'
import { useCallback, useMemo, useState } from 'react'
import { Player, Team, GameSettings, Card } from '@/lib/engine/types'
import { TurnState, initialTurnState, advanceTurn, getCurrentTeam } from '@/lib/engine/turnEngine'
import { createDeck } from '@/lib/engine/cardEngine'
import { ScoreEvent } from '@/lib/engine/scoringEngine'

interface Scoring {
  onScoreTeam: (teamId: string, event: ScoreEvent, amount?: number) => void
  onScorePlayer: (playerId: string, event: ScoreEvent, amount?: number) => void
}

export function useGameRound(
  players: Player[],
  teams: Team[],
  cardPack: Card[],
  settings: GameSettings,
  scoring?: Scoring
) {
  const [turn, setTurn] = useState<TurnState>(() => advanceTurn(initialTurnState(), players, teams))
  const [deck] = useState(() =>
    createDeck(cardPack, {
      audience: settings.audience,
      maxIntensity: settings.intensity,
      adultUnlocked: settings.adultUnlocked,
    })
  )

  const currentPlayer = useMemo(
    () => players.find((p) => p.id === turn.currentPlayerId) ?? null,
    [players, turn.currentPlayerId]
  )
  const currentTeam = getCurrentTeam(turn, teams)

  const nextTurn = useCallback(() => setTurn((t) => advanceTurn(t, players, teams)), [players, teams])
  const drawCard = () => deck.draw()

  const award = (event: ScoreEvent, amount?: number) => {
    if (currentTeam) scoring?.onScoreTeam(currentTeam.id, event, amount)
    if (currentPlayer) scoring?.onScorePlayer(currentPlayer.id, event, amount)
  }

  return { turn, currentPlayer, currentTeam, nextTurn, drawCard, deck, award }
}

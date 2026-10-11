import { Player, Team } from './types'
import { nextFairPick } from './teamEngine'

export interface TurnState {
  round: number
  teamIndex: number
  currentPlayerId: string | null
  alreadyGoneIds: string[]
  lastByTeam: Record<string, string>
}

export function initialTurnState(): TurnState {
  return { round: 1, teamIndex: -1, currentPlayerId: null, alreadyGoneIds: [], lastByTeam: {} }
}

export function advanceTurn(
  state: TurnState,
  players: Player[],
  teams: Team[]
): TurnState {
  if (teams.length === 0) {
    const { nextId, roundReset } = nextFairPick(
      players.map((p) => p.id),
      state.alreadyGoneIds,
      state.currentPlayerId
    )
    return {
      ...state,
      round: roundReset ? state.round + 1 : state.round,
      teamIndex: -1,
      currentPlayerId: nextId,
      alreadyGoneIds: roundReset ? [nextId] : [...state.alreadyGoneIds, nextId],
    }
  }

  const nextTeamIndex = (state.teamIndex + 1) % teams.length
  const wrapped = state.teamIndex >= 0 && nextTeamIndex <= state.teamIndex
  const team = teams[nextTeamIndex]
  const { nextId, roundReset } = nextFairPick(team.playerIds, state.alreadyGoneIds, state.lastByTeam[team.id])
  const teamIds = new Set(team.playerIds)
  const carried = roundReset ? state.alreadyGoneIds.filter((id) => !teamIds.has(id)) : state.alreadyGoneIds

  return {
    round: wrapped ? state.round + 1 : state.round,
    teamIndex: nextTeamIndex,
    currentPlayerId: nextId,
    alreadyGoneIds: [...carried, nextId],
    lastByTeam: { ...state.lastByTeam, [team.id]: nextId },
  }
}

export function getCurrentTeam(state: TurnState, teams: Team[]): Team | null {
  if (state.teamIndex < 0 || state.teamIndex >= teams.length) return null
  return teams[state.teamIndex]
}

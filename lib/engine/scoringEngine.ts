// ============================================================================
// SCORING ENGINE — pure functions over Team/Player score maps. Every game
// routes points through these instead of mutating scores inline.
// ============================================================================
import { Team } from './types'

export type ScoreEvent = 'correct' | 'wrong' | 'skip' | 'bonus' | 'penalty'

export const DEFAULT_POINTS: Record<ScoreEvent, number> = {
  correct: 1,
  wrong: 0,
  skip: 0,
  bonus: 1,
  penalty: -1,
}

export function applyScoreEvent(
  teams: Team[],
  teamId: string,
  event: ScoreEvent,
  amount?: number
): Team[] {
  const delta = amount ?? DEFAULT_POINTS[event]
  return teams.map((t) => (t.id === teamId ? { ...t, score: t.score + delta } : t))
}

export function applyPlayerScoreEvent(
  scores: Record<string, number>,
  playerId: string,
  event: ScoreEvent,
  amount?: number
): Record<string, number> {
  const delta = amount ?? DEFAULT_POINTS[event]
  return { ...scores, [playerId]: (scores[playerId] ?? 0) + delta }
}

export function leaderboard(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => b.score - a.score)
}

export function playerLeaderboard(
  scores: Record<string, number>
): Array<{ playerId: string; score: number }> {
  return Object.entries(scores)
    .map(([playerId, score]) => ({ playerId, score }))
    .sort((a, b) => b.score - a.score)
}

export function getWinningTeams(teams: Team[]): Team[] {
  if (teams.length === 0) return []
  const top = Math.max(...teams.map((t) => t.score))
  return teams.filter((t) => t.score === top)
}

export function getLosingTeams(teams: Team[]): Team[] {
  if (teams.length === 0) return []
  const bottom = Math.min(...teams.map((t) => t.score))
  return teams.filter((t) => t.score === bottom)
}

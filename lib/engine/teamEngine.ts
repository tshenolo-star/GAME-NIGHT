import { Player, Team, TeamMode } from './types'
import { shuffle } from './cardEngine'

const TEAM_COLORS = ['#60a5fa', '#f472b6', '#34d399', '#F5A623', '#c084fc', '#f5824a']
const TEAM_NAMES = ['Team 1', 'Team 2', 'Team 3', 'Team 4', 'Team 5', 'Team 6']

export function numTeamsFromMode(mode: TeamMode, customCount?: number): number {
  if (mode === 'ffa') return 0
  if (mode === 'custom') return customCount ?? 2
  return mode
}

export function splitIntoTeams(players: Player[], count: number): Team[] {
  if (count <= 0) return []
  const shuffled = shuffle(players)
  const teams: Team[] = Array.from({ length: count }, (_, i) => ({
    id: `team-${i + 1}`,
    name: TEAM_NAMES[i] ?? `Team ${i + 1}`,
    color: TEAM_COLORS[i % TEAM_COLORS.length],
    playerIds: [],
    score: 0,
  }))
  shuffled.forEach((player, i) => {
    teams[i % count].playerIds.push(player.id)
  })
  return teams
}

export function shuffleTurnOrder(players: Player[]): string[] {
  return shuffle(players).map((p) => p.id)
}

export function nextFairPick(
  candidateIds: string[],
  alreadyGoneIds: string[],
  avoidId?: string | null
): { nextId: string; roundReset: boolean } {
  const remaining = candidateIds.filter((id) => !alreadyGoneIds.includes(id))
  if (remaining.length > 0) {
    return { nextId: shuffle(remaining)[0], roundReset: false }
  }
  const fresh = candidateIds.length > 1 ? candidateIds.filter((id) => id !== avoidId) : candidateIds
  return { nextId: shuffle(fresh)[0], roundReset: true }
}

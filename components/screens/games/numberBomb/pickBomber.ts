import { Player, Team } from '@/lib/engine/types'

export function pickBomber(stepperId: string | null, players: Player[], teams: Team[], duel: number): Player | null {
  if (!stepperId || players.length === 0) return null

  if (teams.length > 0) {
    const teamIndex = Math.max(0, teams.findIndex((t) => t.playerIds.includes(stepperId)))
    const rivals = teams[(teamIndex + 1) % teams.length].playerIds
    if (rivals.length > 0) {
      const rivalId = rivals[duel % rivals.length]
      return players.find((p) => p.id === rivalId) ?? null
    }
  }

  const stepperIndex = players.findIndex((p) => p.id === stepperId)
  return players[(stepperIndex + 1) % players.length]
}

import { GameManifest, GameSettings, Player, Team } from '@/lib/engine/types'
import { ScoreEvent } from '@/lib/engine/scoringEngine'

export interface GameplayProps {
  game: GameManifest
  settings: GameSettings
  players: Player[]
  teams: Team[]
  onScoreTeam: (teamId: string, event: ScoreEvent, amount?: number) => void
  onScorePlayer: (playerId: string, event: ScoreEvent, amount?: number) => void
  onFinish: () => void
  onBack: () => void
}

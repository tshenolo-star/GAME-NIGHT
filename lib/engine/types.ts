// ============================================================================
// CORE DOMAIN TYPES — shared by every game, every screen, every engine.
// Games are data (manifests + card packs) that run through these shared
// engines, not bespoke code per game. See /lib/content for how a new game
// is added without touching engine code.
// ============================================================================

export type Audience =
  | 'family'
  | 'friends'
  | 'couples'
  | 'coworkers'
  | 'adults'

export type Intensity =
  | 'mild'
  | 'suggestive'
  | 'flirty'
  | 'bold'
  | 'adult'
  | 'explicit'

// Ordering used to compare a user's chosen intensity ceiling against a card.
export const INTENSITY_ORDER: Intensity[] = [
  'mild', 'suggestive', 'flirty', 'bold', 'adult', 'explicit',
]

export type AgeRating = 'all' | '13+' | '16+' | '18+'

export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Card {
  id: string
  type: string // 'truth' | 'dare' | 'nhie' | 'mlt' | 'word' | 'wyr' | 'punishment' | 'challenge' | ...
  category?: string
  subcategory?: string
  text: string
  answer?: string
  acceptableAnswers?: string[]
  difficulty?: Difficulty
  ageRating: AgeRating
  audience: Audience[]
  region?: string
  intensity?: Intensity
  points?: number
  penalty?: number
  timerSec?: number
  tags?: string[]
  requiresTeam?: boolean
  requiresPlayer?: boolean
  requiresMultiplePlayers?: boolean
  adultOnly?: boolean
}

export interface Player {
  id: string
  name: string
  avatar?: string
  color?: string
}

export interface Team {
  id: string
  name: string
  color: string
  playerIds: string[]
  score: number
}

export type TeamMode = 'ffa' | 2 | 3 | 4 | 'custom'

export type GameplayComponentKey =
  | 'truthOrDare'
  | 'neverHaveIEver'
  | 'mostLikelyTo'
  | 'charades'
  | 'thirtySeconds'
  | 'sketchAndGuess'
  | 'wordScramble'
  | 'numberBomb'
  | 'trackAttack'

export interface GameManifest {
  id: string
  name: string
  icon: string // lucide-react icon component name
  tagline: string
  description: string
  howToPlay: string[]
  minPlayers: number
  maxPlayers: number | null
  recommendedTeams: string
  durationMinutes: [number, number]
  difficulty: Difficulty
  gameType: string[] // filter tags: 'word','guessing','trivia','question','dare','acting','drawing', etc.
  audience: Audience[]
  ageRating: AgeRating
  usesTimer: boolean
  requiresTeams: boolean
  usesPoints: boolean
  cardPackId: string
  component: GameplayComponentKey
  accent: string // hex, used for the game card + gameplay chrome
}

// ---------------------------------------------------------------------------
// Game settings chosen during Setup — shared by all games.
// ---------------------------------------------------------------------------
export interface GameSettings {
  audience: Audience
  intensity: Intensity
  adultUnlocked: boolean
  teamMode: TeamMode
  usePunishments: boolean
  soundEnabled: boolean
}

export const DEFAULT_SETTINGS: GameSettings = {
  audience: 'friends',
  intensity: 'mild',
  adultUnlocked: false,
  teamMode: 'ffa',
  usePunishments: true,
  soundEnabled: true,
}

// ---------------------------------------------------------------------------
// Persisted shapes
// ---------------------------------------------------------------------------
export interface PersistedFavorites {
  gameIds: string[]
}

export interface PersistedRecent {
  gameIds: string[] // most recent first, capped
}

export interface InProgressGame {
  gameId: string
  players: Player[]
  teams: Team[]
  settings: GameSettings
  round: number
  savedAt: number
}

export interface CustomCard extends Card {
  custom: true
  createdAt: number
}

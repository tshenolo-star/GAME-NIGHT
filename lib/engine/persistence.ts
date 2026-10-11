// ============================================================================
// PERSISTENCE — thin, safe localStorage wrapper. Every read/write is
// try/catch guarded and SSR-safe (no-ops when `window` isn't available).
// This is the ONLY module that should touch localStorage directly.
// ============================================================================
import { CustomCard, GameSettings, InProgressGame, PersistedFavorites, PersistedRecent } from './types'

const KEYS = {
  settings: 'gn:settings',
  favorites: 'gn:favorites',
  recent: 'gn:recentlyPlayed',
  customCards: 'gn:customCards',
  inProgress: 'gn:inProgressGame',
} as const

const MAX_RECENT = 10

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && !!window.localStorage
}

function safeGet<T>(key: string): T | null {
  if (!canUseStorage()) return null
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

function safeSet<T>(key: string, value: T): boolean {
  if (!canUseStorage()) return false
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

function safeRemove(key: string): void {
  if (!canUseStorage()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    /* ignore */
  }
}

// --- Settings ---------------------------------------------------------------
export function loadSettings(): GameSettings | null {
  return safeGet<GameSettings>(KEYS.settings)
}
export function saveSettings(settings: GameSettings): void {
  safeSet(KEYS.settings, { ...settings, adultUnlocked: false })
}

// --- Favorites ---------------------------------------------------------------
export function loadFavorites(): string[] {
  return safeGet<PersistedFavorites>(KEYS.favorites)?.gameIds ?? []
}
export function toggleFavorite(gameId: string): string[] {
  const current = loadFavorites()
  const next = current.includes(gameId)
    ? current.filter((id) => id !== gameId)
    : [...current, gameId]
  safeSet<PersistedFavorites>(KEYS.favorites, { gameIds: next })
  return next
}

// --- Recently played -----------------------------------------------------
export function loadRecent(): string[] {
  return safeGet<PersistedRecent>(KEYS.recent)?.gameIds ?? []
}
export function recordPlayed(gameId: string): string[] {
  const current = loadRecent().filter((id) => id !== gameId)
  const next = [gameId, ...current].slice(0, MAX_RECENT)
  safeSet<PersistedRecent>(KEYS.recent, { gameIds: next })
  return next
}

// --- Custom cards ----------------------------------------------------------
export function loadCustomCards(): CustomCard[] {
  return safeGet<CustomCard[]>(KEYS.customCards) ?? []
}
export function saveCustomCards(cards: CustomCard[]): void {
  safeSet(KEYS.customCards, cards)
}
export function addCustomCard(card: CustomCard): CustomCard[] {
  const next = [...loadCustomCards(), card]
  saveCustomCards(next)
  return next
}
export function deleteCustomCard(id: string): CustomCard[] {
  const next = loadCustomCards().filter((c) => c.id !== id)
  saveCustomCards(next)
  return next
}
export function exportCustomCards(): string {
  return JSON.stringify(loadCustomCards(), null, 2)
}
export function importCustomCards(json: string): CustomCard[] {
  try {
    const parsed = JSON.parse(json) as CustomCard[]
    const merged = [...loadCustomCards(), ...parsed]
    saveCustomCards(merged)
    return merged
  } catch {
    return loadCustomCards()
  }
}

// --- Unfinished game ---------------------------------------------------------
export function loadInProgressGame(): InProgressGame | null {
  return safeGet<InProgressGame>(KEYS.inProgress)
}
export function saveInProgressGame(game: InProgressGame): void {
  safeSet(KEYS.inProgress, game)
}
export function clearInProgressGame(): void {
  safeRemove(KEYS.inProgress)
}

export function clearAllData(): void {
  Object.values(KEYS).forEach(safeRemove)
}

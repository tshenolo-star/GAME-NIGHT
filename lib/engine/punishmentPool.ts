import { Audience, Card, GameSettings } from './types'
import { filterCards } from './cardEngine'

export function choosePunishmentPool(cards: Card[], settings: GameSettings): Card[] {
  const unlocked = settings.adultUnlocked
  const ceilings = [settings.intensity, unlocked ? 'explicit' : 'bold'] as const
  const audienceChain: Audience[][] = [
    settings.audience === 'adults' ? ['adults', 'friends'] : [settings.audience],
    ['friends'],
    ['family'],
  ]

  for (const audiences of audienceChain) {
    for (const ceiling of ceilings) {
      const seen = new Set<string>()
      const pool: Card[] = []
      for (const audience of audiences) {
        for (const card of filterCards(cards, { audience, maxIntensity: ceiling, adultUnlocked: unlocked })) {
          if (!seen.has(card.id)) { seen.add(card.id); pool.push(card) }
        }
      }
      if (pool.length > 0) return pool
    }
  }

  return filterCards(cards, { audience: 'family', maxIntensity: 'mild', adultUnlocked: false })
}

export function extractSeconds(text: string): number | null {
  const minutes = text.match(/(\d+)\s*(?:-\s*)?minutes?/i)
  if (minutes) return Math.min(Number(minutes[1]) * 60, 180)
  const seconds = text.match(/(\d+)\s*(?:-\s*)?seconds?/i)
  if (seconds) return Math.min(Number(seconds[1]), 180)
  return null
}
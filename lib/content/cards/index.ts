// Barrel export for every content card pack — the cardPackId in a game
// manifest maps to one of these.
import { truthOrDareCards } from './truthOrDare'
import { nhieCards } from './neverHaveIEver'
import { nhieAdultCards } from './neverHaveIEverAdult'
import { mltCards } from './mostLikelyTo'
import { mltAdultCards } from './mostLikelyToAdult'
import { wordBankCards } from './wordBank'
import { punishmentCards } from './punishments'
import { Card } from '@/lib/engine/types'

export { truthOrDareCards, nhieCards, mltCards, wordBankCards, punishmentCards }

export const CARD_PACKS: Record<string, Card[]> = {
  truthOrDare: truthOrDareCards,
  neverHaveIEver: [...nhieCards, ...nhieAdultCards],
  mostLikelyTo: [...mltCards, ...mltAdultCards],
  wordBank: wordBankCards, // charades, sketch & guess, 30 seconds, word scramble all draw from here
  punishments: punishmentCards,
}

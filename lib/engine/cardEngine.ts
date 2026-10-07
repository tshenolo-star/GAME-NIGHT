import { Audience, Card, INTENSITY_ORDER, Intensity } from './types'

export function shuffle<T>(input: T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export interface CardFilter {
  audience: Audience
  maxIntensity: Intensity
  adultUnlocked: boolean
  region?: string
  category?: string
  excludeIds?: string[]
}

export function cardPasses(card: Card, filter: CardFilter): boolean {
  if (card.adultOnly && !filter.adultUnlocked) return false
  if (card.intensity === 'adult' || card.intensity === 'explicit') {
    if (!filter.adultUnlocked) return false
  }
  if (!card.audience.includes(filter.audience)) return false
  if (card.intensity) {
    const cardRank = INTENSITY_ORDER.indexOf(card.intensity)
    const maxRank = INTENSITY_ORDER.indexOf(filter.maxIntensity)
    if (cardRank > maxRank) return false
  }
  if (filter.region && card.region && card.region !== filter.region && card.region !== 'global') {
    return false
  }
  if (filter.category && card.category !== filter.category) return false
  if (filter.excludeIds?.includes(card.id)) return false
  return true
}

export function filterCards(cards: Card[], filter: CardFilter): Card[] {
  return cards.filter((c) => cardPasses(c, filter))
}

export class Deck {
  private pool: Card[]
  private drawPile: Card[]
  private usedIds: Set<string> = new Set()
  private lastDrawnId: string | null = null

  constructor(cards: Card[]) {
    this.pool = cards
    this.drawPile = shuffle(cards)
  }

  get remaining(): number {
    return this.drawPile.length
  }

  get totalSize(): number {
    return this.pool.length
  }

  draw(): Card | null {
    if (this.pool.length === 0) return null
    if (this.drawPile.length === 0) this.reshuffle()

    let card = this.drawPile.pop() ?? null
    if (card && card.id === this.lastDrawnId && this.drawPile.length > 0) {
      this.drawPile.unshift(card)
      card = this.drawPile.pop() ?? null
    }
    if (card) {
      this.usedIds.add(card.id)
      this.lastDrawnId = card.id
    }
    return card
  }

  drawWhere(predicate: (card: Card) => boolean): Card | null {
    if (this.pool.length === 0) return null
    if (this.drawPile.length === 0) this.reshuffle()

    const find = (test: (card: Card) => boolean) => {
      for (let i = this.drawPile.length - 1; i >= 0; i--) {
        if (test(this.drawPile[i])) return i
      }
      return -1
    }

    let index = find((c) => predicate(c) && c.id !== this.lastDrawnId)
    if (index === -1) {
      this.reshuffle()
      index = find((c) => predicate(c) && c.id !== this.lastDrawnId)
    }
    if (index === -1) index = find(predicate)
    if (index === -1) return this.draw()

    const [card] = this.drawPile.splice(index, 1)
    this.usedIds.add(card.id)
    this.lastDrawnId = card.id
    return card
  }

  peekPreview(count: number): Card[] {
    return shuffle(this.pool).slice(0, count)
  }

  reshuffle(): void {
    this.drawPile = shuffle(this.pool)
    this.usedIds.clear()
  }

  reset(): void {
    this.reshuffle()
    this.lastDrawnId = null
  }
}

export function createDeck(cards: Card[], filter: CardFilter): Deck {
  return new Deck(filterCards(cards, filter))
}

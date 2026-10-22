import { shuffle } from './cardEngine'

function samePlacements(a: string[], b: string[]): number {
  return a.reduce((count, letter, i) => count + (letter === b[i] ? 1 : 0), 0)
}

export function scrambleWord(word: string): string[] {
  const letters = word.toLowerCase().split('')
  const allowedFixed = Math.floor(letters.length / 4)
  let best = shuffle(letters)

  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = shuffle(letters)
    const identical = candidate.join('') === letters.join('')
    if (!identical && samePlacements(candidate, letters) <= allowedFixed) return candidate.map((l) => l.toUpperCase())
    if (!identical) best = candidate
  }

  return best.map((l) => l.toUpperCase())
}
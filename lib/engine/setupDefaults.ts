import { Audience, Card, GameSettings, Intensity } from './types'
import { filterCards } from './cardEngine'

export const SETUP_INTENSITIES: Intensity[] = ['mild', 'suggestive', 'flirty', 'bold', 'adult', 'explicit']
export const FIRST_ADULT_TIER = 4

export function poolSize(pack: Card[], audience: Audience, intensity: Intensity, adultUnlocked: boolean): number {
  return filterCards(pack, { audience, maxIntensity: intensity, adultUnlocked }).length
}

export function audienceHasCards(pack: Card[], audience: Audience): boolean {
  return poolSize(pack, audience, 'explicit', true) > 0
}

export function firstWorkableIntensity(pack: Card[], audience: Audience, adultUnlocked: boolean): Intensity | undefined {
  return SETUP_INTENSITIES.find(
    (i, idx) => (idx < FIRST_ADULT_TIER || adultUnlocked) && poolSize(pack, audience, i, adultUnlocked) > 0
  )
}

export function settingsForAudience(
  pack: Card[],
  settings: GameSettings,
  audience: Audience
): Pick<GameSettings, 'audience' | 'intensity'> {
  const keep = { audience: settings.audience, intensity: settings.intensity }
  if (audience === 'adults' && !settings.adultUnlocked) return keep
  if (!audienceHasCards(pack, audience)) return keep
  const intensity = poolSize(pack, audience, settings.intensity, settings.adultUnlocked) > 0
    ? settings.intensity
    : firstWorkableIntensity(pack, audience, settings.adultUnlocked) ?? settings.intensity
  return { audience, intensity }
}

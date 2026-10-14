// ============================================================================
// PUNISHMENT / LOSER CHALLENGE PACK — audience-aware end-game consequences.
// These are cards like any other, drawn through the same cardEngine filters,
// so "adult" punishments are structurally impossible to draw outside an
// unlocked adult session.
// ============================================================================
import { Card } from '@/lib/engine/types'

export const punishmentCards: Card[] = [
  // --- Family safe -----------------------------------------------------------
  { id: 'pun-fam-1', type: 'punishment', category: 'punishment', text: 'Do your best animal impression for 30 seconds.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  { id: 'pun-fam-2', type: 'punishment', category: 'punishment', text: 'Sing the alphabet backwards.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  { id: 'pun-fam-3', type: 'punishment', category: 'punishment', text: 'Do 10 star jumps while everyone counts out loud.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  { id: 'pun-fam-4', type: 'punishment', category: 'punishment', text: 'Tell your worst joke and hold a straight face.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  { id: 'pun-fam-5', type: 'punishment', category: 'punishment', text: 'Let the group pick your next dance move — and do it for 15 seconds.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  { id: 'pun-fam-6', type: 'punishment', category: 'punishment', text: 'Balance a spoon on your nose for 20 seconds.', ageRating: 'all', audience: ['family'], region: 'global', intensity: 'mild' },
  // --- Friends -----------------------------------------------------------------
  { id: 'pun-fr-1', type: 'punishment', category: 'punishment', text: 'Let the group write a fake bio for your dating profile — you have to read it out loud.', ageRating: '13+', audience: ['friends','coworkers'], region: 'global', intensity: 'mild' },
  { id: 'pun-fr-2', type: 'punishment', category: 'punishment', text: 'Do your best impression of someone else in the room until they guess who.', ageRating: '13+', audience: ['friends','coworkers'], region: 'global', intensity: 'mild' },
  { id: 'pun-fr-3', type: 'punishment', category: 'punishment', text: 'Post a group-chosen caption on your most recent photo for 10 minutes.', ageRating: '13+', audience: ['friends'], region: 'global', intensity: 'mild' },
  { id: 'pun-fr-4', type: 'punishment', category: 'punishment', text: 'Talk in an accent chosen by the group until your next turn.', ageRating: '13+', audience: ['friends','coworkers'], region: 'global', intensity: 'mild' },
  { id: 'pun-fr-5', type: 'punishment', category: 'punishment', text: 'Let the group give you an unflattering new nickname for the rest of the night.', ageRating: '13+', audience: ['friends'], region: 'global', intensity: 'bold' },
  // --- Couples -------------------------------------------------------------------
  { id: 'pun-cp-1', type: 'punishment', category: 'punishment', text: 'Give your partner a genuine, specific compliment in front of everyone.', ageRating: '16+', audience: ['couples'], region: 'global', intensity: 'flirty' },
  { id: 'pun-cp-2', type: 'punishment', category: 'punishment', text: 'Recreate your first date in 30 seconds of narrated acting.', ageRating: '16+', audience: ['couples'], region: 'global', intensity: 'flirty' },
  { id: 'pun-cp-3', type: 'punishment', category: 'punishment', text: 'Let your partner pick your next drink or snack order — no vetoes.', ageRating: '16+', audience: ['couples'], region: 'global', intensity: 'mild' },
  // --- Adults 18+ ------------------------------------------------------------------
  { id: 'pun-ad-1', type: 'punishment', category: 'punishment', text: 'Take a shot chosen by the group, or do 20 push-ups instead.', ageRating: '18+', audience: ['adults'], region: 'global', intensity: 'adult', adultOnly: true },
  { id: 'pun-ad-2', type: 'punishment', category: 'punishment', text: 'Let the group scroll your camera roll for 15 seconds, narrating out loud.', ageRating: '18+', audience: ['adults'], region: 'global', intensity: 'adult', adultOnly: true },
  { id: 'pun-ad-3', type: 'punishment', category: 'punishment', text: 'Send the group-chosen text to the group-chosen contact.', ageRating: '18+', audience: ['adults'], region: 'global', intensity: 'adult', adultOnly: true },
]

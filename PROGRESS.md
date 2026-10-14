# Game Night — Build Progress (Phase 1)

This is Phase 1 of the 39-section platform spec: the shared engine
architecture, proven end-to-end through 7 fully playable games. It has been
`npm install`'d, `tsc --noEmit`'d, `next build`'d, and smoke-tested locally —
all clean.

## What's built

**Engines** (`/lib/engine`) — shared by every game, no game re-implements its own:
- `cardEngine.ts` — filtering (audience/intensity/adult-gate/region), `Deck` class with no-immediate-repeat drawing + reshuffle
- `teamEngine.ts` — fair team splitting, turn-order shuffling, fair round-robin picking
- `turnEngine.ts` — round/team/player advancement
- `scoringEngine.ts` — correct/wrong/skip/bonus/penalty, team + player leaderboards
- `useTimer.ts` — configurable countdown hook: start/pause/resume/reset, time-up callback
- `persistence.ts` — the only module touching `localStorage`; settings, favorites, recently played, custom cards (read/write/import/export), in-progress game — all try/catch guarded, SSR-safe
- `store.tsx` — central game state manager (React Context + reducer): screen, players, teams, settings, turn, current card, scores

**Content** (`/lib/content`) — games are data, not code:
- `cards/truthOrDare.ts` — 267 cards migrated from the old `mild/spicy/dirty/kink/doOrDrink/couples/blindfold/truthDrink/sa` decks, re-tagged with audience/intensity/ageRating/region and cleaned of hardcoded drink-penalty phrasing (a card's original penalty value is preserved as a generic numeric `penalty`)
- `cards/neverHaveIEver.ts`, `cards/mostLikelyTo.ts` — 100 + 78 prompts, similarly re-tagged
- `cards/wordBank.ts` — 631 words/phrases (the old `wordCategories` + `daWords`), shared by Charades, Sketch & Guess, 30 Seconds, and Word Scramble
- `cards/punishments.ts` — a fresh, audience-tiered loser-punishment pack (family → adult)
- `games/manifests.ts` — one manifest per game (players, duration, difficulty, audience, age rating, which engines/card pack/gameplay component it uses)

**Games fully playable, end-to-end, on the shared engines:**
1. Truth or Dare
2. Never Have I Ever
3. Most Likely To
4. Charades (pass-and-play privacy screen + timer + turn + scoring)
5. 30 Seconds (5-word cards per turn)
6. Sketch & Guess (canvas drawing)
7. Word Scramble

**Screens** (`/components/screens`): Home → Library (search/filter/favorites) →
Game Info Card (stats, How to Play, Preview Cards, Start) → Setup
(players, audience, intensity, teams, punishment toggle) → Team Shuffle →
Gameplay → End Game (leaderboard) → Punishment → Rematch. All navigable with
back/forward history.

**Adult content isolation:** `settings.adultUnlocked` starts `false` every
session and can only flip to `true` through `AdultGateModal`'s explicit
checkbox confirmation. `cardPasses()` in the card engine hard-blocks any
`adultOnly` or adult/explicit-intensity card unless that flag is set — this is
enforced in the engine, not just hidden in the UI, so it can't be bypassed by
a filter change elsewhere.

**Design:** kept the existing dark/gold Bebas Neue + DM Sans identity from
the original app (including light mode), extended with team colors and
audience-tinted home tiles.

## Known gaps / next phases

- **~30 more games from the spec are not built yet** (Word Association, Hot
  Seat, Who Am I?, Guess the Song/Movie/Emoji, Rapid Fire, 5/10/30-second
  challenge engine as its own mode, Memory game, reaction games, dice/randomizer
  component, Would You Rather as its own game, custom-content UI). The
  architecture is designed so most of these are new manifests + (if needed) a
  new card pack — Charades/30 Seconds/Word Scramble/Sketch & Guess all share
  one word bank and one gameplay pattern, so several more "guessing" games can
  reuse `useGameRound` almost as-is.
- **Custom content**: the persistence layer already supports add/delete/import/export
  of custom cards, but there's no UI screen for it yet.
- **"Wild" mixed-intensity deck**: not ported as a separate array — by design,
  raising the Intensity slider in Setup already surfaces the same broader mix
  from one combined `truthOrDare` pack, so a dedicated "Wild Mix" mode is just
  a manifest away.
- **Old `drink`-type callout cards**: ~1/4 of the original card decks were
  literal "anyone who's done X drinks" call-outs. These were kept but
  regex-cleaned of drink-specific wording; a handful (~10 of 267) may still
  read slightly awkwardly and are worth a manual pass.
- **Accessibility pass** (section 34): large touch targets and readable
  contrast are in from the design system, but keyboard navigation and screen
  reader labels haven't had a dedicated pass yet.
- **No automated tests yet.**

## How to add a new game (per the spec's requirement)

1. Add cards to an existing pack in `/lib/content/cards`, or create a new pack file + register it in `cards/index.ts`.
2. Add a manifest entry in `/lib/content/games/manifests.ts` (metadata + which `component` key it uses).
3. If it needs new gameplay logic, add a component in `/components/screens/games/` (most guessing/timer games can be built on `useGameRound` + `useTimer` with only the phase-specific UI changing), then register it in `GameplayDispatcher.tsx`.
No changes to any engine file, to `App.tsx`'s navigation, or to any other screen are needed.

## Running it

```
npm install
npm run dev
```
Then open http://localhost:3000.

## Number Bomb and Track Attack

Two games added from the host's screen recordings.

- **Number Bomb** (`NumberBombGameplay.tsx`, `numberBomb/`): 30 numbered tiles, a Bomber secretly arms one, the Stepper needs 28 safe steps in 120 seconds. The surviving player scores 40.
- **Track Attack** (`TrackAttackGameplay.tsx`, `trackAttack/`, `lib/content/tracks.ts`, `lib/engine/songPreview.ts`): the host plays a mystery track, taps who got the artist (+10) or title (+10), or applies Wrong (-10) / Tag (-5). Five tracks in 180 seconds.
- Games with `cardPackId: 'none'` skip the Audience and Intensity sections in Setup.

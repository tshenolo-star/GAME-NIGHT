'use client'
import React, { useEffect, useState } from 'react'
import { GameStateProvider, useGameState } from '@/lib/engine/store'
import { Audience, DEFAULT_SETTINGS, GameSettings, Team } from '@/lib/engine/types'
import * as persistence from '@/lib/engine/persistence'
import { getManifest, GAME_MANIFESTS } from '@/lib/content/games/manifests'
import { splitIntoTeams, numTeamsFromMode } from '@/lib/engine/teamEngine'
import { CARD_PACKS } from '@/lib/content/cards'
import { settingsForAudience } from '@/lib/engine/setupDefaults'

import { HomeScreen } from './screens/HomeScreen'
import { LibraryScreen } from './screens/LibraryScreen'
import { GameInfoScreen } from './screens/GameInfoScreen'
import { SetupScreen } from './screens/SetupScreen'
import { TeamShuffleScreen } from './screens/TeamShuffleScreen'
import { GameplayDispatcher } from './screens/games/GameplayDispatcher'
import { EndGameScreen } from './screens/EndGameScreen'
import { PunishmentScreen } from './screens/PunishmentScreen'

type View =
  | { name: 'home' }
  | { name: 'library'; audience?: Audience; mode?: 'favorites' | 'recent' }
  | { name: 'gameInfo'; gameId: string }
  | { name: 'setup'; gameId: string }
  | { name: 'teamShuffle'; gameId: string }
  | { name: 'gameplay'; gameId: string }
  | { name: 'endgame'; gameId: string }
  | { name: 'punishment'; gameId: string }

function AppInner() {
  const [view, setView] = useState<View>({ name: 'home' })
  const [, setHistory] = useState<View[]>([])
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [favorites, setFavorites] = useState<string[]>([])
  const [recent, setRecent] = useState<string[]>([])
  const [pickedAudience, setPickedAudience] = useState<Audience | undefined>(undefined)

  const { state, dispatch } = useGameState()

  useEffect(() => {
    setFavorites(persistence.loadFavorites())
    setRecent(persistence.loadRecent())
    const savedSettings = persistence.loadSettings()
    if (savedSettings) dispatch({ type: 'SET_SETTINGS', settings: { ...savedSettings, adultUnlocked: false } })
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const navigate = (next: View) => { setHistory((h) => [...h, view]); setView(next) }
  const back = () => {
    setHistory((h) => {
      const copy = [...h]
      const prev = copy.pop()
      setView(prev ?? { name: 'home' })
      return copy
    })
  }

  const toggleFavorite = (gameId: string) => setFavorites(persistence.toggleFavorite(gameId))

  const currentGame = view.name !== 'home' && 'gameId' in view ? getManifest(view.gameId) : undefined

  const initialSettingsFor = (gameId: string, audience?: Audience): GameSettings => {
    const base: GameSettings = { ...DEFAULT_SETTINGS, adultUnlocked: state.settings.adultUnlocked }
    const game = getManifest(gameId)
    if (!game || !audience || !game.audience.includes(audience)) return base
    return { ...base, ...settingsForAudience(CARD_PACKS[game.cardPackId] ?? [], base, audience) }
  }

  const startGameSetup = (gameId: string, audience?: Audience) => {
    dispatch({ type: 'SELECT_GAME', gameId })
    dispatch({ type: 'SET_PLAYERS', players: [] })
    dispatch({ type: 'SET_TEAMS', teams: [] })
    dispatch({ type: 'SET_SETTINGS', settings: initialSettingsFor(gameId, audience) })
    navigate({ name: 'setup', gameId })
  }

  const proceedFromSetup = (gameId: string) => {
    persistence.saveSettings(state.settings)
    const game = getManifest(gameId)!
    setRecent(persistence.recordPlayed(gameId))
    const count = game.requiresTeams ? numTeamsFromMode(state.settings.teamMode) : 0
    if (count > 0) {
      dispatch({ type: 'SET_TEAMS', teams: splitIntoTeams(state.players, count) })
      navigate({ name: 'teamShuffle', gameId })
    } else {
      dispatch({ type: 'SET_TEAMS', teams: [] })
      dispatch({ type: 'START_GAME' })
      navigate({ name: 'gameplay', gameId })
    }
  }

  const startFromShuffle = (gameId: string) => {
    dispatch({ type: 'START_GAME' })
    navigate({ name: 'gameplay', gameId })
  }

  const rematch = (gameId: string) => {
    dispatch({ type: 'START_GAME' })
    setHistory([])
    setView({ name: 'gameplay', gameId })
  }

  const goHome = () => { dispatch({ type: 'RESET_GAME' }); setHistory([]); setView({ name: 'home' }) }

  if (view.name === 'home') {
    return (
      <HomeScreen
        theme={theme}
        toggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
        favoritesCount={favorites.length}
        recentCount={recent.length}
        onNavigate={(target) => {
          if (target === 'quickplay') {
            const g = GAME_MANIFESTS[Math.floor(Math.random() * GAME_MANIFESTS.length)]
            setPickedAudience(undefined)
            startGameSetup(g.id)
            return
          }
          if (target === 'library') { navigate({ name: 'library' }); return }
          if (target === 'favorites') { navigate({ name: 'library', mode: 'favorites' }); return }
          if (target === 'recent') { navigate({ name: 'library', mode: 'recent' }); return }
          navigate({ name: 'library', audience: target as Audience })
        }}
      />
    )
  }

  if (view.name === 'library') {
    return (
      <LibraryScreen
        onBack={back}
        initialAudience={view.audience}
        filterMode={view.mode}
        favorites={favorites}
        recentIds={recent}
        onToggleFavorite={toggleFavorite}
        onSelectGame={(gameId, audience) => { setPickedAudience(audience); navigate({ name: 'gameInfo', gameId }) }}
      />
    )
  }

  if (!currentGame) return null 

  if (view.name === 'gameInfo') {
    return (
      <GameInfoScreen
        game={currentGame}
        settings={initialSettingsFor(currentGame.id, pickedAudience)}
        onBack={back}
        onStart={() => startGameSetup(currentGame.id, pickedAudience)}
      />
    )
  }

  if (view.name === 'setup') {
    return (
      <SetupScreen
        game={currentGame}
        settings={state.settings}
        players={state.players}
        openAdultGate={pickedAudience === 'adults' && !state.settings.adultUnlocked && currentGame.audience.includes('adults')}
        onBack={back}
        onChangeSettings={(s) => dispatch({ type: 'SET_SETTINGS', settings: s })}
        onChangePlayers={(p) => dispatch({ type: 'SET_PLAYERS', players: p })}
        onContinue={() => proceedFromSetup(currentGame.id)}
      />
    )
  }

  if (view.name === 'teamShuffle') {
    return (
      <TeamShuffleScreen
        players={state.players}
        settings={state.settings}
        teams={state.teams}
        onBack={back}
        onChangeTeams={(teams: Team[]) => dispatch({ type: 'SET_TEAMS', teams })}
        onStart={() => startFromShuffle(currentGame.id)}
      />
    )
  }

  if (view.name === 'gameplay') {
    return (
      <GameplayDispatcher
        game={currentGame}
        settings={state.settings}
        players={state.players}
        teams={state.teams}
        onScoreTeam={(teamId, event, amount) => dispatch({ type: 'SCORE_TEAM', teamId, event, amount })}
        onScorePlayer={(playerId, event, amount) => dispatch({ type: 'SCORE_PLAYER', playerId, event, amount })}
        onFinish={() => navigate({ name: 'endgame', gameId: currentGame.id })}
        onBack={back}
      />
    )
  }

  if (view.name === 'endgame') {
    return (
      <EndGameScreen
        game={currentGame}
        teams={state.teams}
        players={state.players}
        playerScores={state.playerScores}
        usePunishments={state.settings.usePunishments}
        onPunishment={() => navigate({ name: 'punishment', gameId: currentGame.id })}
        onRematch={() => rematch(currentGame.id)}
        onHome={goHome}
      />
    )
  }

  if (view.name === 'punishment') {
    return (
      <PunishmentScreen
        settings={state.settings}
        teams={state.teams}
        players={state.players}
        playerScores={state.playerScores}
        onRematch={() => rematch(currentGame.id)}
        onHome={goHome}
      />
    )
  }

  return null
}

export default function App() {
  return (
    <GameStateProvider>
      <AppInner />
    </GameStateProvider>
  )
}

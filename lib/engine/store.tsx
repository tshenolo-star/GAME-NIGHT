
'use client'
import React, { createContext, useContext, useMemo, useReducer } from 'react'
import { Card, GameSettings, Player, Team, DEFAULT_SETTINGS } from './types'
import { TurnState, initialTurnState, advanceTurn } from './turnEngine'
import { applyScoreEvent, applyPlayerScoreEvent, ScoreEvent } from './scoringEngine'

export type Screen =
  | 'home'
  | 'library'
  | 'gameInfo'
  | 'setup'
  | 'teamShuffle'
  | 'gameplay'
  | 'scoreboard'
  | 'endgame'
  | 'punishment'

interface GameState {
  screen: Screen
  screenHistory: Screen[]
  selectedGameId: string | null
  players: Player[]
  teams: Team[]
  settings: GameSettings
  turn: TurnState
  currentCard: Card | null
  playerScores: Record<string, number>
  favorites: string[]
  recentlyPlayed: string[]
}

type Action =
  | { type: 'NAVIGATE'; to: Screen }
  | { type: 'BACK' }
  | { type: 'SELECT_GAME'; gameId: string }
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'SET_TEAMS'; teams: Team[] }
  | { type: 'SET_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'START_GAME' }
  | { type: 'ADVANCE_TURN' }
  | { type: 'SET_CARD'; card: Card | null }
  | { type: 'SCORE_TEAM'; teamId: string; event: ScoreEvent; amount?: number }
  | { type: 'SCORE_PLAYER'; playerId: string; event: ScoreEvent; amount?: number }
  | { type: 'SET_FAVORITES'; favorites: string[] }
  | { type: 'SET_RECENT'; recent: string[] }
  | { type: 'RESET_GAME' }

const initialState: GameState = {
  screen: 'home',
  screenHistory: [],
  selectedGameId: null,
  players: [],
  teams: [],
  settings: DEFAULT_SETTINGS,
  turn: initialTurnState(),
  currentCard: null,
  playerScores: {},
  favorites: [],
  recentlyPlayed: [],
}

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, screen: action.to, screenHistory: [...state.screenHistory, state.screen] }
    case 'BACK': {
      const history = [...state.screenHistory]
      const prev = history.pop() ?? 'home'
      return { ...state, screen: prev, screenHistory: history }
    }
    case 'SELECT_GAME':
      return { ...state, selectedGameId: action.gameId }
    case 'SET_PLAYERS':
      return { ...state, players: action.players }
    case 'SET_TEAMS':
      return { ...state, teams: action.teams }
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } }
    case 'START_GAME':
      return {
        ...state,
        turn: initialTurnState(),
        currentCard: null,
        playerScores: {},
        teams: state.teams.map((t) => ({ ...t, score: 0 })),
      }
    case 'ADVANCE_TURN':
      return { ...state, turn: advanceTurn(state.turn, state.players, state.teams) }
    case 'SET_CARD':
      return { ...state, currentCard: action.card }
    case 'SCORE_TEAM':
      return { ...state, teams: applyScoreEvent(state.teams, action.teamId, action.event, action.amount) }
    case 'SCORE_PLAYER':
      return {
        ...state,
        playerScores: applyPlayerScoreEvent(state.playerScores, action.playerId, action.event, action.amount),
      }
    case 'SET_FAVORITES':
      return { ...state, favorites: action.favorites }
    case 'SET_RECENT':
      return { ...state, recentlyPlayed: action.recent }
    case 'RESET_GAME':
      return {
        ...state,
        screen: 'home',
        screenHistory: [],
        selectedGameId: null,
        players: [],
        teams: [],
        turn: initialTurnState(),
        currentCard: null,
        playerScores: {},
      }
    default:
      return state
  }
}

interface GameStateContextValue {
  state: GameState
  dispatch: React.Dispatch<Action>
}

const GameStateContext = createContext<GameStateContextValue | null>(null)

export function GameStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>
}

export function useGameState() {
  const ctx = useContext(GameStateContext)
  if (!ctx) throw new Error('useGameState must be used within GameStateProvider')
  return ctx
}

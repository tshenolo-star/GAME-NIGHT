'use client'
import { useState, useEffect } from 'react'
import {
  Layers, Flame, Target, Users, Heart, EyeOff,
  MessageSquare, Flag, Timer, Shuffle, PartyPopper,
  Paintbrush, HelpCircle
} from 'lucide-react'
import HomeScreen from './HomeScreen'
import SubMenuScreen from './Menu'
import CardGameScreen from './CardGames'
import NHIEScreen from './NHIEscreen'
import MLTScreen from './MLTscreen'
import DrunkenArtistsScreen from './Drunkscreen'
import ThirtySecondsScreen from './30Seconds'

const cardMenuItems = [
  { id: 'mild',      title: 'Mild',           desc: 'Fun for everyone, safe for all groups',       icon: Layers,       color: '#60a5fa' },
  { id: 'spicy',     title: 'Spicy',          desc: 'Getting risky — secrets and hot dares',        icon: Flame,        color: '#f5824a' },
  { id: 'dirty',     title: 'Dirty',          desc: 'Adults only — explicit dares and truths',      icon: Flame,        color: '#f472b6', badge: '18+' },
  { id: 'kink',      title: 'Kink or Drink',  desc: 'Hot, bothered, and very drunk',                icon: Flame,        color: '#f472b6', badge: '18+' },
  { id: 'doOrDrink', title: 'Do or Drink',    desc: '250-card style naughty edition',               icon: Target,       color: '#F5A623', badge: '18+' },
]

const partyMenuItems = [
  { id: 'nhie-group',  title: 'Never Have I Ever', desc: 'Group edition — expose your secrets',      icon: HelpCircle,  color: '#34d399' },
  { id: 'mlt-group',   title: 'Most Likely To',    desc: 'Point and drink — group edition',          icon: Users,       color: '#c084fc' },
  { id: 'da',          title: 'Drunken Artists',   desc: 'Draw while drunk — others guess',          icon: Paintbrush,  color: '#F5A623' },
  { id: 'wild',        title: 'Wild Mix',          desc: 'All categories shuffled together',         icon: Shuffle,     color: '#f5824a' },
]

const couplesMenuItems = [
  { id: 'couples',        title: 'Couples Cards',         desc: 'Intimate dares, truths and challenges',   icon: Heart,        color: '#f472b6' },
  { id: 'nhie-couples',   title: 'Never Have I Ever',     desc: 'Deep relationship confessions',           icon: HelpCircle,   color: '#34d399' },
  { id: 'mlt-couples',    title: 'Most Likely To',        desc: 'Who would really do that?',               icon: Users,        color: '#c084fc' },
  { id: 'blindfold',      title: 'Blindfolded Touch',     desc: 'Identify your partner by touch only',     icon: EyeOff,       color: '#c084fc', badge: '18+' },
  { id: 'truthDrink',     title: 'Truth or Drink',        desc: 'Deep questions, no hiding allowed',       icon: MessageSquare,color: '#60a5fa' },
]

const saMenuItems = [
  { id: 'sa',          title: 'SA Card Game',         desc: 'Braai fails, Eskom, slang and more',        icon: Flag,      color: '#34d399', badge: 'SA' },
  { id: '30s',         title: '30 Seconds',           desc: 'The classic South African board game',      icon: Timer,     color: '#F5A623', badge: 'SA' },
  { id: 'nhie-sa',     title: 'Never Have I Ever',    desc: 'SA-specific confessions only',              icon: HelpCircle,color: '#34d399' },
  { id: 'mlt-sa',      title: 'Most Likely To',       desc: 'Who is the most South African?',            icon: Users,     color: '#c084fc' },
]

export default function GameApp() {
  const [theme, setTheme] = useState('dark')
  const [screen, setScreen] = useState('home')
  const [prevScreen, setPrevScreen] = useState('home')
  const [gameMode, setGameMode] = useState(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  const navigate = (to, back = 'home') => {
    setPrevScreen(back)
    setScreen(to)
  }

  const handleHomeNav = (id) => {
    if (id === 'card') navigate('cardMenu')
    else if (id === 'party') navigate('partyMenu')
    else if (id === 'couples') navigate('couplesMenu')
    else if (id === 'sa') navigate('saMenu')
    else if (id === '30s') navigate('30s')
    else if (id === 'wild') { setGameMode('wild'); navigate('cardGame', 'home') }
  }

  const handleCardMenuSelect = (id) => {
    setGameMode(id); navigate('cardGame', 'cardMenu')
  }

  const handlePartyMenuSelect = (id) => {
    if (id === 'nhie-group') { setGameMode('group'); navigate('nhie', 'partyMenu') }
    else if (id === 'mlt-group') { setGameMode('group'); navigate('mlt', 'partyMenu') }
    else if (id === 'da') navigate('da', 'partyMenu')
    else if (id === 'wild') { setGameMode('wild'); navigate('cardGame', 'partyMenu') }
  }

  const handleCouplesMenuSelect = (id) => {
    if (id === 'nhie-couples') { setGameMode('couples'); navigate('nhie', 'couplesMenu') }
    else if (id === 'mlt-couples') { setGameMode('couples'); navigate('mlt', 'couplesMenu') }
    else { setGameMode(id); navigate('cardGame', 'couplesMenu') }
  }

  const handleSAMenuSelect = (id) => {
    if (id === '30s') navigate('30s', 'saMenu')
    else if (id === 'nhie-sa') { setGameMode('sa'); navigate('nhie', 'saMenu') }
    else if (id === 'mlt-sa') { setGameMode('sa'); navigate('mlt', 'saMenu') }
    else { setGameMode(id); navigate('cardGame', 'saMenu') }
  }

  const goBack = () => setScreen(prevScreen)

  if (screen === 'home') return <HomeScreen onNavigate={handleHomeNav} theme={theme} toggleTheme={toggleTheme} />
  if (screen === 'cardMenu') return <SubMenuScreen title="Card Games" items={cardMenuItems} onBack={() => navigate('home')} onSelect={handleCardMenuSelect} />
  if (screen === 'partyMenu') return <SubMenuScreen title="Party Games" items={partyMenuItems} onBack={() => navigate('home')} onSelect={handlePartyMenuSelect} />
  if (screen === 'couplesMenu') return <SubMenuScreen title="Couples Only" items={couplesMenuItems} onBack={() => navigate('home')} onSelect={handleCouplesMenuSelect} />
  if (screen === 'saMenu') return <SubMenuScreen title="SA Edition" items={saMenuItems} onBack={() => navigate('home')} onSelect={handleSAMenuSelect} />
  if (screen === 'cardGame') return <CardGameScreen deck={gameMode} onBack={goBack} />
  if (screen === 'nhie') return <NHIEScreen mode={gameMode} onBack={goBack} />
  if (screen === 'mlt') return <MLTScreen mode={gameMode} onBack={goBack} />
  if (screen === 'da') return <DrunkenArtistsScreen onBack={goBack} />
  if (screen === '30s') return <ThirtySecondsScreen onBack={goBack} />

  return null
}
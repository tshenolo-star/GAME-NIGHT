'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, ChevronRight, Users, Droplets, Plus, X } from 'lucide-react'
import { mltDecks, shuffle } from '@/app/lib/gamedata'

export default function MLTScreen({ mode, onBack }) {
  const [setupDone, setSetupDone] = useState(false)
  const [players, setPlayers] = useState([{ name: 'Player 1' }, { name: 'Player 2' }])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [totalDrinks, setTotalDrinks] = useState(0)
  const [currentCard, setCurrentCard] = useState('...')

  const queueRef = useRef([])
  const pointerRef = useRef(0)

  const buildAllCards = () => {
    const base = mltDecks[mode] || mltDecks.group
    return [...base]
  }

  const pullCard = () => {
    if (pointerRef.current >= queueRef.current.length) {
      queueRef.current = shuffle(buildAllCards())
      pointerRef.current = 0
    }
    const card = queueRef.current[pointerRef.current]
    pointerRef.current += 1
    return card
  }

  const startGame = () => {
    queueRef.current = shuffle(buildAllCards())
    pointerRef.current = 0
    setPlayerIdx(0)
    setTotalDrinks(0)
    setCurrentCard(pullCard())
    setSetupDone(true)
  }

  const nextCard = (allDrink) => {
    if (allDrink) setTotalDrinks(t => t + players.length)
    const nextIdx = (playerIdx + 1) % players.length
    setPlayerIdx(nextIdx)
    setCurrentCard(pullCard())
  }

  const currentPlayerName = players[playerIdx]?.name || ''

  if (!setupDone) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--purple)' }}>Most Likely To</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: '28px 48px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Users size={15} color="var(--purple)" />
            <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Players</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>Prompts drawn from one shared deck — no repeats until all cards are used</div>
          {players.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
              <input value={p.name} onChange={e => setPlayers(prev => prev.map((x, j) => j === i ? { name: e.target.value } : x))}
                style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 10, padding: '11px 14px', color: 'var(--text)', fontSize: 14 }} />
              {players.length > 2 && (
                <button onClick={() => setPlayers(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text3)', padding: 6, borderRadius: 8 }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {players.length < 8 && (
            <button onClick={() => setPlayers(prev => [...prev, { name: `Player ${prev.length + 1}` }])}
              style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 10, padding: '10px 14px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginTop: 4, width: '100%' }}>
              <Plus size={14} /> Add Player
            </button>
          )}
        </div>

        <button onClick={startGame} style={{ width: '100%', background: 'var(--purple)', color: '#111', border: 'none', borderRadius: 14, padding: '18px', fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Start Game <ChevronRight size={22} />
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setSetupDone(false)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--purple)' }}>Most Likely To</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Droplets size={15} />{totalDrinks}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {players.map((p, i) => (
            <div key={i} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: i === playerIdx ? 'var(--purple)' : 'var(--bg3)',
              color: i === playerIdx ? '#111' : 'var(--text3)',
              transition: 'all 0.2s'
            }}>{p.name}</div>
          ))}
        </div>

        <div style={{ width: '100%', background: 'var(--bg2)', border: '2px solid #2a1a3a', borderRadius: 20, padding: '32px 24px', textAlign: 'center', marginBottom: 24, minHeight: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
            <Users size={14} color="var(--purple)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 3, color: 'var(--purple)' }}>MOST LIKELY TO...</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase', fontWeight: 500 }}>{currentPlayerName}&apos;s question</div>
          <div style={{ fontSize: 22, fontWeight: 500, lineHeight: 1.5, color: 'var(--text)' }}>{currentCard}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 18, lineHeight: 1.6 }}>
            Everyone points at who they think. Most votes = that person drinks. Tie = everyone drinks.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button onClick={() => nextCard(true)} style={{
            background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)',
            borderRadius: 14, padding: '16px 18px', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', minHeight: 70,
            transition: 'all 0.15s'
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text2)' }}>
            <Droplets size={14} /> All Drink
          </button>
          <button onClick={() => nextCard(false)} style={{
            flex: 1, background: 'var(--gold)', color: '#111', border: 'none',
            borderRadius: 14, padding: '16px', fontFamily: 'var(--font-display)',
            fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 70
          }}>
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
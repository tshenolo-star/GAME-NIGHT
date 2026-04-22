'use client'
import { useState, useRef } from 'react'
import { ArrowLeft, ChevronRight, Droplets, ThumbsUp, Users, Plus, X } from 'lucide-react'
import { nhieDecks, shuffle } from '@/app/lib/gamedata'

export default function NHIEScreen({ mode, onBack }) {
  const [setupDone, setSetupDone] = useState(false)
  const [players, setPlayers] = useState([{ name: 'Player 1' }, { name: 'Player 2' }])
  const [playerIdx, setPlayerIdx] = useState(0)
  const [done1, setDone1] = useState(0)
  const [done2, setDone2] = useState(0)
  const [totalDrinks, setTotalDrinks] = useState(0)
  const [currentCard, setCurrentCard] = useState('...')

  const queueRef = useRef([])
  const pointerRef = useRef(0)

  const buildAllCards = () => {
    const base = nhieDecks[mode] || nhieDecks.group
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
    setDone1(0)
    setDone2(0)
    setTotalDrinks(0)
    setCurrentCard(pullCard())
    setSetupDone(true)
  }

  const tap = (n) => {
    if (n === 1) setDone1(d => d + 1)
    else setDone2(d => d + 1)
    setTotalDrinks(t => t + n)
  }

  const nextCard = () => {
    const nextIdx = (playerIdx + 1) % players.length
    setPlayerIdx(nextIdx)
    setDone1(0)
    setDone2(0)
    setCurrentCard(pullCard())
  }

  const currentPlayerName = players[playerIdx]?.name || ''

  if (!setupDone) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '8px 14px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--green)' }}>Never Have I Ever</div>
        <div style={{ width: 80 }} />
      </div>

      <div style={{ padding: '28px 48px', flex: 1, display: 'flex', flexDirection: 'column', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Users size={15} color="var(--green)" />
            <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>Players</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 16 }}>Prompts are drawn from one shared deck — no repeats until all cards are used</div>
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

        <button onClick={startGame} style={{ width: '100%', background: 'var(--green)', color: '#111', border: 'none', borderRadius: 14, padding: '18px', fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
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
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--green)' }}>Never Have I Ever</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <Droplets size={15} />{totalDrinks}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
          {players.map((p, i) => (
            <div key={i} style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 13, fontWeight: 500,
              background: i === playerIdx ? 'var(--green)' : 'var(--bg3)',
              color: i === playerIdx ? '#111' : 'var(--text3)',
              transition: 'all 0.2s'
            }}>{p.name}</div>
          ))}
        </div>

        <div style={{ width: '100%', background: 'var(--bg2)', border: '2px solid #1a3a2a', borderRadius: 20, padding: '32px 24px', textAlign: 'center', marginBottom: 24, minHeight: 260 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 3, color: 'var(--green)', marginBottom: 8 }}>NEVER HAVE I EVER...</div>
          <div style={{ fontSize: 12, color: 'var(--gold)', letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase', fontWeight: 500 }}>{currentPlayerName}&apos;s turn</div>
          <div style={{ fontSize: 21, fontWeight: 500, lineHeight: 1.55, color: 'var(--text)' }}>{currentCard}</div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 18, lineHeight: 1.6 }}>If you HAVE — tap your button and sip. Honesty is mandatory!</div>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16, width: '100%' }}>
          {[{ n: 1, label: 'Done it', sub: '1 sip', count: done1 }, { n: 2, label: 'Done it twice+', sub: '2 sips', count: done2 }].map(({ n, label, sub, count }) => (
            <button key={n} onClick={() => tap(n)} style={{
              flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '16px 10px', textAlign: 'center', transition: 'all 0.15s', minHeight: 110
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.background = '#0a2a1a' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                <ThumbsUp size={14} color="var(--green)" />
                <span style={{ fontSize: 12, color: 'var(--text2)' }}>{label}</span>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', letterSpacing: 1 }}>{count}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>{sub}</div>
            </button>
          ))}
        </div>

        <button onClick={nextCard} style={{ width: '100%', background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 14, padding: '17px', fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Next Player <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
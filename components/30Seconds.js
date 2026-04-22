'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Plus, X, Check, Timer, Trophy, ChevronRight } from 'lucide-react'
import { wordCategories, shuffle } from '@/app/lib/gamedata'

function Header({ onBack, teamName, scores, teams, showScores = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
      <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
        <ArrowLeft size={14} /> Back
      </button>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
        <Timer size={16} /> 30 Seconds
      </div>
      {showScores && teams ? (
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, color: 'var(--text2)', letterSpacing: 1, textAlign: 'right' }}>
          {teams.map(t => (
            <div key={t.name} style={{ color: t.name === teamName ? 'var(--gold)' : 'var(--text3)' }}>
              {t.name}: {scores[t.name] || 0}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ width: 70 }} />
      )}
    </div>
  )
}

const WORDS_PER_ROUND = 6

export default function ThirtySecondsScreen({ onBack }) {
  const [phase, setPhase] = useState('setup')
  const [teams, setTeams] = useState([{ name: 'Team A' }, { name: 'Team B' }])
  const [selectedCats, setSelectedCats] = useState(Object.keys(wordCategories))
  const [totalRounds, setTotalRounds] = useState(3)
  const [scores, setScores] = useState({})
  const [roundsLeft, setRoundsLeft] = useState({})
  const [teamIdx, setTeamIdx] = useState(0)

  const queueRef = useRef([])
  const pointerRef = useRef(0)

  const [roundWords, setRoundWords] = useState([])
  const [tappedCorrect, setTappedCorrect] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(60)
  const timerRef = useRef(null)

  const buildAllWords = () => {
    let all = []
    selectedCats.forEach(c => { if (wordCategories[c]) all = [...all, ...wordCategories[c]] })
    return all
  }

  const pullWords = (n) => {
    const words = []
    while (words.length < n) {
      if (pointerRef.current >= queueRef.current.length) {
        queueRef.current = shuffle(buildAllWords())
        pointerRef.current = 0
      }
      words.push(queueRef.current[pointerRef.current])
      pointerRef.current += 1
    }
    return words
  }

  const startGame = () => {
    const s = {}
    const r = {}
    teams.forEach(t => { s[t.name] = 0; r[t.name] = totalRounds })

    queueRef.current = shuffle(buildAllWords())
    pointerRef.current = 0

    const firstWords = pullWords(WORDS_PER_ROUND)

    setScores(s)
    setRoundsLeft(r)
    setTeamIdx(0)
    setRoundWords(firstWords)
    setTappedCorrect(new Set())
    setTimeLeft(60)
    setPhase('ready')
  }

  const startTimer = () => {
    setPhase('playing')
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (timeLeft === 0 && phase === 'playing') endRound()
  }, [timeLeft, phase])

  const toggleWord = (word) => {
    setTappedCorrect(prev => {
      const next = new Set(prev)
      if (next.has(word)) next.delete(word)
      else next.add(word)
      return next
    })
  }

  const endRound = () => {
    clearInterval(timerRef.current)
    const correct = tappedCorrect.size
    setScores(prev => ({
      ...prev,
      [teams[teamIdx].name]: (prev[teams[teamIdx].name] || 0) + correct
    }))
    setPhase('roundEnd')
  }

  const nextTeam = () => {
    setRoundsLeft(prev => ({
      ...prev,
      [teams[teamIdx].name]: prev[teams[teamIdx].name] - 1
    }))

    const nextIdx = (teamIdx + 1) % teams.length
    const nextWords = pullWords(WORDS_PER_ROUND)

    setTeamIdx(nextIdx)
    setRoundWords(nextWords)
    setTappedCorrect(new Set())
    setTimeLeft(60)
    setPhase('ready')
  }

  const allDone = () => Object.values(roundsLeft).every(r => r <= 1)

  const currentTeamName = teams[teamIdx]?.name || ''
  const timerPct = (timeLeft / 60) * 100
  const danger = timeLeft <= 10
  const correct = tappedCorrect.size
  const penalty = Math.max(0, 5 - correct)
  const sortedTeams = [...teams].sort((a, b) => (scores[b.name] || 0) - (scores[a.name] || 0))

  if (phase === 'setup') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header onBack={onBack} />
      <div style={{ padding: '28px 48px 0', flex: 1, overflowY: 'auto' }}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>Teams</div>
          {teams.map((t, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
              <input value={t.name} onChange={e => setTeams(prev => prev.map((x, j) => j === i ? { name: e.target.value } : x))}
                style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 14 }} />
              {teams.length > 2 && (
                <button onClick={() => setTeams(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'var(--text3)', padding: 4 }}>
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
          {teams.length < 6 && (
            <button onClick={() => setTeams(prev => [...prev, { name: `Team ${prev.length + 1}` }])}
              style={{ background: 'none', border: '1px dashed var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text2)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, marginTop: 4 }}>
              <Plus size={14} /> Add Team
            </button>
          )}
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>Word Categories</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.keys(wordCategories).map(cat => (
              <button key={cat} onClick={() => setSelectedCats(prev => prev.includes(cat) ? (prev.length > 1 ? prev.filter(c => c !== cat) : prev) : [...prev, cat])}
                style={{ background: selectedCats.includes(cat) ? 'var(--gold)' : 'var(--bg3)', color: selectedCats.includes(cat) ? '#111' : 'var(--text2)', border: `1px solid ${selectedCats.includes(cat) ? 'var(--gold)' : 'var(--border)'}`, borderRadius: 20, padding: '5px 12px', fontSize: 12 }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>Rounds Per Team</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setTotalRounds(r => Math.max(1, r - 1))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, color: 'var(--text2)', fontSize: 18 }}>−</button>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', letterSpacing: 2 }}>{totalRounds}</span>
            <button onClick={() => setTotalRounds(r => Math.min(10, r + 1))} style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 8, width: 36, height: 36, color: 'var(--text2)', fontSize: 18 }}>+</button>
          </div>
        </div>

        <button onClick={startGame} style={{ width: '100%', background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Start Game <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )

  if (phase === 'ready') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header onBack={() => setPhase('setup')} teamName={currentTeamName} scores={scores} teams={teams} showScores />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, letterSpacing: 3, color: 'var(--green)', marginBottom: 4, textAlign: 'center' }}>{currentTeamName}</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20, textAlign: 'center' }}>Describer — study your 6 words then send the others out!</div>
        <div style={{ width: '100%', maxWidth: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
          {roundWords.map((word, i) => (
            <div key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 12px', textAlign: 'center', minHeight: 90 }}>
              <div style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: 1, marginBottom: 4 }}>#{i + 1}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: 2, color: 'var(--text)' }}>{word}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 20, textAlign: 'center' }}>
          No spelling · No rhyming · No first letters · No word repeats for anyone
        </div>
        <button onClick={startTimer} style={{ width: '100%', maxWidth: 400, background: 'var(--green)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: '16px 40px', fontFamily: 'var(--font-display)', fontSize: 24, letterSpacing: 3 }}>
          Start Timer!
        </button>
      </div>
    </div>
  )

  if (phase === 'playing') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header onBack={() => { clearInterval(timerRef.current); setPhase('ready') }} teamName={currentTeamName} scores={scores} teams={teams} showScores />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px' }}>
        <div style={{ position: 'relative', width: 130, height: 130, marginBottom: 20 }}>
          <svg width="130" height="130" viewBox="0 0 130 130">
            <circle cx="65" cy="65" r="55" fill="none" stroke="var(--bg3)" strokeWidth="10" />
            <circle cx="65" cy="65" r="55" fill="none"
              stroke={danger ? 'var(--red)' : 'var(--gold)'}
              strokeWidth="10" strokeLinecap="round"
              strokeDasharray="345"
              strokeDashoffset={345 - (timerPct / 100) * 345}
              transform="rotate(-90 65 65)"
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 52, color: danger ? 'var(--red)' : 'var(--gold)', lineHeight: 1 }}>{timeLeft}</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 16, textAlign: 'center' }}>Tap every word your team guessed correctly</div>
        <div style={{ width: '100%', maxWidth: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {roundWords.map((word, i) => {
            const isCorrect = tappedCorrect.has(word)
            return (
              <button key={i} onClick={() => toggleWord(word)} style={{
                background: isCorrect ? '#1a5a2a' : 'var(--bg2)',
                border: `2px solid ${isCorrect ? 'var(--green)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)', padding: '14px 10px', textAlign: 'center',
                transition: 'all 0.15s', cursor: 'pointer', minHeight: 85
              }}>
                <div style={{ fontSize: 11, color: isCorrect ? 'var(--green)' : 'var(--text3)', letterSpacing: 1, marginBottom: 4 }}>
                  {isCorrect ? '✓ got it' : `#${i + 1}`}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 2, color: isCorrect ? 'var(--green)' : 'var(--text)' }}>{word}</div>
              </button>
            )
          })}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--gold)', letterSpacing: 2, marginBottom: 16 }}>
          {tappedCorrect.size} / {WORDS_PER_ROUND} correct
        </div>
        <button onClick={endRound} style={{ width: '100%', maxWidth: 400, background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 15, fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3 }}>
          End Round
        </button>
      </div>
    </div>
  )

  if (phase === 'roundEnd') return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header onBack={() => setPhase('setup')} teamName={currentTeamName} scores={scores} teams={teams} showScores />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, color: 'var(--gold)', letterSpacing: 2, marginBottom: 4 }}>{correct} / {WORDS_PER_ROUND} words!</div>
        {penalty > 0
          ? <div style={{ fontSize: 14, color: 'var(--text2)', marginBottom: 16 }}>{currentTeamName} drinks {penalty} 🍺 (missed {penalty} from {WORDS_PER_ROUND})</div>
          : <div style={{ fontSize: 14, color: 'var(--green)', marginBottom: 16 }}>Perfect round! No drinks 🎉</div>
        }
        <div style={{ width: '100%', maxWidth: 400, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
          {roundWords.map((word, i) => {
            const got = tappedCorrect.has(word)
            return (
              <div key={i} style={{ background: got ? '#1a5a2a' : '#3a1a1a', border: `1px solid ${got ? '#2a8a3a' : '#5a2a1a'}`, borderRadius: 'var(--radius)', padding: '10px 8px', textAlign: 'center', minHeight: 70 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: got ? 'var(--green)' : 'var(--red)' }}>{word}</div>
                <div style={{ fontSize: 11, color: got ? 'var(--green)' : 'var(--red)', marginTop: 2 }}>{got ? '✓' : '✗'}</div>
              </div>
            )
          })}
        </div>
        <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          {teams.map(t => (
            <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ color: t.name === currentTeamName ? 'var(--gold)' : 'var(--text)' }}>{t.name}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>{scores[t.name] || 0}</span>
            </div>
          ))}
        </div>
        {allDone()
          ? <button onClick={() => setPhase('final')} style={{ width: '100%', maxWidth: 400, background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Trophy size={18} /> Final Results
            </button>
          : <button onClick={nextTeam} style={{ width: '100%', maxWidth: 400, background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 16, fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              Next Team <ChevronRight size={18} />
            </button>
        }
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <Header onBack={onBack} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', textAlign: 'center' }}>
        <Trophy size={52} color="var(--gold)" strokeWidth={1} style={{ marginBottom: 16 }} />
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--gold)', letterSpacing: 3, marginBottom: 4 }}>{sortedTeams[0]?.name} Wins!</div>
        <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>Losers finish their drinks!</div>
        <div style={{ width: '100%', maxWidth: 400, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
          {sortedTeams.map((t, i) => (
            <div key={t.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < sortedTeams.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <span style={{ color: 'var(--text)' }}>{['🥇', '🥈', '🥉'][i] || ''} {t.name}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)' }}>{scores[t.name] || 0} pts</span>
            </div>
          ))}
        </div>
        <button onClick={() => setPhase('setup')} style={{ width: '100%', maxWidth: 400, background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 15, fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, marginBottom: 10 }}>Play Again</button>
        <button onClick={onBack} style={{ width: '100%', maxWidth: 400, background: 'none', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 13, fontSize: 13 }}>Back to Home</button>
      </div>
    </div>
  )
}
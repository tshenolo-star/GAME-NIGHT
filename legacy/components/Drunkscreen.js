'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, ChevronRight, X, Check, Droplets, Paintbrush } from 'lucide-react'
import { daWords, shuffle } from '@/app/lib/gamedata'

export default function DrunkenArtistsScreen({ onBack }) {
  const [words, setWords] = useState([])
  const [index, setIndex] = useState(0)
  const [drinks, setDrinks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const timerRef = useRef(null)

  useEffect(() => {
    setWords(shuffle(daWords))
    setIndex(0); setDrinks(0)
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [])

  const startTimer = () => {
    clearInterval(timerRef.current)
    setTimeLeft(60)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const next = (guessed) => {
    if (!guessed) setDrinks(d => d + 3)
    setIndex(i => (i + 1) % words.length)
    startTimer()
  }

  const pct = (timeLeft / 60) * 100
  const danger = timeLeft <= 15

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid var(--border)', color: 'var(--text2)',
          padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 6 }}>
          <Paintbrush size={16} /> Drunken Artists
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold)' }}>
          <Droplets size={14} style={{ display: 'inline', marginRight: 3 }} />{drinks}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', maxWidth: 480, margin: '0 auto', width: '100%' }}>
        <div style={{
          width: '100%', background: 'var(--bg2)', border: '2px solid #3a2a0a',
          borderRadius: 'var(--radius-lg)', padding: '32px 24px', textAlign: 'center', marginBottom: 16, minHeight: 260
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
            <Paintbrush size={14} color="var(--gold)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 3, color: 'var(--gold)' }}>DRAW THIS WORD</div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 44, letterSpacing: 3, color: 'var(--text)', lineHeight: 1.1, marginBottom: 12 }}>
            {words[index] || '...'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.5 }}>
            Artist draws. Everyone else guesses. Longer it takes = more the artist drinks.<br />
            Not guessed in time = artist drinks 3!
          </div>
        </div>

        <div style={{ width: '100%', marginBottom: 20 }}>
          <div style={{ width: '100%', height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              background: danger ? 'var(--red)' : 'var(--gold)',
              width: `${pct}%`, transition: 'width 1s linear, background 0.3s'
            }} />
          </div>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, letterSpacing: 2,
            color: danger ? 'var(--red)' : 'var(--gold)', textAlign: 'center', marginTop: 8
          }}>
            {timeLeft > 0 ? `${timeLeft}s` : 'Time up! Artist drinks 3'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button onClick={() => next(false)} style={{
            flex: 1, background: 'var(--bg2)', color: 'var(--text2)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 2, minHeight: 70
          }}>
            <X size={16} /> Not Guessed
          </button>
          <button onClick={() => next(true)} style={{
            flex: 1, background: '#1a5a2a', color: 'var(--green)',
            border: '1px solid #2a8a3a', borderRadius: 'var(--radius)',
            padding: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: 2, minHeight: 70
          }}>
            <Check size={16} /> Guessed!
          </button>
        </div>
      </div>
    </div>
  )
}
'use client'
import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, SkipForward, ChevronRight, Flame, HelpCircle, Droplets, Sparkles, Zap, Play } from 'lucide-react'
import { cardDecks, shuffle } from '@/app/lib/gamedata'

const typeConfig = {
  truth:  { label: 'TRUTH', bg: '#1a2a3a', color: '#60a5fa', icon: HelpCircle },
  dare:   { label: 'DARE',  bg: '#3a1a1a', color: '#f5824a', icon: Flame },
  drink:  { label: 'DRINK', bg: '#2a1a0a', color: '#F5A623', icon: Droplets },
  wild:   { label: 'WILD',  bg: '#2a1a3a', color: '#c084fc', icon: Sparkles },
  kinky:  { label: 'KINKY', bg: '#3a0a2a', color: '#f472b6', icon: Zap },
}

const deckMeta = {
  mild:       { label: 'Mild',           color: '#60a5fa' },
  spicy:      { label: 'Spicy',          color: '#f5824a' },
  dirty:      { label: 'Dirty',          color: '#f472b6' },
  kink:       { label: 'Kink or Drink',  color: '#f472b6' },
  doOrDrink:  { label: 'Do or Drink',    color: '#F5A623' },
  couples:    { label: 'Couples',        color: '#f472b6' },
  blindfold:  { label: 'Blindfolded',    color: '#c084fc' },
  truthDrink: { label: 'Truth or Drink', color: '#60a5fa' },
  sa:         { label: 'SA Edition',     color: '#34d399' },
  wild:       { label: 'Wild Mix',       color: '#f5824a' },
}

export default function CardGameScreen({ deck, onBack }) {
  const [cards, setCards] = useState([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [drinks, setDrinks] = useState(0)
  const [timeLeft, setTimeLeft] = useState(null)
  const [totalTime, setTotalTime] = useState(null)
  const [timerStarted, setTimerStarted] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    setCards(shuffle(cardDecks[deck] || cardDecks.mild))
    setIndex(0); setFlipped(false); setDrinks(0); stopTimer()
  }, [deck])

  const stopTimer = () => {
    clearInterval(timerRef.current)
    setTimeLeft(null); setTotalTime(null); setTimerStarted(false)
  }

  const startTimer = (s) => {
    setTimerStarted(true)
    setTimeLeft(s); setTotalTime(s)
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev === null || prev <= 1) { clearInterval(timerRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const flip = () => {
    if (flipped) return
    setFlipped(true)
    stopTimer()
  }

  const next = (passed) => {
    if (passed) setDrinks(d => d + 1)
    stopTimer(); setFlipped(false)
    setIndex(i => (i + 1) % cards.length)
  }

  const card = cards[index]
  const meta = deckMeta[deck] || deckMeta.mild
  const typeCfg = card ? (typeConfig[card.type] || typeConfig.dare) : typeConfig.dare
  const TypeIcon = typeCfg.icon
  const timerPct = totalTime ? ((timeLeft ?? 0) / totalTime) * 100 : 100
  const timerDanger = timeLeft !== null && timeLeft <= 10

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--border)' }}>
        <button onClick={onBack} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', padding: '7px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 3, color: meta.color }}>{meta.label}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, color: 'var(--gold)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Droplets size={14} />{drinks}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px 48px', maxWidth: 480, margin: '0 auto', width: '100%' }}>

        <div style={{ width: '100%', perspective: 1000, marginBottom: 20 }}>
          <div onClick={flip} style={{
            position: 'relative', width: '100%', height: 380,
            transition: 'transform 0.6s cubic-bezier(0.4,0,0.2,1)',
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            cursor: flipped ? 'default' : 'pointer',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg2)', border: '1px solid var(--border)',
              backfaceVisibility: 'hidden', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 16,
            }}>
              <SkipForward size={48} strokeWidth={1} color={meta.color} style={{ opacity: 0.4 }} />
              <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 2 }}>Tap to reveal</div>
            </div>

            <div style={{
              position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
              background: 'var(--bg2)', border: '2px solid var(--border2)',
              backfaceVisibility: 'hidden', transform: 'rotateY(180deg)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: '22px 22px 18px', textAlign: 'center',
            }}>
              {card && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: typeCfg.bg, color: typeCfg.color, padding: '4px 12px', borderRadius: 20, marginBottom: 16, fontSize: 11, letterSpacing: 3, fontFamily: 'var(--font-display)' }}>
                    <TypeIcon size={12} /> {typeCfg.label}
                  </div>
                  <div style={{ fontSize: 17, lineHeight: 1.55, fontWeight: 500, color: 'var(--text)', flex: 1, display: 'flex', alignItems: 'center' }}>
                    {card.text}
                  </div>
                  {card.drinks > 0 && (
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: 'var(--gold)', letterSpacing: 2, marginTop: 8 }}>
                      {'🍺'.repeat(Math.min(card.drinks, 5))} {card.drinks} sip{card.drinks !== 1 ? 's' : ''}
                    </div>
                  )}

                  {card.timer && (
                    <>
                      {!timerStarted ? (
                        <button onClick={e => { e.stopPropagation(); startTimer(card.timer) }} style={{
                          marginTop: 12, background: 'var(--gold)', color: '#111', border: 'none',
                          borderRadius: 10, padding: '8px 18px', fontFamily: 'var(--font-display)',
                          fontSize: 16, letterSpacing: 2, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer'
                        }}>
                          <Play size={14} /> Start Timer ({card.timer}s)
                        </button>
                      ) : (
                        <>
                          <div style={{ width: '100%', height: 5, background: 'var(--bg3)', borderRadius: 3, marginTop: 12, overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 3, background: timerDanger ? 'var(--red)' : 'var(--gold)', width: `${timerPct}%`, transition: 'width 1s linear, background 0.3s' }} />
                          </div>
                          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: timerDanger ? 'var(--red)' : 'var(--gold)', letterSpacing: 2, marginTop: 6 }}>
                            {timeLeft !== null && timeLeft > 0 ? `${timeLeft}s` : 'Time up!'}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button onClick={() => next(true)} style={{ background: 'var(--bg2)', color: 'var(--text2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '15px 18px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, minHeight: 60 }}>
            <SkipForward size={14} /> Pass
          </button>
          <button onClick={() => next(false)} style={{ flex: 1, background: 'var(--gold)', color: '#111', border: 'none', borderRadius: 'var(--radius)', padding: 15, fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 60 }}>
            Next <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
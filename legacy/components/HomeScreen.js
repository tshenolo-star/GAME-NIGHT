'use client'
import { Layers, PartyPopper, Heart, Flag, Timer, Shuffle, Sun, Moon } from 'lucide-react'

const menuItems = [
  { id: 'card',    label: 'Card Games',  sub: 'Dare · Truth · Drink', icon: Layers,      color: '#60a5fa', bg: '#1a2a3a', border: '#2a4a6a' },
  { id: 'party',   label: 'Party Games', sub: 'Groups · Fun',          icon: PartyPopper, color: '#c084fc', bg: '#2a1a3a', border: '#4a2a6a' },
  { id: 'couples', label: 'Couples',     sub: 'Intimate · Hot',        icon: Heart,       color: '#f472b6', bg: '#3a1a2a', border: '#6a2a4a' },
  { id: 'sa',      label: 'SA Edition',  sub: 'Proudly Local',         icon: Flag,        color: '#34d399', bg: '#1a3a2a', border: '#2a5a3a' },
  { id: '30s',     label: '30 Seconds',  sub: 'Teams · Describe',      icon: Timer,       color: '#F5A623', bg: '#3a2a0a', border: '#5a4a0a' },
  { id: 'wild',    label: 'Wild Mix',    sub: 'Everything',            icon: Shuffle,     color: '#f5824a', bg: '#3a1a1a', border: '#5a2a1a' },
]

export default function HomeScreen({ onNavigate, theme, toggleTheme }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingBottom: 40 }}>

      <div style={{ background: 'var(--bg2)', borderBottom: '1px solid var(--border)', padding: '32px 24px 24px', textAlign: 'center', position: 'relative' }}>
        <button onClick={toggleTheme} style={{
          position: 'absolute', top: 20, right: 20,
          background: 'var(--bg3)', border: '1px solid var(--border)',
          borderRadius: 24, padding: '8px 14px', display: 'flex',
          alignItems: 'center', gap: 7, color: 'var(--text2)', fontSize: 13, transition: 'all 0.2s'
        }}>
          {theme === 'dark' ? <><Sun size={14} /> Light</> : <><Moon size={14} /> Dark</>}
        </button>

        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 8vw, 54px)', letterSpacing: 5, color: 'var(--gold)', lineHeight: 1 }}>
          SIP OR SPILL
        </div>
        <div style={{ fontSize: 'clamp(10px, 3vw, 12px)', color: 'var(--text2)', letterSpacing: 3, textTransform: 'uppercase', marginTop: 8 }}>
          The Ultimate Drinking Game App
        </div>
      </div>

      <div style={{ padding: '28px clamp(16px, 5vw, 150px) 0' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(13px, 4vw, 15px)', letterSpacing: 3, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 16 }}>
          Choose Your Game
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', 
          gap: 'clamp(12px, 4vw, 16px)' 
        }}>
          {menuItems.map(({ id, label, sub, icon: Icon, color, bg, border }) => (
            <button key={id} onClick={() => onNavigate(id)} style={{
              background: bg, border: `1px solid ${border}`, borderRadius: 16,
              padding: 'clamp(16px, 5vw, 22px) clamp(10px, 3vw, 14px)', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 'clamp(8px, 3vw, 10px)', transition: 'transform 0.15s, opacity 0.15s', color,
              minHeight: 'clamp(140px, 25vw, 160px)', height: 'auto'
            }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
              onTouchStart={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onTouchEnd={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Icon size={30} strokeWidth={1.5} style={{ width: 'clamp(24px, 6vw, 30px)', height: 'clamp(24px, 6vw, 30px)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(16px, 4.5vw, 19px)', letterSpacing: 2, lineHeight: 1 }}>{label}</div>
              <div style={{ fontSize: 'clamp(9px, 3vw, 10px)', letterSpacing: 1, textTransform: 'uppercase', opacity: 0.65, fontWeight: 500 }}>{sub}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
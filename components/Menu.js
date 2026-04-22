'use client'
import { ArrowLeft } from 'lucide-react'

export default function SubMenuScreen({ title, items, onBack, onSelect }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', background: 'var(--bg2)',
        borderBottom: '1px solid var(--border)'
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: '1px solid var(--border)',
          color: 'var(--text2)', padding: '7px 12px',
          borderRadius: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13
        }}>
          <ArrowLeft size={14} /> Back
        </button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 3, color: 'var(--text)' }}>{title}</div>
        <div style={{ width: 70 }} />
      </div>

      <div style={{ padding: '28px 48px 30px' }}>
        {items.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              style={{
                width: '100%', background: 'var(--bg2)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                padding: '18px 20px', marginBottom: 12,
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'border-color 0.2s', textAlign: 'left',
                minHeight: 90
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ width: 38, display: 'flex', justifyContent: 'center', color: item.color || 'var(--text2)' }}>
                <Icon size={26} strokeWidth={1.5} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, letterSpacing: 2, color: 'var(--text)' }}>{item.title}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: 10, padding: '2px 8px', borderRadius: 10, fontWeight: 600,
                      background: item.badge === '18+' ? '#3a1a1a' : item.badge === 'SA' ? '#1a3a2a' : '#2a1a3a',
                      color: item.badge === '18+' ? '#f5824a' : item.badge === 'SA' ? '#34d399' : '#c084fc',
                    }}>{item.badge}</span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{item.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
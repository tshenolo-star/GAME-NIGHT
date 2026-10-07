'use client'
import React, { useState } from 'react'
import { Surface } from '../../ui/Surface'
import { Button } from '../../ui/Button'
import { CARD_PACKS } from '@/lib/content/cards'
import { filterCards, shuffle } from '@/lib/engine/cardEngine'
import { EndGameButton } from './EndGameButton'
import { NoCardsNotice } from './NoCardsNotice'
import { GameplayProps } from './types'

export function NeverHaveIEverGameplay({ settings, players, onFinish, onBack }: GameplayProps) {
  const [deck] = useState(() => shuffle(filterCards(CARD_PACKS.neverHaveIEver, {
    audience: settings.audience, maxIntensity: settings.intensity, adultUnlocked: settings.adultUnlocked,
  })))
  const [index, setIndex] = useState(0)
  const [votes, setVotes] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState(false)

  const card = deck[index]
  const haveCount = Object.values(votes).filter(Boolean).length

  const vote = (playerId: string, have: boolean) => setVotes((v) => ({ ...v, [playerId]: have }))

  const next = () => {
    if (index + 1 >= deck.length) { onFinish(); return }
    setIndex((i) => i + 1)
    setVotes({})
    setRevealed(false)
  }

  if (!card) return <NoCardsNotice onBack={onBack} />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
        Card {index + 1} / {deck.length}
      </div>
      <Surface style={{ padding: 28, maxWidth: 440, width: '100%', textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 20, color: 'var(--text)', lineHeight: 1.5 }}>{card.text}</div>
      </Surface>

      {!revealed ? (
        <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {players.map((p) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 12px' }}>
              <span style={{ fontSize: 14, color: 'var(--text)' }}>{p.name}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => vote(p.id, true)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: votes[p.id] === true ? 'var(--gold)' : 'var(--bg3)', color: votes[p.id] === true ? '#1a1200' : 'var(--text2)' }}>I have</button>
                <button onClick={() => vote(p.id, false)} style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, background: votes[p.id] === false ? 'var(--bg4)' : 'var(--bg3)', color: 'var(--text2)' }}>I haven&apos;t</button>
              </div>
            </div>
          ))}
          <Button fullWidth disabled={Object.keys(votes).length < players.length} onClick={() => setRevealed(true)} style={{ marginTop: 8 }}>
            Reveal
          </Button>
        </div>
      ) : (
        <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)', marginBottom: 6 }}>
            {haveCount} of {players.length}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 20 }}>have done this</div>
          <Button fullWidth size="lg" onClick={next}>Next Card</Button>
        </div>
      )}
    </div>
  )
}

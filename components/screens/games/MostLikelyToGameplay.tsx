'use client'
import React, { useState } from 'react'
import { Undo2 } from 'lucide-react'
import { Surface } from '../../ui/Surface'
import { Button } from '../../ui/Button'
import { CARD_PACKS } from '@/lib/content/cards'
import { filterCards, shuffle } from '@/lib/engine/cardEngine'
import { EndGameButton } from './EndGameButton'
import { NoCardsNotice } from './NoCardsNotice'
import { GameplayProps } from './types'

export function MostLikelyToGameplay({ settings, players, onFinish, onBack }: GameplayProps) {
  const [deck] = useState(() => shuffle(filterCards(CARD_PACKS.mostLikelyTo, {
    audience: settings.audience, maxIntensity: settings.intensity, adultUnlocked: settings.adultUnlocked,
  })))
  const [index, setIndex] = useState(0)
  const [votes, setVotes] = useState<string[]>([])
  const [revealed, setRevealed] = useState(false)

  const card = deck[index]
  const voter = players[votes.length]
  const allVoted = votes.length >= players.length

  const tally = players.map((p) => ({
    player: p,
    count: votes.filter((v) => v === p.id).length,
  })).sort((a, b) => b.count - a.count)
  const topCount = tally[0]?.count ?? 0
  const topNames = tally.filter((t) => t.count === topCount).map((t) => t.player.name).join(' & ')

  const next = () => {
    if (index + 1 >= deck.length) { onFinish(); return }
    setIndex((i) => i + 1)
    setVotes([])
    setRevealed(false)
  }

  if (!card) return <NoCardsNotice onBack={onBack} />

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>
          Prompt {index + 1} / {deck.length}
        </div>
        <Surface style={{ padding: 28, maxWidth: 440, width: '100%', textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 20, color: 'var(--text)', lineHeight: 1.5 }}>{card.text}</div>
        </Surface>

        {!revealed ? (
          <div style={{ width: '100%', maxWidth: 440 }}>
            {!allVoted ? (
              <>
                <div style={{ fontSize: 12, color: 'var(--text2)', textAlign: 'center' }}>
                  Vote {votes.length + 1} of {players.length}
                </div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--gold)', textAlign: 'center', margin: '4px 0 12px' }}>
                  {voter.name}, pick someone
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                  {players.filter((p) => p.id !== voter.id).map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setVotes((v) => [...v, p.id])}
                      style={{ padding: '10px 16px', borderRadius: 20, fontSize: 13, background: 'var(--bg3)', border: '1px solid var(--border2)', color: 'var(--text)' }}
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 13, color: 'var(--text2)', textAlign: 'center', marginBottom: 16 }}>
                Everyone has voted.
              </div>
            )}
            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="secondary" disabled={votes.length === 0} onClick={() => setVotes((v) => v.slice(0, -1))}>
                <Undo2 size={16} /> Undo
              </Button>
              <Button fullWidth disabled={!allVoted} onClick={() => setRevealed(true)}>Reveal Results</Button>
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 16 }}>
              {topNames} — {topCount} vote{topCount === 1 ? '' : 's'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
              {tally.filter((t) => t.count !== topCount).map(({ player, count }) => (
                <div key={player.id} style={{ fontSize: 13, color: 'var(--text2)' }}>{player.name} — {count}</div>
              ))}
            </div>
            <Button fullWidth size="lg" onClick={next}>Next Prompt</Button>
          </div>
        )}
      </div>
    </div>
  )
}

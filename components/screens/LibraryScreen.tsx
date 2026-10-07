'use client'
import React, { useMemo, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { GameIcon } from '../ui/Icon'
import { ScreenHeader, Surface } from '../ui/Surface'
import { Badge } from '../ui/Badge'
import { GameManifest, Audience } from '@/lib/engine/types'
import { GAME_MANIFESTS } from '@/lib/content/games/manifests'

const FILTER_CHIPS = [
  'All', 'Popular', 'Quick', 'Team', 'Word', 'Guessing', 'Acting', 'Drawing', 'Question', 'Dare', 'Party',
]

export function LibraryScreen({
  onBack,
  onSelectGame,
  initialAudience,
  favorites,
  onToggleFavorite,
  filterMode,
  recentIds = [],
}: {
  onBack: () => void
  onSelectGame: (id: string, audience?: Audience) => void
  initialAudience?: Audience
  favorites: string[]
  onToggleFavorite: (id: string) => void
  filterMode?: 'favorites' | 'recent'
  recentIds?: string[]
}) {
  const [query, setQuery] = useState('')
  const [chip, setChip] = useState('All')
  const [audienceFilter, setAudienceFilter] = useState<Audience | 'all'>(initialAudience ?? 'all')

  const games = useMemo(() => {
    const filtered = GAME_MANIFESTS.filter((g) => {
      if (filterMode === 'favorites' && !favorites.includes(g.id)) return false
      if (filterMode === 'recent' && !recentIds.includes(g.id)) return false
      if (audienceFilter !== 'all' && !g.audience.includes(audienceFilter)) return false
      if (chip !== 'All' && chip !== 'Popular') {
        const key = chip.toLowerCase()
        if (!g.gameType.some((t) => t.includes(key))) return false
      }
      if (query && !g.name.toLowerCase().includes(query.toLowerCase()) && !g.tagline.toLowerCase().includes(query.toLowerCase())) {
        return false
      }
      return true
    })
    if (filterMode !== 'recent') return filtered
    return [...filtered].sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id))
  }, [audienceFilter, chip, query, favorites, filterMode, recentIds])

  const title = filterMode === 'favorites' ? 'Favorites' : filterMode === 'recent' ? 'Recently Played' : 'Game Library'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <ScreenHeader title={title} onBack={onBack} />

      <div style={{ padding: '18px clamp(16px, 5vw, 60px) 30px' }}>
        {!filterMode && (
          <>
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} color="var(--text2)" style={{ position: 'absolute', left: 14, top: 13 }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..."
                style={{
                  width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '11px 14px 11px 38px', color: 'var(--text)', fontSize: 14,
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 12, marginBottom: 6 }}>
              {(['all', 'family', 'friends', 'couples', 'coworkers', 'adults'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAudienceFilter(a)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 600,
                    background: audienceFilter === a ? 'var(--gold)' : 'var(--bg3)',
                    color: audienceFilter === a ? '#1a1200' : 'var(--text2)',
                    border: '1px solid transparent', textTransform: 'capitalize',
                  }}
                >
                  {a === 'all' ? 'All' : a}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 16 }}>
              {FILTER_CHIPS.map((c) => (
                <button
                  key={c}
                  onClick={() => setChip(c)}
                  style={{
                    flexShrink: 0, padding: '6px 14px', borderRadius: 16, fontSize: 12,
                    background: chip === c ? 'var(--bg4)' : 'transparent',
                    color: chip === c ? 'var(--text)' : 'var(--text2)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {games.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text2)' }}>
            No games match yet — try a different filter.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 14 }}>
            {games.map((g) => (
              <GameCard
                key={g.id}
                game={g}
                isFavorite={favorites.includes(g.id)}
                onToggleFavorite={() => onToggleFavorite(g.id)}
                onClick={() => onSelectGame(g.id, audienceFilter === 'all' ? undefined : audienceFilter)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function GameCard({
  game, isFavorite, onToggleFavorite, onClick,
}: { game: GameManifest; isFavorite: boolean; onToggleFavorite: () => void; onClick: () => void }) {
  return (
    <Surface onClick={onClick} hoverAccent={game.accent} style={{ padding: 18, position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); onToggleFavorite() }}
        style={{ position: 'absolute', top: 12, right: 12, background: 'none' }}
      >
        <Star size={18} fill={isFavorite ? 'var(--gold)' : 'none'} color={isFavorite ? 'var(--gold)' : 'var(--text3)'} />
      </button>
      <div style={{ color: game.accent, marginBottom: 10 }}>
        <GameIcon name={game.icon} size={28} />
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, letterSpacing: 1.5, color: 'var(--text)', marginBottom: 4 }}>
        {game.name}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10, lineHeight: 1.4 }}>{game.tagline}</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {game.audience.includes('adults') && <Badge kind="18+">18+</Badge>}
        {game.audience.includes('family') && <Badge kind="family">Family</Badge>}
        <Badge>{game.durationMinutes[0]}–{game.durationMinutes[1]} min</Badge>
      </div>
    </Surface>
  )
}

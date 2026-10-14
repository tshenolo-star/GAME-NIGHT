'use client'
import React from 'react'
import { Eye, EyeOff, ExternalLink, Music, Square, Play } from 'lucide-react'
import { Surface } from '../../../ui/Surface'
import { Button } from '../../../ui/Button'
import { Track } from '@/lib/content/tracks'

function mask(text: string) {
  return '•'.repeat(Math.min(Math.max(text.length, 4), 12))
}

function AnswerRow({ label, value, shown, solved }: { label: string; value: string; shown: boolean; solved: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1.5 }}>{label}</span>
      <span style={{ fontSize: 15, color: solved ? '#34d399' : 'var(--text)', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>
        {shown ? value : mask(value)}
      </span>
    </div>
  )
}

export function TrackPanel({
  track, number, total, shown, artistSolved, titleSolved, previewStatus, playing, onToggleShown, onTogglePreview,
}: {
  track: Track
  number: number
  total: number
  shown: boolean
  artistSolved: boolean
  titleSolved: boolean
  previewStatus: 'loading' | 'ready' | 'missing'
  playing: boolean
  onToggleShown: () => void
  onTogglePreview: () => void
}) {
  const query = encodeURIComponent(`${track.artist} ${track.title}`)

  return (
    <Surface style={{ padding: 20, width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 14 }}>
        <Music size={22} color="var(--gold)" />
        <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Randomized Track #{number} of {total}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
        <Button variant="secondary" disabled={previewStatus !== 'ready'} style={{ flex: '1 1 140px' }} onClick={onTogglePreview}>
          {previewStatus === 'loading' && 'Loading song…'}
          {previewStatus === 'missing' && 'No preview'}
          {previewStatus === 'ready' && (playing ? <><Square size={14} /> Stop</> : <><Play size={14} /> Play song</>)}
        </Button>
        <a
          href={`https://www.youtube.com/results?search_query=${query}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: '1 1 140px', minHeight: 44, borderRadius: 12, fontSize: 14, fontWeight: 600,
            background: 'var(--red)', color: '#fff', textDecoration: 'none',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '0 12px',
          }}
        >
          <ExternalLink size={14} /> Open YouTube
        </a>
      </div>

      <div style={{ fontSize: 11, color: 'var(--text2)', textAlign: 'center', marginBottom: 6 }}>
        {previewStatus === 'missing' ? 'No preview found for this one. Use Open YouTube.' : '30-second previews via Apple. Open YouTube for the full song.'}
      </div>

      <AnswerRow label="Artist (10 pts)" value={track.artist} shown={shown || artistSolved} solved={artistSolved} />
      <AnswerRow label="Song title (10 pts)" value={track.title} shown={shown || titleSolved} solved={titleSolved} />

      <button
        type="button"
        onClick={onToggleShown}
        style={{ marginTop: 12, minHeight: 40, width: '100%', background: 'none', border: '1px solid var(--border2)', borderRadius: 10, color: 'var(--text2)', fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      >
        {shown ? <><EyeOff size={14} /> Hide answers</> : <><Eye size={14} /> Host: show answers</>}
      </button>
    </Surface>
  )
}

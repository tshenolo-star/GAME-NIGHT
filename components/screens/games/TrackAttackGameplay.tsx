'use client'
import React, { useEffect, useRef, useState } from 'react'
import { Trophy } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { shuffle } from '@/lib/engine/cardEngine'
import { playCue } from '@/lib/engine/sound'
import { findPreviewUrl } from '@/lib/engine/songPreview'
import { TRACKS } from '@/lib/content/tracks'
import { EndGameButton } from './EndGameButton'
import { ContestantChips } from './trackAttack/ContestantChips'
import { TrackPanel } from './trackAttack/TrackPanel'
import { GameplayProps } from './types'

const TRACKS_PER_ROUND = 5
const ROUND_SECONDS = 180
const ARTIST_POINTS = 10
const TITLE_POINTS = 10
const WRONG_PENALTY = -10
const TAG_PENALTY = -5

type Phase = 'ready' | 'playing' | 'done'
type PreviewStatus = 'loading' | 'ready' | 'missing'

export function TrackAttackGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const [queue] = useState(() => shuffle(TRACKS).slice(0, TRACKS_PER_ROUND))
  const [phase, setPhase] = useState<Phase>('ready')
  const [index, setIndex] = useState(0)
  const [artistSolved, setArtistSolved] = useState(false)
  const [titleSolved, setTitleSolved] = useState(false)
  const [shown, setShown] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [scores, setScores] = useState<Record<string, number>>({})
  const [preview, setPreview] = useState<{ status: PreviewStatus; url: string | null }>({ status: 'loading', url: null })
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const track = queue[index]

  const stopPreview = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setPlaying(false)
  }

  useEffect(() => () => audioRef.current?.pause(), [])

  useEffect(() => {
    if (!track) return
    const controller = new AbortController()
    setPreview({ status: 'loading', url: null })
    findPreviewUrl(track.artist, track.title, controller.signal)
      .then((url) => { if (!controller.signal.aborted) setPreview({ status: url ? 'ready' : 'missing', url }) })
      .catch(() => { if (!controller.signal.aborted) setPreview({ status: 'missing', url: null }) })
    return () => controller.abort()
  }, [track])

  const finishRound = () => {
    stopPreview()
    timer.reset()
    setPhase('done')
  }

  const timer = useTimer({
    durationSec: ROUND_SECONDS,
    onTimeUp: () => {
      playCue('timeUp', settings.soundEnabled)
      finishRound()
    },
  })

  const togglePreview = () => {
    if (playing) { stopPreview(); return }
    if (!preview.url) return
    const audio = new Audio(preview.url)
    const release = () => { if (audioRef.current === audio) { audioRef.current = null; setPlaying(false) } }
    audio.onended = release
    audio.onerror = release
    audioRef.current = audio
    setPlaying(true)
    audio.play().catch(release)
  }

  const apply = (delta: number) => {
    if (!selectedId) return
    setScores((s) => ({ ...s, [selectedId]: (s[selectedId] ?? 0) + delta }))
    onScorePlayer(selectedId, delta > 0 ? 'correct' : 'penalty', delta)
    const team = teams.find((t) => t.playerIds.includes(selectedId))
    if (team) onScoreTeam(team.id, delta > 0 ? 'correct' : 'penalty', delta)
    if (delta > 0) playCue('correct', settings.soundEnabled)
    setSelectedId(null)
  }

  const nextTrack = () => {
    stopPreview()
    if (index + 1 >= TRACKS_PER_ROUND) { finishRound(); return }
    setIndex((i) => i + 1)
    setArtistSolved(false)
    setTitleSolved(false)
    setShown(false)
    setSelectedId(null)
  }

  const start = () => {
    setPhase('playing')
    timer.start()
  }

  const ranking = [...players]
    .map((p) => ({ player: p, score: scores[p.id] ?? 0 }))
    .sort((a, b) => b.score - a.score)

  const penaltyButton = (label: string, delta: number) => (
    <Button variant="ghost" disabled={!selectedId} style={{ flex: '1 1 120px' }} onClick={() => apply(delta)}>{label}</Button>
  )

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Track {Math.min(index + 1, TRACKS_PER_ROUND)} / {TRACKS_PER_ROUND}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, gap: 16 }}>
        {phase === 'ready' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 400, width: '100%' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 10 }}>Host, you&apos;re up</div>
            <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 22 }}>
              Hold the device. Play each track, listen for the artist and title, then tap who got it right.
              You have {ROUND_SECONDS} seconds for {TRACKS_PER_ROUND} tracks.
            </div>
            <Button fullWidth size="lg" onClick={start}>Start — {ROUND_SECONDS}s</Button>
          </Surface>
        )}

        {phase === 'playing' && track && (
          <div style={{ width: '100%', maxWidth: 440, display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
            <TimerDisplay timer={timer} accent={game.accent} />
            <TrackPanel
              track={track}
              number={index + 1}
              total={TRACKS_PER_ROUND}
              shown={shown}
              artistSolved={artistSolved}
              titleSolved={titleSolved}
              previewStatus={preview.status}
              playing={playing}
              onToggleShown={() => setShown((v) => !v)}
              onTogglePreview={togglePreview}
            />
            <div style={{ fontSize: 12, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: 1.5 }}>Who answered?</div>
            <ContestantChips players={players} scores={scores} selectedId={selectedId} onSelect={setSelectedId} />
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', width: '100%' }}>
              <Button
                variant="secondary"
                disabled={!selectedId || artistSolved}
                style={{ flex: '1 1 150px' }}
                onClick={() => { apply(ARTIST_POINTS); setArtistSolved(true) }}
              >
                Correct Artist (+{ARTIST_POINTS})
              </Button>
              <Button
                variant="secondary"
                disabled={!selectedId || titleSolved}
                style={{ flex: '1 1 150px' }}
                onClick={() => { apply(TITLE_POINTS); setTitleSolved(true) }}
              >
                Correct Title (+{TITLE_POINTS})
              </Button>
              {penaltyButton(`Wrong (${WRONG_PENALTY})`, WRONG_PENALTY)}
              {penaltyButton(`Tag (${TAG_PENALTY})`, TAG_PENALTY)}
            </div>
            <Button fullWidth size="lg" onClick={nextTrack}>
              {index + 1 >= TRACKS_PER_ROUND ? 'Finish Round' : 'Next Track'}
            </Button>
          </div>
        )}

        {phase === 'done' && (
          <Surface style={{ padding: 28, textAlign: 'center', maxWidth: 400, width: '100%' }}>
            <Trophy size={40} color="var(--gold)" />
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--gold)', margin: '10px 0 16px' }}>Round over</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 22 }}>
              {ranking.map(({ player, score }, i) => (
                <div key={player.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, color: 'var(--text)' }}>
                  <span>{i + 1}. {player.name}</span>
                  <span style={{ color: score < 0 ? 'var(--red)' : 'var(--gold)' }}>{score} pts</span>
                </div>
              ))}
            </div>
            <Button fullWidth size="lg" onClick={onFinish}>See Results</Button>
          </Surface>
        )}
      </div>
    </div>
  )
}

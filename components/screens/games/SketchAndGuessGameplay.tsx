'use client'
import React, { useRef, useState } from 'react'
import { EyeOff, Eye, Check, Eraser } from 'lucide-react'
import { Button } from '../../ui/Button'
import { Surface } from '../../ui/Surface'
import { TimerDisplay } from '../../ui/TimerDisplay'
import { useTimer } from '@/lib/engine/useTimer'
import { CARD_PACKS } from '@/lib/content/cards'
import { useGameRound } from './useGameRound'
import { playCue } from '@/lib/engine/sound'
import { EndGameButton } from './EndGameButton'
import { GameplayProps } from './types'

const TURN_SECONDS = 60
const COLORS = ['#f0f0f0', '#E8294A', '#F5A623', '#34d399', '#60a5fa', '#c084fc']

export function SketchAndGuessGameplay({ game, settings, players, teams, onScoreTeam, onScorePlayer, onFinish }: GameplayProps) {
  const { currentPlayer, nextTurn, deck, award } = useGameRound(players, teams, CARD_PACKS.wordBank, settings, { onScoreTeam, onScorePlayer })
  const [phase, setPhase] = useState<'privacy' | 'reveal' | 'playing' | 'turnEnd'>('privacy')
  const [word, setWord] = useState<string | null>(null)
  const [guessed, setGuessed] = useState(false)
  const [color, setColor] = useState(COLORS[0])
  const [turnsPlayed, setTurnsPlayed] = useState(0)
  const MAX_TURNS = Math.max(players.length, 6)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const drawing = useRef(false)

  const timer = useTimer({
    durationSec: TURN_SECONDS,
    onTimeUp: () => { playCue('timeUp', settings.soundEnabled); setGuessed(false); setPhase('turnEnd') },
  })

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget
    const rect = canvas.getBoundingClientRect()
    const scaleX = rect.width > 0 ? canvas.width / rect.width : 1
    const scaleY = rect.height > 0 ? canvas.height / rect.height : 1
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    drawing.current = true
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = pos(e)
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = pos(e)
    ctx.strokeStyle = color
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  const onPointerUp = () => { drawing.current = false }

  const reveal = () => {
    const c = deck.draw()
    setWord(c?.text ?? '—')
    setPhase('reveal')
  }
  const startDrawing = () => { clearCanvas(); setGuessed(false); setPhase('playing'); timer.start() }
  const markCorrect = () => { playCue('correct', settings.soundEnabled); timer.pause(); setGuessed(true); setPhase('turnEnd') }

  const endTurn = () => {
    if (guessed) award('correct', 1)
    const next = turnsPlayed + 1
    setTurnsPlayed(next)
    timer.reset()
    clearCanvas()
    if (next >= MAX_TURNS) { onFinish(); return }
    nextTurn()
    setPhase('privacy')
    setWord(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <EndGameButton onEnd={onFinish} />
      <div style={{ padding: '14px 20px', textAlign: 'center', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 2 }}>
          Turn {turnsPlayed + 1} / {MAX_TURNS}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
        {phase === 'privacy' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <EyeOff size={36} color="var(--text2)" style={{ marginBottom: 14 }} />
            <div style={{ fontSize: 15, color: 'var(--text2)', marginBottom: 6 }}>Pass the device to</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 24 }}>
              {currentPlayer?.name ?? 'the next player'}
            </div>
            <Button fullWidth onClick={reveal}><Eye size={16} /> Reveal my word</Button>
          </Surface>
        )}

        {phase === 'reveal' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 12, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10 }}>Draw this</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, color: 'var(--text)', marginBottom: 24 }}>{word}</div>
            <Button fullWidth size="lg" onClick={startDrawing}>Start Drawing — {TURN_SECONDS}s</Button>
          </Surface>
        )}

        {phase === 'playing' && (
          <>
            <TimerDisplay timer={timer} accent={game.accent} />
            <canvas
              ref={canvasRef}
              width={340}
              height={300}
              style={{ background: '#111', borderRadius: 12, border: '1px solid var(--border2)', touchAction: 'none', width: '100%', maxWidth: 380 }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
            <div style={{ display: 'flex', gap: 8 }}>
              {COLORS.map((c) => (
                <button key={c} onClick={() => setColor(c)} style={{ width: 26, height: 26, borderRadius: 13, background: c, border: color === c ? '2px solid var(--gold)' : '2px solid transparent' }} />
              ))}
              <button onClick={clearCanvas} style={{ width: 26, height: 26, borderRadius: 13, background: 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eraser size={14} color="var(--text2)" />
              </button>
            </div>
            <Button fullWidth onClick={markCorrect}><Check size={16} /> They Got It</Button>
          </>
        )}

        {phase === 'turnEnd' && (
          <Surface style={{ padding: 32, textAlign: 'center', maxWidth: 380 }}>
            <div style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 6 }}>{guessed ? 'Nice sketch!' : "Time's up!"}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, color: 'var(--gold)', marginBottom: 24 }}>
              {guessed ? '+1 point' : 'No points'}
            </div>
            <Button fullWidth size="lg" onClick={endTurn}>Next Turn</Button>
          </Surface>
        )}
      </div>
    </div>
  )
}

'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseTimerOptions {
  durationSec: number
  onTimeUp?: () => void
  autoStart?: boolean
}

export interface TimerControls {
  secondsLeft: number
  isRunning: boolean
  isPaused: boolean
  start: () => void
  pause: () => void
  resume: () => void
  reset: (newDurationSec?: number) => void
}

export function useTimer({ durationSec, onTimeUp, autoStart = false }: UseTimerOptions): TimerControls {
  const [secondsLeft, setSecondsLeft] = useState(durationSec)
  const [started, setStarted] = useState(autoStart)
  const [isPaused, setIsPaused] = useState(false)
  const onTimeUpRef = useRef(onTimeUp)
  const isRunning = started && secondsLeft > 0

  useEffect(() => {
    onTimeUpRef.current = onTimeUp
  })

  useEffect(() => {
    if (!isRunning || isPaused) return
    const id = setInterval(() => setSecondsLeft((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [isRunning, isPaused])

  useEffect(() => {
    if (started && secondsLeft === 0) onTimeUpRef.current?.()
  }, [started, secondsLeft])

  const start = useCallback(() => {
    setSecondsLeft(durationSec)
    setIsPaused(false)
    setStarted(true)
  }, [durationSec])

  const pause = useCallback(() => setIsPaused(true), [])
  const resume = useCallback(() => setIsPaused(false), [])
  const reset = useCallback(
    (newDurationSec?: number) => {
      setStarted(false)
      setIsPaused(false)
      setSecondsLeft(newDurationSec ?? durationSec)
    },
    [durationSec]
  )

  return { secondsLeft, isRunning, isPaused, start, pause, resume, reset }
}

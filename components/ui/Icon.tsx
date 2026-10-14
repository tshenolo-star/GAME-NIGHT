'use client'
// Central icon registry — manifests and content reference icons by name
// (string) so they stay pure data; this is the one place that resolves a
// name to an actual lucide-react component.
import {
  Flame, HelpCircle, Users, Timer, Paintbrush, Shuffle, Heart, Flag,
  Layers, PartyPopper, EyeOff, MessageSquare, Target, ArrowLeft, Sun, Moon,
  Star, Clock, Trophy, Play, Pause, RotateCcw, Check, X, ChevronRight,
  Search, Settings, Info, Sparkles, Users2, Award, Dices, Bomb, Music, type LucideIcon,
} from 'lucide-react'

// 'Drama' isn't in lucide-react@1.8.0 — map it to the closest available icon.
const ICONS: Record<string, LucideIcon> = {
  Flame, HelpCircle, Users, Timer, Paintbrush, Shuffle, Heart, Flag,
  Layers, PartyPopper, EyeOff, MessageSquare, Target, ArrowLeft, Sun, Moon,
  Star, Clock, Trophy, Play, Pause, RotateCcw, Check, X, ChevronRight,
  Search, Settings, Info, Sparkles, Users2, Award, Dices, Bomb, Music,
  Drama: Sparkles,
}

export function GameIcon({
  name,
  size = 24,
  strokeWidth = 1.5,
  color,
  className,
}: {
  name: string
  size?: number
  strokeWidth?: number
  color?: string
  className?: string
}) {
  const Cmp = ICONS[name] ?? Star
  return <Cmp size={size} strokeWidth={strokeWidth} color={color} className={className} />
}

'use client'
import React, { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { ScreenHeader } from '../ui/Surface'
import { Button } from '../ui/Button'
import { AdultGateModal } from '../AdultGateModal'
import { CARD_PACKS } from '@/lib/content/cards'
import { FIRST_ADULT_TIER, SETUP_INTENSITIES, audienceHasCards, poolSize as countCards, settingsForAudience } from '@/lib/engine/setupDefaults'
import { numTeamsFromMode } from '@/lib/engine/teamEngine'
import { Audience, GameManifest, GameSettings, Intensity, Player, TeamMode } from '@/lib/engine/types'

const AUDIENCES: Audience[] = ['family', 'friends', 'couples', 'coworkers', 'adults']

function chipStyle(active: boolean, disabled = false): React.CSSProperties {
  return {
    padding: '8px 14px', borderRadius: 16, fontSize: 13, fontWeight: 600,
    background: active ? 'var(--gold)' : 'var(--bg3)',
    color: active ? '#1a1200' : 'var(--text2)',
    border: '1px solid transparent', textTransform: 'capitalize',
    opacity: disabled ? 0.35 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
  }
}

export function SetupScreen({
  game, settings, players, openAdultGate = false, onBack, onChangeSettings, onChangePlayers, onContinue,
}: {
  game: GameManifest
  settings: GameSettings
  players: Player[]
  openAdultGate?: boolean
  onBack: () => void
  onChangeSettings: (s: Partial<GameSettings>) => void
  onChangePlayers: (p: Player[]) => void
  onContinue: () => void
}) {
  const [nameInput, setNameInput] = useState('')
  const [showAdultGate, setShowAdultGate] = useState(openAdultGate)
  const [gateTargetsAdults, setGateTargetsAdults] = useState(openAdultGate)

  const pack = CARD_PACKS[game.cardPackId] ?? []

  const poolSize = (audience: Audience, intensity: Intensity) =>
    countCards(pack, audience, intensity, settings.adultUnlocked)

  const addPlayer = () => {
    const name = nameInput.trim()
    if (!name) return
    onChangePlayers([...players, { id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, name }])
    setNameInput('')
  }
  const removePlayer = (id: string) => onChangePlayers(players.filter((p) => p.id !== id))

  const teamCount = game.requiresTeams ? numTeamsFromMode(settings.teamMode) : 0
  const enoughForTeams = players.length >= teamCount
  const usesCards = pack.length > 0
  const hasCards = !usesCards || poolSize(settings.audience, settings.intensity) > 0
  const canContinue =
    players.length >= game.minPlayers &&
    (!game.maxPlayers || players.length <= game.maxPlayers) &&
    enoughForTeams &&
    hasCards

  const selectAudience = (a: Audience) => {
    if (a === 'adults' && !settings.adultUnlocked) {
      setGateTargetsAdults(true)
      setShowAdultGate(true)
      return
    }
    onChangeSettings(settingsForAudience(pack, settings, a))
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      <ScreenHeader title="Setup" onBack={onBack} />

      <div style={{ padding: '20px clamp(16px, 5vw, 24px) 110px', maxWidth: 560, margin: '0 auto' }}>
        <Section title="Who's Playing">
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addPlayer() }}
              placeholder="Player name"
              style={{
                flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
              }}
            />
            <Button onClick={addPlayer} size="md"><Plus size={16} /></Button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {players.map((p) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg3)',
                border: '1px solid var(--border2)', borderRadius: 16, padding: '6px 10px 6px 14px', fontSize: 13,
              }}>
                {p.name}
                <button onClick={() => removePlayer(p.id)} aria-label={`Remove ${p.name}`} style={{ background: 'none', border: 'none', display: 'flex', padding: 9 }}>
                  <X size={14} color="var(--text2)" />
                </button>
              </div>
            ))}
          </div>
          {players.length < game.minPlayers && (
            <div style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>
              {game.name} needs at least {game.minPlayers} players.
            </div>
          )}
          {players.length >= game.minPlayers && !enoughForTeams && (
            <div style={{ fontSize: 12, color: 'var(--orange)', marginTop: 8 }}>
              {teamCount} teams need at least {teamCount} players.
            </div>
          )}
        </Section>

        {usesCards && (
          <>
          <Section title="Audience">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {AUDIENCES.filter((a) => game.audience.includes(a) && audienceHasCards(pack, a)).map((a) => (
                <button key={a} onClick={() => selectAudience(a)} style={chipStyle(settings.audience === a)}>
                  {a}{a === 'adults' && !settings.adultUnlocked ? ' 🔒' : ''}
                </button>
              ))}
            </div>
          </Section>

          <Section title="Intensity">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SETUP_INTENSITIES.map((i, idx) => {
                const locked = idx >= FIRST_ADULT_TIER && !settings.adultUnlocked
                const empty = !locked && poolSize(settings.audience, i) === 0
                return (
                  <button
                    key={i}
                    disabled={empty}
                    onClick={() => {
                      if (!locked) { onChangeSettings({ intensity: i }); return }
                      setGateTargetsAdults(false)
                      setShowAdultGate(true)
                    }}
                    style={chipStyle(settings.intensity === i, empty)}
                  >
                    {i}{locked ? ' 🔒' : ''}
                  </button>
                )
              })}
            </div>
          </Section>
          </>
        )}

        {game.requiresTeams && (
          <Section title="Teams">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(['ffa', 2, 3, 4] as TeamMode[]).map((mode) => (
                <button key={String(mode)} onClick={() => onChangeSettings({ teamMode: mode })} style={chipStyle(settings.teamMode === mode)}>
                  {mode === 'ffa' ? 'Free-for-all' : `${mode} Teams`}
                </button>
              ))}
            </div>
          </Section>
        )}

        <Section title="Extras">
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)', marginBottom: 10 }}>
            <input type="checkbox" checked={settings.usePunishments} onChange={(e) => onChangeSettings({ usePunishments: e.target.checked })} style={{ width: 18, height: 18 }} />
            Loser punishment at the end of the game
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text)' }}>
            <input type="checkbox" checked={settings.soundEnabled} onChange={(e) => onChangeSettings({ soundEnabled: e.target.checked })} style={{ width: 18, height: 18 }} />
            Sound cues
          </label>
        </Section>

        <Button fullWidth size="lg" disabled={!canContinue} onClick={onContinue} style={{ marginTop: 10 }}>
          {teamCount > 0 ? 'Shuffle Teams' : 'Start Playing'}
        </Button>
      </div>

      {showAdultGate && (
        <AdultGateModal
          onConfirm={() => {
            const unlocked = { ...settings, adultUnlocked: true }
            onChangeSettings(gateTargetsAdults ? { adultUnlocked: true, ...settingsForAudience(pack, unlocked, 'adults') } : { adultUnlocked: true })
            setShowAdultGate(false)
          }}
          onCancel={() => setShowAdultGate(false)}
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 26 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, letterSpacing: 2, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  )
}

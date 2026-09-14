'use client'

import { useEffect, useMemo, useState, useSyncExternalStore } from 'react'
import { ChevronDown, Clock3, Plus, RotateCcw } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Timeline } from '@/components/Timeline'
import { TimezonePicker } from '@/components/TimezonePicker'
import { DEFAULT_SELECTED, TIMEZONES } from '@/lib/timezones'

const noopSubscribe = () => () => {}

/** True only once hydrated on the client — avoids baking a build-time clock reading into the prerendered HTML. */
function useMounted(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false)
}

export default function TimezoneBuddyPage() {
  const mounted = useMounted()
  const [anchor, setAnchor] = useState<Date>(() => new Date())
  const [reference, setReference] = useState<Date | null>(null)
  const [selected, setSelected] = useState<string[]>(DEFAULT_SELECTED)
  const [hour12, setHour12] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => setAnchor(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const isLive = reference === null
  const referenceDate = reference ?? anchor

  const toggleZone = (id: string) => {
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const zones = useMemo(
    () => selected.map((id) => TIMEZONES.find((t) => t.id === id)).filter((t): t is (typeof TIMEZONES)[number] => Boolean(t)),
    [selected],
  )

  return (
    <div className="min-h-screen px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size={38} />
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl" style={{ color: 'var(--color-ink)' }}>
                Timezone Buddy
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                Drag the line to find a time that works everywhere
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setHour12((v) => !v)}
              className="flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors"
              style={{ borderColor: 'var(--color-border-strong)', background: 'var(--color-surface)', color: 'var(--color-ink-soft)' }}
            >
              <Clock3 aria-hidden="true" className="h-4 w-4" />
              {hour12 ? '12H' : '24H'}
            </button>

            <button
              type="button"
              onClick={() => setReference(null)}
              disabled={isLive}
              aria-label="Reset to the current time"
              className="flex h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-bold transition-colors disabled:cursor-default"
              style={
                isLive
                  ? { borderColor: 'var(--color-accent)', background: 'var(--color-accent-soft)', color: 'var(--color-accent-ink)' }
                  : { borderColor: 'var(--color-border-strong)', background: 'var(--color-surface)', color: 'var(--color-ink-soft)' }
              }
            >
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
              {isLive ? 'Live' : 'Jump to now'}
            </button>

            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              aria-expanded={pickerOpen}
              className="flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-bold transition-colors"
              style={{ background: 'var(--color-ink)', color: 'var(--color-bg-raised)' }}
            >
              <Plus aria-hidden="true" className="h-4 w-4" />
              Add city
              <ChevronDown
                aria-hidden="true"
                className="h-4 w-4 transition-transform"
                style={{ transform: pickerOpen ? 'rotate(180deg)' : 'none' }}
              />
            </button>
          </div>
        </header>

        {pickerOpen && (
          <section
            aria-label="Add a timezone"
            className="rounded-2xl border p-4 sm:p-5"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-raised)', boxShadow: 'var(--shadow-card)' }}
          >
            <TimezonePicker now={anchor} selected={selected} onToggle={toggleZone} />
          </section>
        )}

        {!mounted ? (
          <div
            aria-hidden="true"
            className="h-72 animate-pulse rounded-2xl border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
          />
        ) : (
          <Timeline
            zones={zones}
            anchor={anchor}
            referenceDate={referenceDate}
            hour12={hour12}
            onScrub={setReference}
            onRemove={toggleZone}
          />
        )}

        <footer className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium" style={{ color: 'var(--color-ink-faint)' }}>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-day)' }} />
            Day
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-twilight)' }} />
            Twilight
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: 'var(--color-night)' }} />
            Night
          </span>
          <span className="flex items-center gap-1.5">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: 'var(--color-accent)' }} />
            {isLive ? 'Current moment' : 'Selected moment'}
          </span>
        </footer>
      </div>
    </div>
  )
}

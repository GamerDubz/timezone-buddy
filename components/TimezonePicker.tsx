'use client'

import { useId, useMemo, useState } from 'react'
import { Search, Plus, Check } from 'lucide-react'
import { REGIONS, TIMEZONES, type TimezoneEntry } from '@/lib/timezones'
import { formatOffsetLabel, getOffsetMinutes } from '@/lib/time'

interface TimezonePickerProps {
  now: Date
  selected: string[]
  onToggle: (id: string) => void
}

export function TimezonePicker({ now, selected, onToggle }: TimezonePickerProps) {
  const [query, setQuery] = useState('')
  const searchId = useId()

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = (t: TimezoneEntry) =>
      !q || t.city.toLowerCase().includes(q) || t.country.toLowerCase().includes(q) || t.tz.toLowerCase().includes(q)
    return REGIONS.map((region) => ({
      region,
      entries: TIMEZONES.filter((t) => t.region === region && matches(t)),
    })).filter((g) => g.entries.length > 0)
  }, [query])

  return (
    <div className="rise-in">
      <label htmlFor={searchId} className="sr-only">
        Search cities or countries
      </label>
      <div className="relative mb-4">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
          style={{ color: 'var(--color-ink-faint)' }}
        />
        <input
          id={searchId}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city or country…"
          className="w-full rounded-xl border py-3 pl-10 pr-4 text-base outline-none transition-colors"
          style={{
            background: 'var(--color-surface)',
            borderColor: 'var(--color-border-strong)',
            color: 'var(--color-ink)',
          }}
        />
      </div>

      {grouped.length === 0 && (
        <p className="py-6 text-center text-sm" style={{ color: 'var(--color-ink-faint)' }}>
          No cities match &ldquo;{query}&rdquo;.
        </p>
      )}

      <div className="max-h-80 space-y-5 overflow-y-auto pr-1">
        {grouped.map((group) => (
          <div key={group.region}>
            <h3
              className="mb-2 text-xs font-bold uppercase tracking-[0.14em]"
              style={{ color: 'var(--color-ink-faint)' }}
            >
              {group.region}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.entries.map((tz) => {
                const active = selected.includes(tz.id)
                const offset = formatOffsetLabel(getOffsetMinutes(now, tz.tz))
                return (
                  <button
                    key={tz.id}
                    type="button"
                    onClick={() => onToggle(tz.id)}
                    aria-pressed={active}
                    className="flex min-h-11 items-center gap-2 rounded-full border px-3.5 py-2 text-left text-sm font-semibold transition-colors"
                    style={
                      active
                        ? { background: 'var(--color-ink)', borderColor: 'var(--color-ink)', color: 'var(--color-bg-raised)' }
                        : { background: 'var(--color-surface)', borderColor: 'var(--color-border-strong)', color: 'var(--color-ink-soft)' }
                    }
                  >
                    {active ? <Check aria-hidden="true" className="h-4 w-4" /> : <Plus aria-hidden="true" className="h-4 w-4" />}
                    <span>{tz.city}</span>
                    <span
                      className="tabular text-xs font-medium"
                      style={{ color: active ? 'rgba(238,246,251,0.75)' : 'var(--color-ink-faint)' }}
                    >
                      {offset}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

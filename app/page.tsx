'use client'

import { useState, useEffect } from 'react'

const TIMEZONES = [
  { id: 'UTC', label: 'UTC', tz: 'UTC', flag: '🌐' },
  { id: 'NY', label: 'New York', tz: 'America/New_York', flag: '🗽' },
  { id: 'LA', label: 'Los Angeles', tz: 'America/Los_Angeles', flag: '🌴' },
  { id: 'Chicago', label: 'Chicago', tz: 'America/Chicago', flag: '🏙' },
  { id: 'London', label: 'London', tz: 'Europe/London', flag: '🎡' },
  { id: 'Paris', label: 'Paris', tz: 'Europe/Paris', flag: '🗼' },
  { id: 'Berlin', label: 'Berlin', tz: 'Europe/Berlin', flag: '🐻' },
  { id: 'Dubai', label: 'Dubai', tz: 'Asia/Dubai', flag: '🏙' },
  { id: 'Mumbai', label: 'Mumbai', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'Singapore', label: 'Singapore', tz: 'Asia/Singapore', flag: '🦁' },
  { id: 'Tokyo', label: 'Tokyo', tz: 'Asia/Tokyo', flag: '⛩' },
  { id: 'Sydney', label: 'Sydney', tz: 'Australia/Sydney', flag: '🦘' },
  { id: 'Auckland', label: 'Auckland', tz: 'Pacific/Auckland', flag: '🥝' },
  { id: 'Toronto', label: 'Toronto', tz: 'America/Toronto', flag: '🍁' },
  { id: 'SaoPaulo', label: 'São Paulo', tz: 'America/Sao_Paulo', flag: '🇧🇷' },
]

function formatInTz(date: Date, tz: string, format: 'time' | 'full' | 'date'): string {
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  }
  if (format === 'date') {
    return date.toLocaleDateString('en-US', { timeZone: tz, weekday: 'short', month: 'short', day: 'numeric' })
  }
  return date.toLocaleString('en-US', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: true, weekday: 'short', month: 'short', day: 'numeric' })
}

function getOffset(tz: string): string {
  try {
    const now = new Date()
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: tz }))
    const diff = Math.round((tzDate.getTime() - new Date(now.toLocaleString('en-US', { timeZone: 'UTC' })).getTime()) / 3600000)
    return `UTC${diff >= 0 ? '+' : ''}${diff}`
  } catch { return 'UTC' }
}

function isDaytime(date: Date, tz: string): boolean {
  const h = parseInt(date.toLocaleTimeString('en-US', { timeZone: tz, hour: '2-digit', hour12: false }))
  return h >= 7 && h < 20
}

export default function TimezoneBuddyPage() {
  const [now, setNow] = useState(new Date())
  const [selected, setSelected] = useState<string[]>(['UTC', 'NY', 'London', 'Tokyo', 'Sydney'])
  const [referenceTime, setReferenceTime] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const toggle = (id: string) => {
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])
  }

  const filtered = TIMEZONES.filter((t) => !search || t.label.toLowerCase().includes(search.toLowerCase()) || t.tz.toLowerCase().includes(search.toLowerCase()))
  const selectedTzs = TIMEZONES.filter((t) => selected.includes(t.id))

  // If user set a reference time, parse it
  const refDate = referenceTime ? (() => {
    const [h, m] = referenceTime.split(':').map(Number)
    const d = new Date(now)
    d.setHours(h, m, 0, 0)
    return d
  })() : now

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-neutral-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Timezone Buddy</h1>
            <p className="text-sm text-neutral-500">World clock & meeting time planner</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs text-neutral-500">Reference time (local):</label>
            <input
              type="time"
              value={referenceTime}
              onChange={(e) => setReferenceTime(e.target.value)}
              className="bg-[#1a1a1a] border border-[#2e2e2e] rounded px-2 py-1.5 text-sm outline-none focus:border-blue-500 text-neutral-200"
              aria-label="Reference time"
            />
            {referenceTime && <button onClick={() => setReferenceTime('')} className="text-xs text-neutral-600 hover:text-neutral-300">Clear</button>}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Clock cards */}
          <div className="lg:col-span-2 space-y-3">
            {selectedTzs.map((tz) => {
              const daytime = isDaytime(refDate, tz.tz)
              return (
                <div
                  key={tz.id}
                  className={`flex items-center gap-4 rounded-xl p-4 border transition-colors ${daytime ? 'bg-[#1a1a1a] border-[#2e2e2e]' : 'bg-[#121218] border-[#252535]'}`}
                >
                  <div className="text-2xl w-8">{tz.flag}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-200">{tz.label}</span>
                      <span className="text-xs text-neutral-600">{getOffset(tz.tz)}</span>
                      <span className="text-xs text-neutral-700">{daytime ? '☀️' : '🌙'}</span>
                    </div>
                    <div className="text-xs text-neutral-600 mt-0.5">{formatInTz(refDate, tz.tz, 'date')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black tabular-nums text-neutral-100 tracking-tight">
                      {formatInTz(refDate, tz.tz, 'time')}
                    </div>
                    <div className="text-xs text-neutral-600">{tz.tz}</div>
                  </div>
                  <button onClick={() => toggle(tz.id)} className="text-neutral-700 hover:text-red-400 transition-colors ml-2" aria-label={`Remove ${tz.label}`}>×</button>
                </div>
              )
            })}
            {selectedTzs.length === 0 && (
              <div className="text-center py-12 text-neutral-700">Select time zones from the list →</div>
            )}
          </div>

          {/* Selector */}
          <div>
            <div className="mb-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cities…"
                className="w-full bg-[#1a1a1a] border border-[#2e2e2e] rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 text-neutral-200"
                aria-label="Search time zones"
              />
            </div>
            <div className="space-y-1 max-h-[70vh] overflow-y-auto">
              {filtered.map((tz) => {
                const active = selected.includes(tz.id)
                return (
                  <button
                    key={tz.id}
                    onClick={() => toggle(tz.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${active ? 'bg-blue-600/20 border border-blue-600/40' : 'bg-[#1a1a1a] border border-transparent hover:border-[#2e2e2e]'}`}
                    aria-pressed={active}
                  >
                    <span>{tz.flag}</span>
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm ${active ? 'text-blue-300' : 'text-neutral-300'}`}>{tz.label}</div>
                      <div className="text-xs text-neutral-600 truncate">{getOffset(tz.tz)}</div>
                    </div>
                    <span className="text-xs font-mono text-neutral-500 shrink-0">{formatInTz(now, tz.tz, 'time').slice(0, 5)}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

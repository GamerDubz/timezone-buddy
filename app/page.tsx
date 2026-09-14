'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'

type CityZone = {
  id: string
  label: string
  country: string
  tz: string
  flag: string
}

const GLOBAL_ZONES: CityZone[] = [
  { id: 'UTC', label: 'UTC Universal', country: 'Prime Meridian', tz: 'UTC', flag: '🌐' },
  { id: 'SF', label: 'San Francisco', country: 'United States', tz: 'America/Los_Angeles', flag: '🌁' },
  { id: 'NY', label: 'New York', country: 'United States', tz: 'America/New_York', flag: '🗽' },
  { id: 'Chicago', label: 'Chicago', country: 'United States', tz: 'America/Chicago', flag: '🏙️' },
  { id: 'Toronto', label: 'Toronto', country: 'Canada', tz: 'America/Toronto', flag: '🍁' },
  { id: 'SaoPaulo', label: 'São Paulo', country: 'Brazil', tz: 'America/Sao_Paulo', flag: '🇧🇷' },
  { id: 'London', label: 'London', country: 'United Kingdom', tz: 'Europe/London', flag: '🎡' },
  { id: 'Paris', label: 'Paris', country: 'France', tz: 'Europe/Paris', flag: '🗼' },
  { id: 'Berlin', label: 'Berlin', country: 'Germany', tz: 'Europe/Berlin', flag: '🐻' },
  { id: 'Amsterdam', label: 'Amsterdam', country: 'Netherlands', tz: 'Europe/Amsterdam', flag: '🚲' },
  { id: 'CapeTown', label: 'Cape Town', country: 'South Africa', tz: 'Africa/Johannesburg', flag: '🇿🇦' },
  { id: 'Dubai', label: 'Dubai', country: 'UAE', tz: 'Asia/Dubai', flag: '🏙️' },
  { id: 'Mumbai', label: 'Mumbai', country: 'India', tz: 'Asia/Kolkata', flag: '🇮🇳' },
  { id: 'Singapore', label: 'Singapore', country: 'Singapore', tz: 'Asia/Singapore', flag: '🦁' },
  { id: 'Tokyo', label: 'Tokyo', country: 'Japan', tz: 'Asia/Tokyo', flag: '⛩️' },
  { id: 'Seoul', label: 'Seoul', country: 'South Korea', tz: 'Asia/Seoul', flag: '🇰🇷' },
  { id: 'Sydney', label: 'Sydney', country: 'Australia', tz: 'Australia/Sydney', flag: '🦘' },
  { id: 'Auckland', label: 'Auckland', country: 'New Zealand', tz: 'Pacific/Auckland', flag: '🥝' },
]

function getZoneHour(baseDate: Date, tz: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: 'numeric',
    hour12: false,
  }).formatToParts(baseDate)
  const hr = parts.find((p) => p.type === 'hour')?.value
  return parseInt(hr ?? '0', 10) % 24
}

function formatInZone(date: Date, tz: string, format: 'time' | 'full' | 'date' | 'day'): string {
  if (format === 'time') {
    return date.toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }
  if (format === 'date') {
    return date.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }
  if (format === 'day') {
    return date.toLocaleDateString('en-US', {
      timeZone: tz,
      weekday: 'long',
    })
  }
  return date.toLocaleString('en-US', {
    timeZone: tz,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function getOffsetBadge(tz: string): string {
  try {
    const now = new Date()
    const utcStr = now.toLocaleString('en-US', { timeZone: 'UTC' })
    const tzStr = now.toLocaleString('en-US', { timeZone: tz })
    const diffHours = Math.round((new Date(tzStr).getTime() - new Date(utcStr).getTime()) / 3600000)
    return `UTC${diffHours >= 0 ? '+' : ''}${diffHours}`
  } catch {
    return 'UTC'
  }
}

export default function TimezoneBuddyPage() {
  const [realTime, setRealTime] = useState(new Date())
  const [selectedIds, setSelectedIds] = useState<string[]>(['UTC', 'SF', 'NY', 'London', 'Tokyo'])
  const [hourOffset, setHourOffset] = useState<number>(0) // Slider shift in hours from realTime
  const [copied, setCopied] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setInterval(() => setRealTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Effective simulated date
  const effectiveDate = useMemo(() => {
    return new Date(realTime.getTime() + hourOffset * 3600000)
  }, [realTime, hourOffset])

  const selectedZones = useMemo(() => {
    return selectedIds
      .map((id) => GLOBAL_ZONES.find((z) => z.id === id))
      .filter((z): z is CityZone => Boolean(z))
  }, [selectedIds])

  // Count how many team members are currently within 9 AM to 6 PM (business hours)
  const overlapStats = useMemo(() => {
    let inBusinessHours = 0
    selectedZones.forEach((z) => {
      const hr = getZoneHour(effectiveDate, z.tz)
      if (hr >= 9 && hr < 18) inBusinessHours++
    })
    return {
      inHours: inBusinessHours,
      total: selectedZones.length,
      pct: selectedZones.length > 0 ? Math.round((inBusinessHours / selectedZones.length) * 100) : 0,
    }
  }, [selectedZones, effectiveDate])

  const toggleCity = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds((prev) => prev.filter((x) => x !== id))
      }
    } else {
      setSelectedIds((prev) => [...prev, id])
    }
  }

  const copyMeetingInvite = useCallback(() => {
    const lines = [
      `📅 Proposed Meeting Schedule (${formatInZone(effectiveDate, 'UTC', 'date')}):`,
      '----------------------------------------',
    ]
    selectedZones.forEach((z) => {
      lines.push(
        `${z.flag} ${z.label}: ${formatInZone(effectiveDate, z.tz, 'time')} (${getOffsetBadge(z.tz)})`
      )
    })
    navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [selectedZones, effectiveDate])

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-slate-50 to-slate-100/60 text-slate-900 pb-16 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md px-6 py-3.5 shadow-xs">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 via-blue-600 to-amber-500 p-0.5 shadow-sm shadow-sky-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <svg className="w-5 h-5 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-slate-900">
                  Timezone <span className="text-sky-600">Buddy</span>
                </h1>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  Global Planner
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Live worldwide clock & distributed remote team meeting overlap calculator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyMeetingInvite}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
            >
              <span>{copied ? '✓ Copied to Clipboard!' : '📋 Copy Schedule Summary'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-8 flex-1 space-y-6">
        {/* Interactive Overlap Time Scrubber Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-md shadow-slate-200/40">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Interactive Meeting Overlap Finder
                </span>
                {hourOffset !== 0 && (
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Simulating {hourOffset > 0 ? `+${hourOffset}h` : `${hourOffset}h`}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">
                Drag the slider to test meeting times across all timezones simultaneously:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  overlapStats.pct >= 75
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : overlapStats.pct >= 50
                    ? 'bg-amber-50 text-amber-700 border-amber-300'
                    : 'bg-rose-50 text-rose-700 border-rose-300'
                }`}
              >
                <span>{overlapStats.pct >= 75 ? '🎉' : overlapStats.pct >= 50 ? '⚡' : '🌙'}</span>
                <span>
                  {overlapStats.inHours} of {overlapStats.total} team members in work hours ({overlapStats.pct}%)
                </span>
              </div>

              {hourOffset !== 0 && (
                <button
                  onClick={() => setHourOffset(0)}
                  className="text-xs text-sky-600 hover:text-sky-800 font-medium px-2 py-1 rounded hover:bg-sky-50 transition-colors cursor-pointer"
                >
                  Reset to Live
                </button>
              )}
            </div>
          </div>

          {/* Time Scrubber Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={-12}
              max={12}
              step={0.5}
              value={hourOffset}
              onChange={(e) => setHourOffset(parseFloat(e.target.value))}
              className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>-12 Hours Earlier</span>
              <span className="font-bold text-sky-600">
                {hourOffset === 0 ? '● Real-Time Now' : `Offset: ${hourOffset > 0 ? `+${hourOffset}` : hourOffset}h`}
              </span>
              <span>+12 Hours Later</span>
            </div>
          </div>
        </div>

        {/* Selected City Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {selectedZones.map((z) => {
            const hr = getZoneHour(effectiveDate, z.tz)
            const isWorkHour = hr >= 9 && hr < 18
            const isNight = hr < 7 || hr >= 22
            const isDawnDusk = !isWorkHour && !isNight

            return (
              <div
                key={z.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar inside card */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{z.flag}</span>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 tracking-tight leading-snug">
                          {z.label}
                        </h3>
                        <p className="text-[11px] text-slate-500">{z.country}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {getOffsetBadge(z.tz)}
                      </span>
                      {selectedZones.length > 1 && (
                        <button
                          onClick={() => toggleCity(z.id)}
                          className="text-slate-300 hover:text-rose-500 text-xs p-1 transition-colors cursor-pointer"
                          title="Remove city"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Main Large Clock */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
                        {formatInZone(effectiveDate, z.tz, 'time')}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isWorkHour
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : isNight
                            ? 'bg-slate-100 text-slate-600 border-slate-200'
                            : 'bg-amber-50 text-amber-700 border-amber-300'
                        }`}
                      >
                        {isWorkHour ? '☀️ Work Hours' : isNight ? '🌙 Sleeping' : '🌅 Morning / Eve'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {formatInZone(effectiveDate, z.tz, 'date')} · {formatInZone(effectiveDate, z.tz, 'day')}
                    </p>
                  </div>
                </div>

                {/* 24-Hour Daylight Ribbon */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span className="text-emerald-600">12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden flex relative bg-slate-100">
                    {/* Night 0-7 */}
                    <div className="w-[29.1%] h-full bg-slate-300" title="Night 00:00 - 07:00" />
                    {/* Dawn 7-9 */}
                    <div className="w-[8.3%] h-full bg-amber-300" title="Morning 07:00 - 09:00" />
                    {/* Work Hours 9-18 */}
                    <div className="w-[37.5%] h-full bg-emerald-400" title="Work Hours 09:00 - 18:00" />
                    {/* Dusk 18-22 */}
                    <div className="w-[16.6%] h-full bg-amber-300" title="Evening 18:00 - 22:00" />
                    {/* Night 22-24 */}
                    <div className="w-[8.5%] h-full bg-slate-300" title="Night 22:00 - 24:00" />

                    {/* Current pin */}
                    <div
                      className="absolute top-0 bottom-0 w-1.5 bg-sky-600 rounded-full shadow-xs -ml-0.5 ring-2 ring-white"
                      style={{ left: `${(hr / 24) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Add Cities Drawer / Selector */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="font-bold text-sm text-slate-900 tracking-tight">
                Add Global Hubs to Planner
              </h2>
              <p className="text-xs text-slate-500">
                Click any city to add or remove it from your team dashboard
              </p>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city or country..."
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 w-48"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {GLOBAL_ZONES.filter(
              (c) =>
                c.label.toLowerCase().includes(search.toLowerCase()) ||
                c.country.toLowerCase().includes(search.toLowerCase())
            ).map((c) => {
              const isSelected = selectedIds.includes(c.id)
              return (
                <button
                  key={c.id}
                  onClick={() => toggleCity(c.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-sky-50 border-sky-400 text-sky-800 font-semibold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({getOffsetBadge(c.tz)})</span>
                  {isSelected && <span className="text-sky-600 font-bold">✓</span>}
                </button>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}

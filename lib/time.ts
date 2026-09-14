const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS

/** Number of hourly cells rendered on the horizontal timeline. */
export const TIMELINE_HOURS = 24
/** How many hours before the reference instant the timeline starts. */
export const TIMELINE_LEAD_HOURS = 5

/**
 * Offset of a timezone from UTC, in minutes, at a given instant.
 * Uses Intl instead of string-diffing so DST transitions resolve correctly.
 */
export function getOffsetMinutes(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value
    return acc
  }, {})
  const asUTC = Date.UTC(
    Number(parts.year), Number(parts.month) - 1, Number(parts.day),
    Number(parts.hour), Number(parts.minute), Number(parts.second),
  )
  return Math.round((asUTC - date.getTime()) / MINUTE_MS)
}

export function formatOffsetLabel(minutes: number): string {
  const sign = minutes >= 0 ? '+' : '-'
  const abs = Math.abs(minutes)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  return m === 0 ? `UTC${sign}${h}` : `UTC${sign}${h}:${String(m).padStart(2, '0')}`
}

/** Fractional hour-of-day (0–24) for a timezone at a given instant. */
export function getLocalHourFraction(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hourCycle: 'h23', hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value
    return acc
  }, {})
  return Number(parts.hour) + Number(parts.minute) / 60 + Number(parts.second) / 3600
}

export function formatClock(date: Date, tz: string, hour12: boolean): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12,
  })
}

export function formatDateLabel(date: Date, tz: string): string {
  return date.toLocaleDateString('en-US', {
    timeZone: tz, weekday: 'short', month: 'short', day: 'numeric',
  })
}

export function formatCellLabel(date: Date, tz: string, hour12: boolean): string {
  return date.toLocaleTimeString('en-US', {
    timeZone: tz, hour: 'numeric', hour12,
  }).replace(' ', '')
}

/** Daylight classification for shading a timeline cell. day / twilight / night. */
export function daylightBand(hour: number): 'day' | 'twilight' | 'night' {
  if (hour >= 7 && hour < 18) return 'day'
  if ((hour >= 5 && hour < 7) || (hour >= 18 && hour < 20)) return 'twilight'
  return 'night'
}

/**
 * The timeline window is anchored to the live clock (`anchor`), truncated to
 * the hour with a few hours of lead-in, so the window doesn't jump around
 * while a reference instant is being scrubbed within it.
 */
function windowStart(anchor: Date): number {
  const base = new Date(anchor)
  base.setMinutes(0, 0, 0)
  return base.getTime() - TIMELINE_LEAD_HOURS * HOUR_MS
}

/** Builds the array of instants (one per hour) shown along the shared timeline. */
export function buildTimelineCells(anchor: Date): Date[] {
  const start = windowStart(anchor)
  return Array.from({ length: TIMELINE_HOURS }, (_, i) => new Date(start + i * HOUR_MS))
}

/** Position (0–1) of `pointDate` along the timeline anchored at `anchor`. */
export function nowFraction(anchor: Date, pointDate: Date): number {
  const start = windowStart(anchor)
  const totalMs = TIMELINE_HOURS * HOUR_MS
  return Math.min(1, Math.max(0, (pointDate.getTime() - start) / totalMs))
}

/** Maps a fraction (0–1) along the timeline anchored at `anchor` back to an absolute instant. */
export function fractionToDate(anchor: Date, fraction: number): Date {
  const start = windowStart(anchor)
  const totalMs = TIMELINE_HOURS * HOUR_MS
  const clamped = Math.min(1, Math.max(0, fraction))
  return new Date(start + clamped * totalMs)
}

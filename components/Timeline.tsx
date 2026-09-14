'use client'

import { useCallback, useRef, type KeyboardEvent, type PointerEvent } from 'react'
import { X } from 'lucide-react'
import type { TimezoneEntry } from '@/lib/timezones'
import {
  buildTimelineCells,
  daylightBand,
  formatCellLabel,
  formatClock,
  formatDateLabel,
  formatOffsetLabel,
  getLocalHourFraction,
  getOffsetMinutes,
  nowFraction,
  fractionToDate,
  TIMELINE_HOURS,
} from '@/lib/time'

interface TimelineProps {
  zones: TimezoneEntry[]
  anchor: Date
  referenceDate: Date
  hour12: boolean
  onScrub: (date: Date) => void
  onRemove: (id: string) => void
}

const BAND_BG: Record<'day' | 'twilight' | 'night', string> = {
  day: 'var(--color-day)',
  twilight: 'var(--color-twilight)',
  night: 'var(--color-night)',
}

export function Timeline({ zones, anchor, referenceDate, hour12, onScrub, onRemove }: TimelineProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const fraction = nowFraction(anchor, referenceDate)
  const cells = buildTimelineCells(anchor)

  const scrubFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const f = (clientX - rect.left) / rect.width
      onScrub(fractionToDate(anchor, f))
    },
    [anchor, onScrub],
  )

  const handlePointerDown = (e: PointerEvent) => {
    draggingRef.current = true
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    scrubFromClientX(e.clientX)
  }
  const handlePointerMove = (e: PointerEvent) => {
    if (!draggingRef.current) return
    scrubFromClientX(e.clientX)
  }
  const endDrag = () => {
    draggingRef.current = false
  }

  const nudge = (deltaMinutes: number) => {
    onScrub(new Date(referenceDate.getTime() + deltaMinutes * 60_000))
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); nudge(-15) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); nudge(15) }
    else if (e.key === 'Home') { e.preventDefault(); onScrub(anchor) }
  }

  if (zones.length === 0) {
    return (
      <div
        className="rise-in flex flex-col items-center gap-2 rounded-2xl border py-16 text-center"
        style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', color: 'var(--color-ink-faint)' }}
      >
        <p className="text-base font-semibold" style={{ color: 'var(--color-ink-soft)' }}>No timezones on the board yet</p>
        <p className="max-w-xs text-sm">Add a city below to line it up on the shared timeline.</p>
      </div>
    )
  }

  const labelColumn = 'clamp(9rem, 26vw, 15rem)'

  return (
    <div
      className="rise-in relative rounded-2xl border"
      style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}
    >
      <div className="overflow-hidden rounded-2xl grid" style={{ gridTemplateColumns: `${labelColumn} 1fr` }}>
        {zones.map((tz, i) => {
          const offset = formatOffsetLabel(getOffsetMinutes(referenceDate, tz.tz))
          const showLast = i === zones.length - 1
          return (
            <div className="contents" key={tz.id}>
              <div
                className="flex flex-col justify-center gap-1 border-b px-4 py-4 sm:px-5"
                style={{ borderColor: showLast ? 'transparent' : 'var(--color-border)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold" style={{ color: 'var(--color-ink)' }}>{tz.city}</p>
                    <p className="truncate text-xs font-medium" style={{ color: 'var(--color-ink-faint)' }}>{tz.country}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(tz.id)}
                    aria-label={`Remove ${tz.city} from the board`}
                    className="flex h-11 w-11 shrink-0 -m-2 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-bg)]"
                    style={{ color: 'var(--color-ink-faint)' }}
                  >
                    <X aria-hidden="true" className="h-4 w-4" />
                  </button>
                </div>
                <div className="tabular text-2xl font-bold leading-none sm:text-3xl" style={{ color: 'var(--color-ink)' }}>
                  {formatClock(referenceDate, tz.tz, hour12)}
                </div>
                <p className="text-xs font-medium" style={{ color: 'var(--color-ink-faint)' }}>
                  {formatDateLabel(referenceDate, tz.tz)} · {offset}
                </p>
              </div>

              <div
                className="relative border-b"
                style={{ borderColor: showLast ? 'transparent' : 'var(--color-border)' }}
              >
                <div className="flex h-full">
                  {cells.map((cellDate, idx) => {
                    const hour = Math.floor(getLocalHourFraction(cellDate, tz.tz))
                    const band = daylightBand(hour)
                    const showLabel = idx % 4 === 0
                    return (
                      <div
                        key={idx}
                        className="relative flex-1 border-r last:border-r-0"
                        style={{ background: BAND_BG[band], borderColor: 'rgba(11,32,54,0.06)' }}
                      >
                        {showLabel && (
                          <span
                            className="tabular pointer-events-none absolute bottom-1 left-1 text-[11px] font-semibold"
                            style={{ color: band === 'night' ? 'rgba(238,246,251,0.75)' : 'var(--color-ink-soft)' }}
                          >
                            {formatCellLabel(cellDate, tz.tz, hour12)}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Shared scrub control, overlaid across the full track column. */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Reference time"
        aria-valuemin={0}
        aria-valuemax={TIMELINE_HOURS * 60}
        aria-valuenow={Math.round(fraction * TIMELINE_HOURS * 60)}
        aria-valuetext={formatClock(referenceDate, Intl.DateTimeFormat().resolvedOptions().timeZone, hour12)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        className="absolute inset-y-0 cursor-ew-resize touch-none"
        style={{ left: labelColumn, right: 0, top: 0 }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 bottom-0 w-px"
          style={{ left: `${fraction * 100}%`, background: 'var(--color-accent)' }}
        >
          <span
            className="absolute -top-1 -translate-x-1/2 rounded-full"
            style={{ width: 12, height: 12, background: 'var(--color-accent)', boxShadow: '0 0 0 3px var(--color-accent-soft)' }}
          />
        </div>
      </div>
    </div>
  )
}

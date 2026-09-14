interface LogoProps {
  size?: number
  className?: string
}

/**
 * Original mark for Timezone Buddy: a horizon line with a day arc (solid)
 * and a night arc (dashed) meeting at the skyline, and a single marker
 * riding the arc to represent "the current moment" travelling through the
 * day/night cycle. Not a clock face, not a globe.
 */
export function Logo({ size = 32, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Timezone Buddy"
    >
      <path
        d="M5 21a11 11 0 0 1 22 0"
        stroke="var(--color-ink, #0b2036)"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
      <path
        d="M5 21a11 11 0 0 1 11-11 11 11 0 0 1 11 11"
        stroke="var(--color-ink, #0b2036)"
        strokeOpacity="0.28"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeDasharray="0.5 4.2"
        transform="rotate(180 16 21)"
      />
      <line x1="2" y1="21" x2="30" y2="21" stroke="var(--color-ink, #0b2036)" strokeWidth="2.25" strokeLinecap="round" />
      <circle cx="23.7" cy="12.4" r="3" fill="var(--color-accent, #d98c3f)" />
    </svg>
  )
}

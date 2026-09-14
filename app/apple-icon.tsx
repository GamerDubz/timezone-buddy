import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'
export const dynamic = 'force-static'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#eaf4fb',
        }}
      >
        <svg width="128" height="128" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 21a11 11 0 0 1 22 0" stroke="#0b2036" strokeWidth="2.4" strokeLinecap="round" />
          <path
            d="M5 21a11 11 0 0 1 11-11 11 11 0 0 1 11 11"
            stroke="#0b2036"
            strokeOpacity={0.28}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="0.5 4.2"
            transform="rotate(180 16 21)"
          />
          <line x1="3" y1="21" x2="29" y2="21" stroke="#0b2036" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="23.7" cy="12.4" r="3.1" fill="#d98c3f" />
        </svg>
      </div>
    ),
    { ...size },
  )
}

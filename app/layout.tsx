import type { Metadata } from 'next'
import { Nunito, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bodyFont = Nunito({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
})

const monoFont = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono-tabular',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Timezone Buddy — World Clock & Meeting Planner',
  description: 'Compare time zones on a shared horizontal timeline, spot day and night at a glance, and drag to find a meeting time that works everywhere.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${monoFont.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  )
}

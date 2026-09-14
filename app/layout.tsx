import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Timezone Buddy — World Clock & Team Overlap Planner',
  description:
    'Real-time global clock and visual timezone planner. Discover meeting overlap hours across distributed remote teams without math.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full bg-slate-50 text-slate-900 antialiased selection:bg-sky-500/20 selection:text-sky-900`}>
        {children}
      </body>
    </html>
  )
}

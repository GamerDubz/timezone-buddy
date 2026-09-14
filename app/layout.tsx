import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
const inter = Inter({ subsets: ['latin'] })
export const metadata: Metadata = {
  title: 'Timezone Buddy — World Clock & Meeting Planner',
  description: 'Track multiple time zones, find meeting times, and compare clocks across the world.',
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className={`${inter.className} antialiased`}>{children}</body></html>)
}

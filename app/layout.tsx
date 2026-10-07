import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Game Night',
  description: 'One party game platform. Every group. Every night.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>{children}</body>
    </html>
  )
}

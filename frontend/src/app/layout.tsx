import type { Metadata } from 'next'

import AuthSessionProvider from '#utils/providers/AuthSessionProvider'
import ReactQueryProvider from '#utils/providers/ReactQueryProvider'

import './globals.css'
import type { Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Instagram dev',
  description:
    'Explore the world of Instagram with this authentic clone, created by gwjun.',
  generator: 'Next.js',
  keywords: ['inhastagram', 'instagram', 'clone', 'next14', 'nestjs', 'pwa'],
  authors: [{ name: 'GWjun' }],
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/images/static/icon512_rounded.png' },
    { rel: 'icon', url: '/images/static/instagram-logo-fill.svg' },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <AuthSessionProvider>
        <ReactQueryProvider>
          <body>{children}</body>
        </ReactQueryProvider>
      </AuthSessionProvider>
    </html>
  )
}

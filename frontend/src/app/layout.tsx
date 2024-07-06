import type { Metadata } from 'next'

import AuthSessionProvider from '#utils/providers/AuthSessionProvider'
import ReactQueryProvider from '#utils/providers/ReactQueryProvider'

import './globals.css'

export const metadata: Metadata = {
  title: 'Instagram dev',
  description:
    'Explore the world of Instagram with this authentic clone, created by gwjun.',
  icons: {
    icon: '/images/static/instagram-logo-fill.svg',
  },
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

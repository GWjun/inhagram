import { ReactNode } from 'react'

import type { Metadata, Viewport } from 'next'

import AuthSessionProvider from '#components/provider/utilProvider/AuthSessionProvider'
import ReactQueryProvider from '#components/provider/utilProvider/ReactQueryProvider'
import { Toaster } from '#components/ui/toaster'
import LoadingIcon from 'components/feature/common/loadingIcon'

import './globals.css'

export const metadata: Metadata = {
  title: 'Inhagram',
  description:
    'Explore the world of Instagram with this authentic clone, created by gwjun.',
  generator: 'Next.js',
  keywords: [
    'Inhagram',
    'inhastagram',
    'instagram',
    'clone',
    'next14',
    'nestjs',
    'pwa',
  ],
  authors: [{ name: 'GWjun' }],
  manifest: '/manifest.json',
  icons: [
    { rel: 'apple-touch-icon', url: '/images/static/icon512_maskable.png' },
    { rel: 'icon', url: '/images/static/instagram-logo-fill.svg' },
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <AuthSessionProvider>
        <ReactQueryProvider>
          <body>
            <div>
              {children}
              <Toaster />
            </div>
          </body>
          <LoadingIcon />
        </ReactQueryProvider>
      </AuthSessionProvider>
    </html>
  )
}

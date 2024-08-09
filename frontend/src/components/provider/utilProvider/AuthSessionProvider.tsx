'use client'

import { ReactNode } from 'react'

import { SessionProvider } from 'next-auth/react'

function AuthSessionProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}

export default AuthSessionProvider

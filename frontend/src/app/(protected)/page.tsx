'use client'

import { useEffect } from 'react'

import { signOut, useSession } from 'next-auth/react'

import { useUserStore } from '#store/client/user.store'

function Page() {
  const { setUserName, setUserEmail } = useUserStore()

  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      session.user?.name && setUserName(session.user.name)
      session.user?.email && setUserEmail(session.user.email)
    }
  }, [session, setUserName, setUserEmail])

  return (
    <div className="flex min-h-full justify-center items-center">
      <div>Main Page</div>
      <button onClick={() => signOut({ callbackUrl: '/login' })}>
        로그아웃
      </button>
    </div>
  )
}

export default Page

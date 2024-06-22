'use client'

import { signOut } from 'next-auth/react'

function Page() {
  return (
    <div>
      <div>Main Page</div>
      <button onClick={() => signOut({ callbackUrl: '/login' })}>
        로그아웃
      </button>
    </div>
  )
}

export default Page

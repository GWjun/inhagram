'use client'

import Link from 'next/link'

import { useEffect, useState } from 'react'

import NotExist from '#components/layout/notexist'
import withPwaEvent from '#hooks/withPwaEvent'

interface UserResponse {
  nickname: string
}

function Page() {
  const [users, setUsers] = useState<UserResponse[]>()

  useEffect(() => {
    async function getUsers() {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      )
      if (!response.ok) return <NotExist />

      setUsers((await response.json()) as UserResponse[])
    }

    getUsers()
  }, [])

  return (
    <section className="flex min-h-full justify-center mt-9">
      <div className="flex flex-col w-full max-w-[630px]">
        <span className="font-semibold self-start">회원님을 위한 추천</span>
        {users?.map((user) => (
          <Link
            href={`/${user.nickname}`}
            key={user.nickname}
            className="py-2 my-2"
          >
            {user.nickname}
          </Link>
        ))}
      </div>
    </section>
  )
}

export default withPwaEvent(Page)

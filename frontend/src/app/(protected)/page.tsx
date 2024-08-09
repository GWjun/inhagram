import { getServerSession, Session } from 'next-auth'

import UserList from '#components/feature/user/userList'
import NotExist from '#components/layout/notexist'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '#pages/api/auth/[...nextauth]'
import { SimpleUser } from '#types/user.type'
import authFetch from '#utils/authFetch'

import PwaEventComponent from './pwa'

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session
  let users

  try {
    users = await authFetch<SimpleUser[]>(
      `/users`,
      {
        cache: 'no-cache',
      },
      session,
    )
  } catch (error) {
    return <NotExist />
  }
  return (
    <div className="flex min-h-full justify-center mt-9">
      <div className="flex flex-col w-full max-w-[600px]">
        <span className="font-semibold mb-2 px-4 md:mb-5 md:px-0">
          회원님을 위한 추천
        </span>
        <ul>
          {users?.map((user) => <UserList key={user.nickname} user={user} />)}
        </ul>
      </div>
      <PwaEventComponent />
    </div>
  )
}

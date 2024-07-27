import Link from 'next/link'

import { getServerSession, Session } from 'next-auth'

import ImageWithLoad from '#components/feature/imageWithLoad'
import NotExist from '#components/layout/notexist'
import { Avatar } from '#components/ui/avatar'
import { Button } from '#components/ui/button'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '#pages/api/auth/[...nextauth]'
import authFetch from '#utils/authFetch'

interface UserResponse {
  nickname: string
  image: string
}

export default async function Page() {
  const session = (await getServerSession(authOptions)) as Session
  let users

  try {
    users = await authFetch<UserResponse[]>(
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
    <section className="flex min-h-full justify-center mt-9">
      <div className="flex flex-col w-full max-w-[600px]">
        <span className="font-semibold mb-2 px-4 md:mb-5 md:px-0">
          회원님을 위한 추천
        </span>
        {users?.map((user) => (
          <Link
            href={`/${user.nickname}`}
            key={user.nickname}
            className="flex justify-between items-center py-2 px-4 my-2"
          >
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 group-hover:scale-110 transition duration-200 ease-in-out">
                <ImageWithLoad
                  src={user.image || '/images/assets/avatar-default.jpg'}
                  alt="user avatar"
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                  loading="eager"
                />
              </Avatar>
              {user.nickname}
            </div>
            <Button className="px-5">팔로우</Button>
          </Link>
        ))}
      </div>
    </section>
  )
}

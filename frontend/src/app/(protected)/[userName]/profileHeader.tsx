import { getServerSession } from 'next-auth'

import AvatarInput from '#components/feature/image/avatarInput'
import FollowButton from '#components/feature/user/followButton'
import { Avatar, AvatarImage } from '#components/ui/avatar'
import { Button } from '#components/ui/button'
import { UserImageResponse } from '#store/client/user.store'
import { UserCountType } from '#types/user.type'

import MobileLists from './mobileLists'

export default async function ProfileHeader({
  userName,
}: {
  userName: string
}) {
  const session = await getServerSession()
  const sameUser = session?.user?.name === userName

  const userDataResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/image`,
    { cache: 'no-cache' },
  )
  if (!userDataResponse.ok) return null
  const userData = (await userDataResponse.json()) as UserImageResponse

  const userCountResponse = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/count`,
    { cache: 'no-store' },
  )
  if (!userCountResponse.ok) return null
  const userCount = (await userCountResponse.json()) as UserCountType

  return (
    <header className="grow max-w-[975px] w-full pt-[30px]">
      <div className="flex w-full h-[150px] px-5 md:mb-11">
        <div className="flex relative items-center justify-center md:w-[283px] mr-7">
          <Avatar className="w-20 h-20 md:w-[150px] md:h-full group-hover:scale-110 transition duration-200 ease-in-out border border-gray-200">
            {sameUser ? (
              <AvatarInput />
            ) : (
              <AvatarImage
                src={userData.path || 'images/assets/avatar-default.jpg'}
              />
            )}
          </Avatar>
        </div>
        <div className="flex flex-col justify-center w-full md:w-auto md:justify-start">
          <div className="flex flex-col md:flex-row md:items-center h-[48.5px] mb-5 gap-4">
            <div className="text-xl">{userName}</div>
            {sameUser ? (
              <Button variant="gray" className="w-full max-w-[250px] md:w-auto">
                프로필 설정
              </Button>
            ) : (
              <FollowButton
                followeeId={userData.id}
                className="w-full max-w-[250px] md:w-auto"
              />
            )}
          </div>
          <ul className="hidden md:flex gap-10 mb-[22.5px]">
            <li>
              게시물{' '}
              <span className="font-semibold">{userCount.postCount}</span>
            </li>
            <li>
              팔로워{' '}
              <span className="font-semibold">{userCount.followerCount}</span>
            </li>
            <li>
              팔로우{' '}
              <span className="font-semibold">{userCount.followeeCount}</span>
            </li>
          </ul>
          <div className="hidden md:flex h-[18px]">
            <span className="text-sm font-semibold">{userName}</span>
          </div>
        </div>
      </div>
      <MobileLists userName={userName} userCount={userCount} />
    </header>
  )
}

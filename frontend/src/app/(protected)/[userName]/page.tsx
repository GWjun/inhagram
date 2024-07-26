import { getServerSession } from 'next-auth'

import AvatarInput from '#components/feature/avatarInput'
import NotExist from '#components/layout/notexist'
import { Avatar, AvatarImage } from '#components/ui/avatar'
import { Button } from '#components/ui/button'
import { UserImageResponse } from '#store/client/user.store'

import UserPosts from './userPosts'

export default async function UserProfile({
  params: { userName },
}: {
  params: { userName: string }
}) {
  const session = await getServerSession()
  const sameUser = session?.user?.name === userName

  const isUserExist = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/id`,
  )
  if (!isUserExist.ok) return <NotExist />

  let userImageUrl
  if (!sameUser) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/image`,
      { cache: 'no-cache' },
    )
    userImageUrl = (await response.json()) as UserImageResponse
  }

  const MobileComponent = () => (
    <>
      <div className="flex md:hidden w-full h-[18px] px-5 mb-5">
        <span className="text-sm font-semibold">{userName}</span>
      </div>
      <ul className="flex md:hidden w-full justify-around gap-10 py-3 border-t border-t-gray-300">
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">게시물</span>
          <span className="text-sm font-semibold">0</span>
        </li>
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">팔로워</span>
          <span className="text-sm font-semibold">0</span>
        </li>
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">팔로우</span>
          <span className="text-sm font-semibold">0</span>
        </li>
      </ul>
    </>
  )

  return (
    <section className="flex flex-col min-h-full justify-center items-center">
      <div className="grow max-w-[975px] w-full px-5 pt-[30px]">
        <header className="w-full">
          <div className="flex w-full h-[150px] md:mb-11">
            <div className="flex relative items-center justify-center md:w-[283px] mr-7">
              <Avatar className="w-20 h-20 md:w-[150px] md:h-full group-hover:scale-110 transition duration-200 ease-in-out border border-gray-200">
                {sameUser ? (
                  <AvatarInput />
                ) : (
                  <AvatarImage
                    src={
                      userImageUrl?.path || 'images/assets/avatar-default.jpg'
                    }
                  />
                )}
              </Avatar>
            </div>
            <div className="flex flex-col justify-center w-full md:w-auto md:justify-start">
              <div className="flex flex-col md:flex-row md:items-center h-[48.5px] mb-5 gap-4">
                <div className="text-xl">{userName}</div>
                {sameUser ? (
                  <Button
                    variant="gray"
                    className="w-full max-w-[250px] md:w-auto"
                  >
                    프로필 설정
                  </Button>
                ) : (
                  <Button className="w-full max-w-[250px] md:w-auto">
                    팔로우
                  </Button>
                )}
              </div>
              <ul className="hidden md:flex gap-10 mb-[22.5px]">
                <li>
                  게시물 <span className="font-semibold">0</span>
                </li>
                <li>
                  팔로워 <span className="font-semibold">0</span>
                </li>
                <li>
                  팔로우 <span className="font-semibold">0</span>
                </li>
              </ul>
              <div className="hidden md:flex h-[18px]">
                <span className="text-sm font-semibold">{userName}</span>
              </div>
            </div>
          </div>
          {/* <ul className="flex items-center w-full h-[130px] pl-12 mb-11"> */}
          {/*  <li className="w-[125px] h-full p-5">스토리</li> */}
          {/* </ul> */}
        </header>
      </div>
      <div className="w-full h-full max-w-[975px] md:px-5">
        <MobileComponent />
        <div className="flex justify-center items-center w-full h-[53px] border-t border-t-gray-300 text-gray-600 text-xs text-center font-semibold tracking-wide" />
        <UserPosts userName={userName} />
      </div>
    </section>
  )
}

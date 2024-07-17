import { Avatar, AvatarImage } from '#components/ui/avatar'

import UserPosts from './userPosts'

export default function UserProfile({
  params,
}: {
  params: { userName: string }
}) {
  return (
    <section className="flex min-h-full justify-center items-center">
      <div className="grow max-w-[975px] h-full px-5 pt-[30px]">
        <header className="w-full">
          <div className="flex w-full h-[150px] mb-11">
            <div className="flex items-center justify-center md:w-[283px] mr-7">
              <Avatar className="w-20 h-20 md:w-[150px] md:h-full group-hover:scale-110 transition duration-200 ease-in-out border border-gray-200">
                <AvatarImage src="https://avatars.githubusercontent.com/u/145896782?v=4" />
              </Avatar>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center h-[48.5px] mb-5">
                <div className="text-xl">{params.userName}</div>
              </div>
              <ul className="flex gap-10 mb-[22.5px]">
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
              <div className="h-[18px]">
                <span className="text-sm font-semibold">유광준</span>
              </div>
            </div>
          </div>
          {/*<ul className="flex items-center w-full h-[130px] pl-12 mb-11">*/}
          {/*  <li className="w-[125px] h-full p-5">스토리</li>*/}
          {/*</ul>*/}
        </header>

        <div className="flex justify-center items-center h-[53px] border-t border-t-gray-300 text-gray-600 text-xs text-center font-semibold tracking-wide" />

        <UserPosts />
      </div>
    </section>
  )
}

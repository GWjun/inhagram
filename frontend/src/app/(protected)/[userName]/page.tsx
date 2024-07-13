import Image from 'next/image'

import { Avatar, AvatarImage } from '#components/ui/avatar'
import PostsResponse from '#types/postsType'

export default async function UserProfile({
  params,
}: {
  params: { userName: string }
}) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts?order__createdAt=DESC`,
    {
      cache: 'no-cache',
    },
  )
  const postsRespose = (await response.json()) as PostsResponse
  const postsData = postsRespose.data

  return (
    <section className="flex min-h-full justify-center items-center">
      <div className="grow max-w-[975px] h-full px-5 pt-[30px]">
        <header className="w-full">
          <div className="flex w-full h-[150px] mb-11">
            <div className="flex items-center justify-center w-[283px] mr-7">
              <Avatar className="w-[150px] h-full group-hover:scale-110 transition duration-200 ease-in-out">
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
          <ul className="flex items-center w-full h-[130px] pl-12 mb-11">
            <li className="w-[125px] h-full p-5">스토리</li>
          </ul>
        </header>
        <div className="flex justify-center items-center h-[53px] border-t border-t-gray-300 text-gray-600 text-xs text-center font-semibold tracking-wide" />
        <div className="grid grid-cols-3 gap-1">
          {postsData.map((it, index) => {
            const imageUrl = it.images[0].path
            const srcUrl = process.env.NEXT_PUBLIC_SERVER_URL + imageUrl

            return (
              <div
                key={index}
                className="relative w-full aspect-square max-w-[307.67px]"
              >
                <Image
                  src={srcUrl}
                  alt="posts"
                  fill
                  sizes="(max-width: 307.67px) 100vw, 307.67px"
                  className="object-cover"
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

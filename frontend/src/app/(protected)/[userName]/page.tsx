import ImagePosts from '#components/feature/post/imagePosts'
import NotExist from '#components/layout/notexist'

import UserHeader from './userHeader'

export default async function UserProfile({
  params: { userName },
}: {
  params: { userName: string }
}) {
  const isUserExist = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/id`,
  )
  if (!isUserExist.ok) return <NotExist />

  return (
    <div className="flex flex-col min-h-full justify-center items-center">
      <UserHeader userName={userName} />
      <div className="w-full h-full max-w-[975px] md:px-5">
        <div className="flex justify-center items-center w-full h-[53px] border-t border-t-gray-300 text-gray-600 text-xs text-center font-semibold tracking-wide" />
        <ImagePosts userName={userName} />
      </div>
    </div>
  )
}

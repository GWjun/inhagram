import { UserCountType } from '#types/user.type'

interface MobileListsProps {
  userName: string
  userCount: UserCountType
}

export default function MobileLists({ userName, userCount }: MobileListsProps) {
  return (
    <>
      <div className="flex md:hidden w-full h-[18px] px-5 mb-5">
        <span className="text-sm font-semibold">{userName}</span>
      </div>
      <ul className="flex md:hidden w-full justify-around gap-10 py-3 border-t border-t-gray-300">
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">게시물</span>
          <span className="text-sm font-semibold">{userCount.postCount}</span>
        </li>
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">팔로워</span>
          <span className="text-sm font-semibold">
            {userCount.followerCount}
          </span>
        </li>
        <li className="flex flex-col items-center">
          <span className="text-sm text-gray -mb-1">팔로우</span>
          <span className="text-sm font-semibold">
            {userCount.followeeCount}
          </span>
        </li>
      </ul>
    </>
  )
}

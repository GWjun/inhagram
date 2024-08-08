export default function MobileLists({ userName }: { userName: string }) {
  return (
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
}

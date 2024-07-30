import UserPost from '../[userName]/userPosts'

export default function Explore() {
  return (
    <div className="flex min-h-full justify-center items-center">
      <div className="w-full h-full max-w-[975px] pt-6 md:px-5">
        <UserPost />
      </div>
    </div>
  )
}

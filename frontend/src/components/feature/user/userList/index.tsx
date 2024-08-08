import Link from 'next/link'

import ImageWithLoad from '#components/feature/image/imageWithLoad'
import { Avatar } from '#components/ui/avatar'
import { Button } from '#components/ui/button'
import { SimpleUser } from '#types/user.type'

interface UserListProps {
  user: SimpleUser
}

export default function UserList({ user }: UserListProps) {
  return (
    <li>
      <Link
        href={`/${user.nickname}`}
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
    </li>
  )
}

import FollowButton from '#components/feature/user/followButton'
import UserHeader from '#components/feature/user/userHeader'
import { BasicUser } from '#types/user.type'

interface UserListProps {
  user: BasicUser
}

export default function UserList({ user }: UserListProps) {
  return (
    <li className="flex justify-between items-center">
      <UserHeader user={user} />
      <FollowButton followeeId={user.id} />
    </li>
  )
}

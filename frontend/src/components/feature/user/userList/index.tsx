import UserHeader from '#components/feature/user/userHeader'
import { Button } from '#components/ui/button'
import { SimpleUser } from '#types/user.type'

interface UserListProps {
  user: SimpleUser
}

export default function UserList({ user }: UserListProps) {
  return (
    <li className="flex justify-between items-center">
      <UserHeader user={user} />
      <Button className="mx-4">팔로우</Button>
    </li>
  )
}

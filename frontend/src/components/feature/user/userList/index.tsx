import { getServerSession, Session } from 'next-auth'

import FollowButton from '#components/feature/user/followButton'
import UserHeader from '#components/feature/user/userHeader'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '#pages/api/auth/[...nextauth]'
import { BasicUser } from '#types/user.type'
import authFetch from '#utils/authFetch'

interface UserListProps {
  user: BasicUser
}

export default async function UserList({ user }: UserListProps) {
  const session = (await getServerSession(authOptions)) as Session

  const isFollowing = await authFetch<boolean>(
    `/users/follow/check/${user.id}`,
    {},
    session,
  )

  return (
    <li className="flex justify-between items-center">
      <UserHeader user={user} />
      <FollowButton
        followeeId={user.id}
        isFollowing={isFollowing}
        withOtherFetch
      />
    </li>
  )
}

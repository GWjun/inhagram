import { getServerSession, Session } from 'next-auth'

import FollowActionButton from '#components/feature/user/followButton/followActionButton'
import { Button } from '#components/ui/button'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { authOptions } from '#pages/api/auth/[...nextauth]'
import authFetch from '#utils/authFetch'

interface FollowButtonProps {
  followeeId: number
  className?: string
}

export default async function FollowButton({
  followeeId,
  className,
}: FollowButtonProps) {
  const session = (await getServerSession(authOptions)) as Session

  let isFollowing
  try {
    isFollowing = await authFetch<boolean>(
      `/users/follow/check/${followeeId}`,
      {
        cache: 'no-store',
      },
      session,
    )
  } catch (error) {
    return (
      <Button className={className} variant="gray" disabled>
        오류
      </Button>
    )
  }

  return (
    <FollowActionButton isFollowing={isFollowing} followeeId={followeeId} />
  )
}

'use client'

import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import { Button } from '#components/ui/button'
import { useFollow } from '#hooks/useFollow'

interface FollowButtonProps {
  followeeId: number
  isFollowing?: boolean
  withOtherFetch?: boolean
}

export default function FollowButton({
  followeeId,
  isFollowing: initFollowing,
  withOtherFetch = false,
}: FollowButtonProps) {
  const { data: session } = useSession()

  const { isFollowing, follow, unfollow, isPending, isError } = useFollow({
    followeeId,
    withOtherFetch,
    session,
  })

  if (isPending)
    return (
      <Button className="mx-4 w-[68.34px]" disabled>
        <LoadingSpinner />
      </Button>
    )

  if (isError)
    return (
      <Button className="mx-4" variant="gray" disabled>
        오류
      </Button>
    )

  if (isFollowing !== undefined)
    return isFollowing ? (
      <Button onClick={unfollow} variant="gray" className="mx-4">
        팔로잉
      </Button>
    ) : (
      <Button onClick={follow} className="mx-4">
        팔로우
      </Button>
    )
  else
    return initFollowing ? (
      <Button onClick={unfollow} variant="gray" className="mx-4">
        팔로잉
      </Button>
    ) : (
      <Button onClick={follow} className="mx-4">
        팔로우
      </Button>
    )
}

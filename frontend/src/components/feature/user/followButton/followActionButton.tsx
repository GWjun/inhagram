'use client'

import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import { Button } from '#components/ui/button'
import { useFollow } from '#hooks/useFollow'

interface FollowClientButtonProps {
  isFollowing: boolean
  followeeId: number
}

export default function FollowActionButton({
  isFollowing: initialIsFollowing,
  followeeId,
}: FollowClientButtonProps) {
  const { data: session } = useSession()

  const { isFollowing, follow, unfollow, isPending, isError } = useFollow({
    initialIsFollowing,
    followeeId,
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

  return isFollowing ? (
    <Button onClick={unfollow} variant="gray" className="mx-4">
      팔로잉
    </Button>
  ) : (
    <Button onClick={follow} className="mx-4">
      팔로우
    </Button>
  )
}

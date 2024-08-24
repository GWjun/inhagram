'use client'

import { useState } from 'react'

import { Session } from 'next-auth'

import {
  useFollowMutation,
  useUnFollowMutation,
} from '#store/server/user.queries'

interface UseFollowProps {
  initialIsFollowing: boolean
  followeeId: number
  session: Session | null
}

export function useFollow({
  initialIsFollowing,
  followeeId,
  session,
}: UseFollowProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const { mutate: followMutate, status: followStatus } = useFollowMutation(
    session as Session,
  )
  const { mutate: unFollowMutate, status: unFollowStatus } =
    useUnFollowMutation(session as Session)

  const follow = () => {
    followMutate(followeeId, {
      onSuccess: () => setIsFollowing(true),
    })
  }

  const unfollow = () => {
    unFollowMutate(followeeId, {
      onSuccess: () => setIsFollowing(false),
    })
  }

  const isPending = followStatus === 'pending' || unFollowStatus === 'pending'
  const isError = followStatus === 'error' || unFollowStatus === 'error'

  return { isFollowing, isPending, isError, follow, unfollow }
}

'use client'

import { Session } from 'next-auth'

import {
  useFollowMutation,
  useIsFollowingQuery,
  useUnFollowMutation,
} from '#store/server/user.queries'

import RevalidateUserCount from '../server/revalidateUserCount'

interface UseFollowProps {
  followeeId: number
  withOtherFetch?: boolean
  session: Session | null
}

export function useFollow({
  followeeId,
  withOtherFetch,
  session,
}: UseFollowProps) {
  const {
    data: isFollowing,
    status: isFollowingStatus,
    refetch,
  } = useIsFollowingQuery(followeeId, session as Session)
  const { mutate: followMutate, status: followStatus } = useFollowMutation(
    session as Session,
  )
  const { mutate: unFollowMutate, status: unFollowStatus } =
    useUnFollowMutation(session as Session)

  const follow = () => {
    followMutate(followeeId, {
      onSuccess: async () => {
        await refetch()
        if (!withOtherFetch) await RevalidateUserCount()
      },
    })
  }

  const unfollow = () => {
    unFollowMutate(followeeId, {
      onSuccess: async () => {
        await refetch()
        if (!withOtherFetch) await RevalidateUserCount()
      },
    })
  }

  const isInitialPending = isFollowingStatus === 'pending'
  const isPending = followStatus === 'pending' || unFollowStatus === 'pending'
  const isError =
    isFollowingStatus === 'error' ||
    followStatus === 'error' ||
    unFollowStatus === 'error'

  return { isInitialPending, isFollowing, isPending, isError, follow, unfollow }
}

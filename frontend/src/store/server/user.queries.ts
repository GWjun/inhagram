import { useMutation, useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'

import authFetch from '#utils/authFetch'

// Get IsFollowing Query
export function useIsFollowingQuery(followeeId: number, session: Session) {
  let enabled = false
  if (session) enabled = true

  return useQuery({
    queryKey: ['isfollowing', followeeId],
    queryFn: () =>
      authFetch<boolean>(`/users/follow/check/${followeeId}`, {}, session),
    enabled,
  })
}

// Post Follow Mutation
async function followUser(followeeId: number, session: Session) {
  return authFetch(
    `/users/follow/${followeeId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}
export const followMutationKey = ['follow']
export function useFollowMutation(session: Session) {
  return useMutation({
    mutationKey: followMutationKey,
    mutationFn: (followeeId: number) => followUser(followeeId, session),
    gcTime: 0,
  })
}

// Post UnFollow Mutation
async function unFollowUser(followeeId: number, session: Session) {
  return authFetch(
    `/users/follow/${followeeId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}
export const unFollowMutationKey = ['unfollow']
export function useUnFollowMutation(session: Session) {
  return useMutation({
    mutationKey: unFollowMutationKey,
    mutationFn: (followeeId: number) => unFollowUser(followeeId, session),
    gcTime: 0,
  })
}

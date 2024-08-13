import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'
import { Session } from 'next-auth'

import { CommentsResponse } from '#types/comments.type'
import authFetch from '#utils/authFetch'

type CustomSesson = Session | null

// Get Comments Ifinite Query
async function getComments(url: string, session: Session) {
  const parts = url.split('/posts')
  const resource = '/posts' + parts[1]

  return authFetch<CommentsResponse>(resource, {}, session)
}
export function useGetCommentsQuery(postId: number, session: Session) {
  const baseParam = `/posts/${postId}/comments?order__createdAt=DESC&take=10`

  let enabled = false
  if (session) enabled = true

  return useInfiniteQuery({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam }) => getComments(pageParam, session),
    initialPageParam: baseParam,
    getNextPageParam: (lastPage) => lastPage.next,
    retry: 2,
    enabled,
  })
}

// Post Comment Mutate
async function postComment(
  postId: number,
  comment: string,
  session: CustomSesson,
) {
  return authFetch(
    `/posts/${postId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify({ comment }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}
export function usePostCommentMutation(postId: number, session: CustomSesson) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (comment: string) => postComment(postId, comment, session),
    gcTime: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

// Delete Comment Data Mutation
async function deleteCommentData(
  postId: number,
  commentId: number,
  session: CustomSesson,
) {
  return authFetch(
    `/posts/${postId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}

export function useDeleteCommentDataMutation(
  postId: number,
  session: CustomSesson,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (commentId: number) =>
      deleteCommentData(postId, commentId, session),
    gcTime: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['comments', postId] })
    },
  })
}

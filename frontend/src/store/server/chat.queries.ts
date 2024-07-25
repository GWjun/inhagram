import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'

import { ChatsResponse, MessagesResponse } from '#types/chats.type'
import authFetch from '#utils/authFetch'

// Get Chat Query
export function useGetChatQuery(session: Session) {
  return useQuery({
    queryKey: ['chat'],
    queryFn: () => authFetch<ChatsResponse>('/chats', {}, session),
    gcTime: 0,
  })
}

// Get Message Ifinite Query
async function getMessage(url: string, session: Session) {
  const parts = url.split('/chats')
  const resource = '/chats' + parts[1]

  return authFetch<MessagesResponse>(resource, {}, session)
}
export function useGetMessageQuery(chatId: string, session: Session) {
  const baseParam = `/chats/${chatId}/messages?order__createdAt=DESC&take=18`

  let enabled = false
  if (session) enabled = true

  return useInfiniteQuery({
    queryKey: ['message', chatId],
    queryFn: ({ pageParam }) => getMessage(pageParam, session),
    initialPageParam: baseParam,
    getNextPageParam: (lastPage) => lastPage.next,
    retry: 2,
    enabled,
  })
}

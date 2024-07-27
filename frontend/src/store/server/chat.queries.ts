import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'

import { ChatsResponse, MessagesResponse } from '#types/chats.type'
import { BasicUser } from '#types/user.type'
import authFetch from '#utils/authFetch'

// Get Chat Infinite Query
async function getChat(url: string, session: Session) {
  const parts = url.split('/chats')
  const resource = '/chats' + parts[1]

  return authFetch<ChatsResponse>(resource, {}, session)
}
export function useGetChatQuery(session: Session) {
  const baseParam = `/chats?order__createdAt=DESC&take=10`

  let enabled = false
  if (session) enabled = true

  return useInfiniteQuery({
    queryKey: ['chat'],
    queryFn: ({ pageParam }) => getChat(pageParam, session),
    initialPageParam: baseParam,
    getNextPageParam: (lastPage) => lastPage.next,
    retry: 2,
    enabled,
  })
}

// Get Chat User Query
export function useGetChatUserQuery(chatId: string, session: Session) {
  let enabled = false
  if (session) enabled = true

  return useQuery({
    queryKey: ['chat', 'user'],
    queryFn: () => authFetch<BasicUser>(`/chats/${chatId}`, {}, session),
    gcTime: 0,
    enabled,
  })
}

// Get Message Ifinite Query
async function getMessage(url: string, session: Session) {
  const parts = url.split('/chats')
  const resource = '/chats' + parts[1]

  return authFetch<MessagesResponse>(resource, {}, session)
}
export function useGetMessageQuery(chatId: string, session: Session) {
  const baseParam = `/chats/${chatId}/messages?order__createdAt=DESC&take=30`

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

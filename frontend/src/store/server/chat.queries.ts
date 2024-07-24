import { useQuery } from '@tanstack/react-query'
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

// Get Message Query
export function useGetMessageQuery(chatId: number, session: Session) {
  return useQuery({
    queryKey: ['message'],
    queryFn: () =>
      authFetch<MessagesResponse>(`/chats/${chatId}/messages`, {}, session),
    gcTime: 0,
  })
}

'use client'

import { usePathname } from 'next/navigation'

import { Fragment, useEffect, useState } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import ChatList from '#components/feature/chat/chatLists/chatList'
import useInfiniteScroll from '#components/feature/common/infiniteScroll'
import NextFetchRef from '#components/feature/common/infiniteScroll/nextFetchRef'
import Alert from '#components/feature/modal/alert'
import UserSkeleton from '#components/feature/user/userSkeleton'
import useSocketEventHandler from '#hooks/useSocketHandler'
import useWebSocketStore from '#store/client/websocket.store'
import { useGetChatQuery } from '#store/server/chat.queries'

export default function ChatLists() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const { socket } = useWebSocketStore()
  const {
    data: chats,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetChatQuery(session as Session)
  const [activateChat, setActivateChat] = useState<number>()

  const { ref } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handleCreateChatComplete = async () => {
    if (socket) {
      socket.emit('enter_chat')
      await refetch()
    }
  }

  useSocketEventHandler({
    handlers: {
      create_chat_complete: handleCreateChatComplete,
      exit_chat_complete: handleCreateChatComplete,
    },
    dependencies: [refetch],
  })

  useEffect(() => {
    if (pathname) {
      const chatId = Number(pathname.split('/').pop())
      if (!isNaN(chatId)) setActivateChat(chatId)
    }
  }, [pathname])

  return (
    <section className="flex flex-col w-full">
      {status === 'success' &&
        (chats?.pages[0].data.length ? (
          chats.pages.map((page, index) => (
            <Fragment key={index}>
              {page.data.map((chat) => (
                <ChatList
                  key={chat.id}
                  chat={chat}
                  activateChat={activateChat}
                />
              ))}
            </Fragment>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            대화을 시작해 보세요
          </div>
        ))}

      <NextFetchRef ref={ref} isLoading={isFetchingNextPage} />

      {status === 'pending' && (
        <UserSkeleton
          count={10}
          containerStyle="px-1 sm:px-6"
          textStyle="hidden lg:flex lg:flex-col"
        />
      )}

      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="채팅을 불러오는데 실패했습니다."
      />
    </section>
  )
}

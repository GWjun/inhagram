'use client'

import { useState } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import useInfiniteScroll from '#components/feature/common/infiniteScroll'
import Alert from '#components/feature/modal/alert'
import useSocketEventHandler from '#hooks/useSocketHandler'
import useMessageStore from '#store/client/message.store'
import { useGetMessageQuery } from '#store/server/chat.queries'
import NextFetchRef from 'components/feature/common/infiniteScroll/nextFetchRef'

import ChatHeader from './chatHeader'
import MessageInput from './messageInput'
import MessagesBuffer from './messagesBuffer'
import MessagesContent from './messagesContent'

export default function Chat({
  params: { chatId },
}: {
  params: { chatId: string }
}) {
  const { data: session } = useSession()

  const {
    data: messages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetMessageQuery(chatId, session as Session)

  const { setMyWritten, otherWritten, setOtherWritten } = useMessageStore()
  const { messageBuffer, setMessageBuffer } = useMessageStore()
  const [transmitFailed, setTransmitFailed] = useState(false)

  const { ref } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  const handlers = {
    message_received: async () => {
      await refetch()
      setOtherWritten(false)
    },
    message_transmit_success: async () => {
      await refetch()
      setMyWritten(false)
      setMessageBuffer([])
    },
    message_transmit_fail: () => setTransmitFailed(true),
    write_start_complete: (eventChatId: string) => {
      if (chatId === eventChatId) setOtherWritten(true)
    },
    write_stop_complete: (eventChatId: string) => {
      if (chatId === eventChatId) setOtherWritten(false)
    },
  }

  useSocketEventHandler({
    handlers,
    dependencies: [refetch, chatId],
  })

  if (status === 'pending') return <LoadingSpinner />

  return (
    <div className="flex flex-col w-full h-full pb-16 md:pb-4">
      <ChatHeader chatId={chatId} session={session} />

      <section className="grow flex flex-col-reverse overflow-y-scroll h-0">
        <MessagesBuffer
          messageBuffer={messageBuffer}
          lastMessage={messages?.pages[0].data[0]}
          otherWritten={otherWritten}
          transmitFailed={transmitFailed}
          sessionUserName={session?.user?.name}
        />
        <MessagesContent
          messages={messages}
          hasNextPage={hasNextPage}
          sessionUserName={session?.user?.name}
        />
        <NextFetchRef
          ref={ref}
          isLoading={isFetchingNextPage}
          containerStyle="h-20"
        />
      </section>
      <MessageInput chatId={chatId} />

      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="채팅을 불러오는데 실패했습니다."
      />
    </div>
  )
}

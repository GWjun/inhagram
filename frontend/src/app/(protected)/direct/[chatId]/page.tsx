'use client'

import { useCallback, useEffect, useState } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import useWebSocketStore from '#store/client/websocket.store'
import { useGetMessageQuery } from '#store/server/chat.queries'
import { cn } from '#utils/utils'

import ChatHeader from './chatHeader'
import MessagesBuffer from './messagesBuffer'
import MessagesContent from './messagesContent'

export default function Chat({
  params: { chatId },
}: {
  params: { chatId: string }
}) {
  const { data: session } = useSession()
  const { socket, writeStartMessage, writeStopMessage, sendMessage } =
    useWebSocketStore()
  const {
    data: messages,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetMessageQuery(chatId, session as Session)

  const [content, setContent] = useState('')
  const [messageBuffer, setMessageBuffer] = useState<string[]>([])
  const [myWritten, setMyWritten] = useState(false)
  const [otherWritten, setOtherWritten] = useState(false)
  const [transmitFailed, setTransmitFailed] = useState(false)

  const { ref } = useInView({
    onChange: useCallback(
      (inView: boolean) => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
      },
      [fetchNextPage, hasNextPage, isFetchingNextPage],
    ),
  })

  useEffect(() => {
    if (!socket) return

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

    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler)
    })

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler)
      })
    }
  }, [socket, refetch, chatId])

  useEffect(() => {
    if (myWritten && !messageBuffer && content.trim() === '') {
      writeStopMessage(chatId)
      setMyWritten(false)
    }

    if (!myWritten && content.trim() !== '') {
      writeStartMessage(chatId)
      setMyWritten(true)
    }
  }, [
    chatId,
    content,
    messageBuffer,
    myWritten,
    writeStartMessage,
    writeStopMessage,
  ])

  const handleSendMessage = useCallback(() => {
    if (content.trim().length === 0) return
    setMessageBuffer((prev) => [...prev, content])
    sendMessage(chatId, content.trim())
    setContent('')
  }, [chatId, content, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Enter' &&
        content.trim().length > 0 &&
        !e.nativeEvent.isComposing
      )
        handleSendMessage()
    },
    [content, handleSendMessage],
  )

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

        {isFetchingNextPage ? (
          <LoadingSpinner className="w-8 h-8 mt-5" />
        ) : (
          <div className="h-20" ref={ref} />
        )}
      </section>

      <div className="flex items-center relative mx-5">
        <Input
          className="rounded-2xl"
          placeholder="메시지 입력..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          onClick={handleSendMessage}
          variant="ghost"
          className={cn(
            'absolute right-0 text-button hover:bg-transparent hover:text-button',
            content.length <= 0 && 'hidden',
          )}
        >
          보내기
        </Button>
      </div>
      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="채팅을 불러오는데 실패했습니다."
      />
    </div>
  )
}

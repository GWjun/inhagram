'use client'

import Image from 'next/image'

import { Fragment, useCallback, useEffect, useState } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import { Skeleton } from '#components/ui/skeleton'
import useWebSocketStore from '#store/client/websocket.store'
import {
  useGetChatUserQuery,
  useGetMessageQuery,
} from '#store/server/chat.queries'
import { cn } from '#utils/utils'

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

  const { data: user, status: userStatus } = useGetChatUserQuery(
    chatId,
    session as Session,
  )

  const [content, setContent] = useState('')
  const [myWritten, setMyWritten] = useState(false)
  const [otherWritten, setOtherWritten] = useState(false)

  const { ref } = useInView({
    onChange: useCallback(
      (inView: boolean) => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
      },
      [fetchNextPage, hasNextPage, isFetchingNextPage],
    ),
  })

  useEffect(() => {
    if (socket) {
      socket.on('message_received', async () => {
        await refetch()
      })
      socket.on('write_start_complete', () => {
        setOtherWritten(true)
      })
      socket.on('write_stop_complete', () => {
        setOtherWritten(false)
      })
    }
  }, [socket, refetch])

  useEffect(() => {
    if (myWritten && content.trim() === '') {
      writeStopMessage(chatId)
      setMyWritten(false)
    }

    if (!myWritten && content.trim() !== '') {
      writeStartMessage(chatId)
      setMyWritten(true)
    }
  }, [chatId, content, myWritten, writeStartMessage, writeStopMessage])

  function handleSendMessage() {
    sendMessage(chatId, content.trim())
    setContent('')
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (
      e.key === 'Enter' &&
      content.trim().length > 0 &&
      !e.nativeEvent.isComposing
    )
      handleSendMessage()
  }

  if (status === 'pending') return <LoadingSpinner />

  return (
    <div className="flex flex-col w-full h-full pb-16 md:pb-4">
      <section className="flex items-center h-[75px] border-b border-gray-300 px-4">
        {userStatus === 'success' ? (
          <>
            <div className="relative w-11 h-11">
              <Image
                src={user?.image || '/images/assets/avatar-default.jpg'}
                alt="avatar image"
                fill
                sizes="(max-width: 640px) 4rem, (max-width: 768px) 4rem, 4rem"
                className="object-cover rounded-full"
              />
            </div>
            <span className="ml-4 font-semibold">{user?.nickname}</span>
          </>
        ) : (
          <>
            <Skeleton className="h-11 w-11 rounded-full" />
            <Skeleton className="h-4 w-[75px] ml-4" />
          </>
        )}
      </section>
      <section className="grow mb-5 flex flex-col-reverse overflow-y-scroll h-0">
        <div
          className={cn(
            'hidden w-12 py-2 px-3 mx-5 my-1 rounded-3xl text-sm bg-gray-200 text-black',
            otherWritten && 'flex justify-center items-center',
          )}
        >
          ...
        </div>

        {messages?.pages[0].data.length ? (
          messages.pages.map((page, index) => (
            <Fragment key={index}>
              {page.data.map((message) => {
                const isMine = message.author.nickname === session?.user?.name
                const content = message.message

                return (
                  <div
                    key={message.id}
                    className={`flex ${isMine ? 'justify-end' : 'justify-start'} my-1`}
                  >
                    <div
                      className={`max-w-xs py-2 px-3 mx-5 rounded-3xl text-sm ${
                        isMine
                          ? 'bg-button text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                    >
                      {content}
                    </div>
                  </div>
                )
              })}
            </Fragment>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            채팅을 시작해 보세요
          </div>
        )}

        {isFetchingNextPage ? (
          <LoadingSpinner className="w-8 h-8 mt-5" />
        ) : (
          <div ref={ref} />
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

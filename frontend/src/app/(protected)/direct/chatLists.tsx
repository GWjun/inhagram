'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Fragment, useCallback, useEffect, useState } from 'react'

import { SquarePen } from 'lucide-react'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { useInView } from 'react-intersection-observer'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import UserSkeleton from '#components/feature/userSkeleton'
import useWebSocketStore from '#store/client/websocket.store'
import { useGetChatQuery } from '#store/server/chat.queries'
import { cn } from '#utils/utils'

import NewChat from './newChat'

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
      const handleCreateChatComplete = async () => {
        socket.emit('enter_chat')
        await refetch()
      }

      socket.on('create_chat_complete', handleCreateChatComplete)
      socket.on('exit_chat_complete', handleCreateChatComplete)

      return () => {
        socket.off('create_chat_complete', handleCreateChatComplete)
        socket.on('exit_chat_complete', handleCreateChatComplete)
      }
    }
  }, [socket, refetch])

  useEffect(() => {
    if (pathname) {
      const chatId = Number(pathname.split('/').pop())
      if (!isNaN(chatId)) setActivateChat(chatId)
    }
  }, [pathname])

  return (
    <div className="sm:min-w-28 lg:min-w-[397px] h-screen pb-6 pt-10 border-r border-gray-300 z-30">
      <section className="flex justify-center lg:justify-between mb-6 lg:pr-6">
        <h3 className="hidden lg:flex font-bold sm:px-6">메시지</h3>
        <NewChat>
          <SquarePen />
        </NewChat>
      </section>

      <section className="flex flex-col w-full">
        {status === 'success' &&
          (chats?.pages[0].data.length ? (
            chats.pages.map((page, index) => (
              <Fragment key={index}>
                {page.data.map((chat) => {
                  const userName = chat.users[0].nickname
                  const imageUrl = chat.users[0].image

                  return (
                    <Link
                      href={`/direct/${chat.id}`}
                      key={chat.id}
                      className={cn(
                        'flex items-center justify-center lg:justify-start gap-4 w-full h-20 px-1 sm:px-6 hover:bg-gray-bright',
                        activateChat === chat.id &&
                          'bg-gray-light hover:bg-gray-light',
                      )}
                    >
                      <div className="h-14 w-14 relative">
                        <Image
                          src={imageUrl || '/images/assets/avatar-default.jpg'}
                          alt="avatar image"
                          fill
                          sizes="(max-width: 640px) 3.5rem, (max-width: 768px) 3.5rem, 3.5rem"
                          className="object-cover rounded-full"
                          priority
                        />
                      </div>
                      <span className="hidden lg:flex">{userName}</span>
                    </Link>
                  )
                })}
              </Fragment>
            ))
          ) : (
            <div className="col-span-3 text-center text-gray-500">
              대화을 시작해 보세요
            </div>
          ))}

        {isFetchingNextPage ? (
          <LoadingSpinner className="w-8 h-8 mt-5" />
        ) : (
          <div ref={ref} />
        )}

        {status === 'pending' && (
          <UserSkeleton
            count={10}
            containerStyle="px-1 sm:px-6"
            textStyle="hidden lg:flex lg:flex-col"
          />
        )}
      </section>

      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="채팅을 불러오는데 실패했습니다."
      />
    </div>
  )
}

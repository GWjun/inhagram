'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import Alert from '#components/feature/alert'
import { Skeleton } from '#components/ui/skeleton'
import { useGetChatQuery } from '#store/server/chat.queries'

export default function ChatLists() {
  const { data: session } = useSession()
  const { data: chats, status, refetch } = useGetChatQuery(session as Session)

  function SkeletonList({ count }: { count: number }) {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="flex items-center gap-4 w-full h-20 px-6">
            <Skeleton className="h-14 w-14 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <div className="min-w-28 md:min-w-[397px] h-screen py-6 pt-10 border-r border-gray-300 z-30">
      <h3 className="font-bold mb-6 px-6">메시지</h3>

      <div className="flex flex-col w-full h-full">
        {status === 'success' &&
          chats.data.map((chat) => {
            const userName = chat.users[0].nickname
            const imageUrl = chat.users[0].image

            return (
              <Link
                href={`/direct/${chat.id}`}
                key={chat.id}
                className="flex items-center gap-4 w-full h-20 px-6 hover:bg-gray-bright"
              >
                <div className="h-14 w-14 relative">
                  <Image
                    src={imageUrl || '/images/avatar-default.jpg'}
                    alt="avatar image"
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                {userName}
              </Link>
            )
          })}

        {status === 'pending' && <SkeletonList count={10} />}
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

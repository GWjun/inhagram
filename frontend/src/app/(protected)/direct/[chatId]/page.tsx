'use client'

import { useState } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import { Input } from '#components/ui/input'
import { useGetMessageQuery } from '#store/server/chat.queries'

export default function Chat({
  params: { chatId },
}: {
  params: { chatId: number }
}) {
  const { data: session } = useSession()
  const {
    data: messages,
    status,
    refetch,
  } = useGetMessageQuery(chatId, session as Session)

  const [content, setContent] = useState('')

  if (status === 'pending') return <LoadingSpinner />

  return (
    <div className="flex flex-col self-end w-full p-5">
      <div className="mb-7">
        {status === 'success' &&
          messages.data.map((message) => {
            const isMine = message.author.nickname === session?.user?.name
            const content = message.message

            return (
              <div
                key={message.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'} my-2`}
              >
                <div
                  className={`max-w-xs py-2 px-3 rounded-3xl text-sm font-light ${
                    isMine ? 'bg-button text-white' : 'bg-gray-200 text-black'
                  }`}
                >
                  {content}
                </div>
              </div>
            )
          })}
      </div>
      <Input
        className="rounded-2xl"
        placeholder="메시지 입력..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="채팅을 불러오는데 실패했습니다."
      />
    </div>
  )
}

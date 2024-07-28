'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { memo } from 'react'

import { EllipsisVertical } from 'lucide-react'
import { Session } from 'next-auth'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#components/ui/dropdown-menu'
import { Skeleton } from '#components/ui/skeleton'
import useWebSocketStore from '#store/client/websocket.store'
import { useGetChatUserQuery } from '#store/server/chat.queries'

interface ChatHeaderProps {
  chatId: string
  session: Session | null
}

function ChatHeader({ chatId, session }: ChatHeaderProps) {
  const router = useRouter()

  const { exitChat } = useWebSocketStore()
  const { data: user, status: userStatus } = useGetChatUserQuery(
    chatId,
    session as Session,
  )

  if (userStatus !== 'success')
    return (
      <>
        <Skeleton className="h-11 w-11 rounded-full" />
        <Skeleton className="h-4 w-[75px] ml-4" />
      </>
    )

  function handleExitChat() {
    exitChat(chatId)
    router.push('/direct')
  }

  return (
    <section className="flex justify-between h-[75px] border-b border-gray-300 px-4">
      <div className="flex items-center">
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
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <EllipsisVertical size={20} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="relative bottom-5 right-3 p-0">
          <DropdownMenuItem
            onClick={handleExitChat}
            className="justify-center text-destructive focus:text-destructive"
          >
            나가기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  )
}

export default memo(ChatHeader)

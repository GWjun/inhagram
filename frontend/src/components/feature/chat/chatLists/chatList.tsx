import Image from 'next/image'
import Link from 'next/link'

import { ChatRoom } from '#types/chats.type'
import { cn } from '#utils/utils'

interface ChatListProps {
  chat: ChatRoom
  activateChat: number | undefined
}

export default function ChatList({ chat, activateChat }: ChatListProps) {
  const userName = chat.users[0].nickname
  const imageUrl = chat.users[0].image

  return (
    <Link
      href={`/direct/${chat.id}`}
      className={cn(
        'flex items-center justify-center lg:justify-start gap-4 w-full h-20 px-1 sm:px-6 hover:bg-gray-bright',
        activateChat === chat.id && 'bg-gray-light hover:bg-gray-light',
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
}

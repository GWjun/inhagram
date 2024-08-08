'use client'

import { useRouter } from 'next/navigation'

import { ReactNode, useEffect, useState } from 'react'

import SearchUserData from '#components/feature/user/searchUserData'
import { Button } from '#components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog'
import { Input } from '#components/ui/input'
import useWebSocketStore from '#store/client/websocket.store'
import { BasicUser } from '#types/user.type'

interface NewChatProps {
  children?: ReactNode
}

export default function NewChat({ children }: NewChatProps) {
  const router = useRouter()

  const { createChat } = useWebSocketStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<BasicUser | null>(null)
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    setSelectedUser(null)
  }, [searchQuery])

  function handleNewChat() {
    if (selectedUser) {
      createChat(selectedUser.nickname)
      setIsOpen(false)
      router.push('/direct')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="p-0 w-full max-w-[85vw] sm:max-w-[510px]">
        <DialogHeader>
          <DialogTitle className="p-5 pb-2 text-center text-md font-bold">
            새로운 메시지
          </DialogTitle>
          <DialogDescription />
          <div className="flex items-center my-4 border-y border-gray-300">
            <h3 className="font-bold text-black text-md mx-2">받는 사람: </h3>
            <Input
              className="rounded-2xl grow w-0 text-md border-none focus-visible:ring-0"
              placeholder="검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>
        <section className="min-h-[45vh] lg:min-h-[600px] overflow-y-auto">
          <SearchUserData
            searchQuery={searchQuery}
            onClick={setSelectedUser}
            containerStyle="px-1 sm:px-6"
          />
        </section>
        <Button
          onClick={handleNewChat}
          disabled={!selectedUser}
          className="m-3 py-5"
        >
          채팅
        </Button>
      </DialogContent>
    </Dialog>
  )
}

'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

import UserSkeleton from '#components/feature/userSkeleton'
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
import { cn } from '#utils/utils'

interface NewChatProps {
  children?: React.ReactNode
}

export default function NewChat({ children }: NewChatProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const { createChat } = useWebSocketStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [users, setUsers] = useState<BasicUser[]>()
  const [selectedUser, setSelectedUser] = useState<BasicUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/users/search?name=${encodeURIComponent(searchQuery)}`,
        )
        if (!response.ok) throw new Error('Failed to fetch users')

        const data = (await response.json()) as BasicUser[]
        setUsers(data)
      } catch (error) {
        console.error('Error fetching users:', error)
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    if (searchQuery.trim() === '') {
      setUsers([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setSelectedUser(null)
    const debounceTimer = setTimeout(fetchUsers, 300)

    return () => clearTimeout(debounceTimer)
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
        <div className="min-h-[45vh] lg:min-h-[600px] overflow-y-auto">
          {isLoading ? (
            <UserSkeleton count={7} />
          ) : users?.length ? (
            users.map((user) => {
              if (user.nickname === session?.user?.name) return null
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={cn(
                    'flex items-center gap-4 w-full h-20 px-1 sm:px-6 hover:bg-gray-bright',
                    selectedUser?.id === user.id &&
                      'bg-gray-light hover:bg-gray-light',
                  )}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ')
                      setSelectedUser(user)
                  }}
                >
                  <div className="h-14 w-14 relative">
                    <Image
                      src={user.image || '/images/assets/avatar-default.jpg'}
                      alt="avatar image"
                      fill
                      sizes="(max-width: 640px) 3.5rem, (max-width: 768px) 3.5rem, 3.5rem"
                      className="object-cover rounded-full"
                      priority
                    />
                  </div>
                  <span>{user.nickname}</span>
                </div>
              )
            })
          ) : (
            <div className="text-sm text-gray-500 text-center">
              계정을 찾을 수 없습니다.
            </div>
          )}
        </div>
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

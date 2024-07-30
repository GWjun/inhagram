import Image from 'next/image'

import { useEffect, useState } from 'react'

import { useSession } from 'next-auth/react'

import UserSkeleton from '#components/feature/userSkeleton'
import { BasicUser } from '#types/user.type'
import { cn } from '#utils/utils'

interface SearchUserDataProps {
  searchQuery: string
  onClick?: (user: BasicUser) => void
  containerStyle?: string
}

export default function SearchUserData({
  searchQuery,
  onClick,
  containerStyle,
}: SearchUserDataProps) {
  const { data: session } = useSession()

  const [users, setUsers] = useState<BasicUser[]>()
  const [selectedUser, setSelectedUser] = useState<BasicUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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
  }, [searchQuery, setSelectedUser])

  function handleClick(user: BasicUser) {
    setSelectedUser(user)
    onClick?.(user)
  }

  if (isLoading)
    return <UserSkeleton count={7} containerStyle={containerStyle} />

  if (users?.length)
    return users.map((user) => {
      if (user.nickname === session?.user?.name) return null
      return (
        <div
          key={user.id}
          onClick={() => handleClick(user)}
          className={cn(
            'flex items-center gap-4 w-full h-20 hover:bg-gray-bright',
            containerStyle,
            selectedUser?.id === user.id && 'bg-gray-light hover:bg-gray-light',
          )}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') setSelectedUser(user)
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
  else
    return (
      <div className="text-sm text-gray-500 text-center">
        계정을 찾을 수 없습니다.
      </div>
    )
}

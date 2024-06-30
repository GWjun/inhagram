'use client'

import Link from 'next/link'

import { Home, Compass, Film, PlusSquare, User, Send } from 'lucide-react'

import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserStore } from '#store/client/user.store'
import { Avatar, AvatarImage } from '#components/ui/avatar'

export default function Footer() {
  const { activeItem, setActiveItem } = useSidebarStore()
  const userName = useUserStore().userName

  const menuItems = [
    { name: '홈', icon: Home, path: '/' },
    { name: '탐색 탭', icon: Compass, path: '/explore' },
    { name: '릴스', icon: Film, path: '/reels' },
    { name: '만들기', icon: PlusSquare },
    { name: '메시지', icon: Send, path: '/direct/inbox' },
    { name: '프로필', icon: User, path: `/${userName}` },
  ]

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300">
      <nav className="flex justify-evenly items-center h-12">
        {menuItems.map((item) => {
          const isActive = activeItem === item.name
          return (
            <Link
              key={item.name}
              href={item.path || '#'}
              className={`flex flex-col w-12 h-full items-center justify-center ${isActive ? 'text-black' : 'text-gray-500'}`}
              onClick={() => setActiveItem(item.name)}
            >
              {item.name !== '프로필' ? (
                <item.icon
                  className={`group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'} transition duration-200 ease-in-out`}
                />
              ) : (
                <Avatar className="w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out">
                  <AvatarImage src="https://avatars.githubusercontent.com/u/145896782?v=4" />
                </Avatar>
              )}
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

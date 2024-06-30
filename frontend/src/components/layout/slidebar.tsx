'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  User,
  Menu,
  Instagram,
} from 'lucide-react'

import { Avatar, AvatarImage } from '#components/ui/avatar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserStore } from '#store/client/user.store'

export default function Sidebar() {
  const { activeItem, setActiveItem } = useSidebarStore()
  const userName = useUserStore().userName

  const router = useRouter()

  const menuItems = [
    { name: '홈', icon: Home, path: '/' },
    { name: '검색', icon: Search },
    { name: '탐색 탭', icon: Compass, path: '/explore' },
    { name: '릴스', icon: Film, path: '/reels' },
    { name: '메시지', icon: Send, path: '/direct/inbox' },
    { name: '알림', icon: Heart },
    { name: '만들기', icon: PlusSquare },
    { name: '프로필', icon: User, path: `/${userName}` },
  ]

  return (
    <aside className="hidden md:flex md:w-[73px] xl:w-[245px] 3xl:w-[336px] h-screen bg-white border-r border-gray-300 fixed left-0 top-0 flex-col justify-between pt-2 px-3 pb-5">
      <div>
        <div className="relative h-[73px] mb-6">
          <div className="absolute pt-8 px-3 pb-4 opacity-0 xl:opacity-100 invisible xl:visible transition duration-500 ease-in-out">
            <Image
              onClick={() => {
                setActiveItem('홈')
                router.push('/')
              }}
              src="/images/static/text-icon.svg"
              alt="instagram"
              width={103}
              height={32}
            />
          </div>
          <div className="absolute w-full max-w-12 scale-100 xl:scale-0 transition duration-500 ease-in-out">
            <div className="mt-4 pb-[23px]">
              <div className="p-3 my-1 group hover:bg-gray-light rounded-lg">
                <Instagram className="mr-4 group-hover:scale-110 transition duration-200 ease-in-out" />
              </div>
            </div>
          </div>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive = activeItem === item.name
              return (
                <li key={item.name}>
                  <Link
                    href={item.path || '#'}
                    className={`flex items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    {item.name !== '프로필' ? (
                      <item.icon
                        className={`xl:mr-4 group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'} transition duration-200 ease-in-out`}
                      />
                    ) : (
                      <Avatar className="xl:mr-4 w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out">
                        <AvatarImage src="https://avatars.githubusercontent.com/u/145896782?v=4" />
                      </Avatar>
                    )}
                    <span className="hidden xl:inline">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div>
        <button className="flex items-center p-3 mb-1 hover:bg-gray-light rounded-lg w-full group">
          <Menu className="xl:mr-4 group-hover:scale-110 transition duration-200 ease-in-out" />
          <span className="hidden xl:inline">더 보기</span>
        </button>
      </div>
    </aside>
  )
}

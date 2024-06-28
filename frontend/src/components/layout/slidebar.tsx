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
} from 'lucide-react'

import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserStore } from '#store/client/user.store'

const Sidebar = () => {
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
    <aside className="w-[145px] xl:w-[245px] 3xl:w-[336px] h-screen bg-white border-r fixed left-0 top-0 flex flex-col justify-between pt-2 px-3 pb-5">
      <div>
        <div className="pt-8 px-3 pb-4 mb-6">
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
        <nav>
          <ul className="space-y-4 px-1">
            {menuItems.map((item) => {
              const isActive = activeItem === item.name
              return (
                <li key={item.name}>
                  <Link
                    href={item.path || '#'}
                    className={`flex items-center p-2 hover:bg-gray-100 rounded-md group ${isActive ? 'font-bold' : ''}`}
                    onClick={() => setActiveItem(item.name)}
                  >
                    <item.icon
                      className={`h-6 w-6 mr-4 transition-transform duration-200 ease-in-out group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'}`}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <div>
        <button className="flex items-center p-3 mb-1 hover:bg-gray-100 rounded-md w-full group">
          <Menu className="h-6 w-6 mr-4 transition-transform duration-200 ease-in-out group-hover:scale-110" />
          <span>더 보기</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

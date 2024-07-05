'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'

import {
  Home,
  Search,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  Instagram,
  Menu,
} from 'lucide-react'

import { Avatar, AvatarImage } from '#components/ui/avatar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserStore } from '#store/client/user.store'
import { cn } from 'utils/utils'

const SearchSheet = dynamic(
  () => import('#components/layout/sidebar-utils/searchSheet'),
)

const AlarmSheet = dynamic(
  () => import('#components/layout/sidebar-utils/alarmSheet'),
)

const ModalMenu = dynamic(
  () => import('#components/layout/sidebar-utils/modalMenu'),
  {
    loading: () => (
      <div className="flex items-center p-3 mb-1 hover:bg-gray-light rounded-lg w-full group">
        <Menu className="xl:mr-4 group-hover:scale-110 transition duration-200 ease-in-out" />
        <span className="hidden xl:inline">더 보기</span>
      </div>
    ),
  },
)

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    { name: '프로필', icon: Home, path: `/${userName}` },
  ]

  return (
    <aside
      className={cn(
        'hidden z-50 md:flex md:w-[73px] xl:w-[245px] 3xl:w-[336px] h-screen bg-white border-r border-gray-300 fixed left-0 top-0 flex-col justify-between pt-2 px-3 pb-5',
        'transition-width duration-500 ease-in-out',
        isModalOpen && 'xl:w-[73px] 3xl:w-[73px]',
      )}
    >
      <div>
        <div className="relative h-[73px] mb-6">
          <div
            className={cn(
              'absolute w-0 h-0 xl:min-w-40 xl:min-h-40 pt-8 px-3 pb-4 opacity-0 xl:opacity-100 transition-opacity duration-500 ease-in-out',
              isModalOpen && 'xl:opacity-0',
            )}
          >
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
          <div
            className={cn(
              'absolute w-full max-w-12 scale-100 xl:scale-0 transition duration-500 ease-in-out',
              isModalOpen && 'xl:scale-100',
            )}
          >
            <div className="mt-4 pb-[23px]">
              <div className="p-3 my-1 group hover:bg-gray-light rounded-lg">
                <Instagram className="mr-4 group-hover:scale-110 transition duration-300 ease-in-out" />
              </div>
            </div>
          </div>
        </div>
        <nav>
          <ul>
            {menuItems.map((item) => {
              const isActive = activeItem === item.name

              const ItemChildren =
                item.name !== '프로필' ? (
                  <item.icon
                    className={cn(
                      `xl:mr-4 min-w-6 min-h-6 group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'} transition duration-200 ease-in-out`,
                      isModalOpen && 'xl:mr-0',
                    )}
                  />
                ) : (
                  <Avatar className="xl:mr-4 w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/145896782?v=4" />
                  </Avatar>
                )

              const NameChildren = (
                <span
                  className={cn(
                    'hidden xl:inline transition-all duration-500 ease-in-out',
                    isModalOpen ? 'xl:hidden' : 'xl:inline',
                    'whitespace-nowrap',
                  )}
                >
                  {item.name}
                </span>
              )

              return (
                <li key={item.name}>
                  {item.name === '만들기' && (
                    <Link
                      href={item.path || ''}
                      className={`flex items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`}
                      onClick={() => setActiveItem(item.name)}
                    >
                      {ItemChildren}
                      {NameChildren}
                    </Link>
                  )}
                  {item.name === '검색' && (
                    <SearchSheet
                      className={cn(
                        `flex relative w-full items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`,
                        isModalOpen &&
                          activeItem === '검색' &&
                          'py-[11px] border border-gray-300 max-w-12',
                      )}
                      onClick={() => setActiveItem(item.name)}
                      setIsModalOpen={setIsModalOpen}
                    >
                      {ItemChildren}
                      {NameChildren}
                    </SearchSheet>
                  )}
                  {item.name === '알림' && (
                    <AlarmSheet
                      className={cn(
                        `flex relative w-full items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`,
                        isModalOpen &&
                          activeItem === '알림' &&
                          'py-[11px] border border-gray-300 max-w-12',
                      )}
                      onClick={() => setActiveItem(item.name)}
                      setIsModalOpen={setIsModalOpen}
                    >
                      {ItemChildren}
                      {NameChildren}
                    </AlarmSheet>
                  )}
                  {item.path && (
                    <Link
                      href={item.path || ''}
                      className={`flex items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`}
                      onClick={() => setActiveItem(item.name)}
                    >
                      {ItemChildren}
                      {NameChildren}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
      <ModalMenu isModalOpen={isModalOpen} />
    </aside>
  )
}

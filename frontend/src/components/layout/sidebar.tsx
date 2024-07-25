'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useEffect, useMemo, useState } from 'react'

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
import { useSession } from 'next-auth/react'

import ImageWithLoad from '#components/feature/imageWithLoad'
import { ItemSkeleton } from '#components/layout/sidebar-utils/itemSkeleton'
import { Avatar } from '#components/ui/avatar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'
import { cn } from 'utils/utils'

/* dynamic import */
const SearchSheet = dynamic(
  () => import('#components/layout/sidebar-utils/searchSheet'),
  {
    loading: () => <ItemSkeleton name="검색" Icon={Search} />,
  },
)
const AlarmSheet = dynamic(
  () => import('#components/layout/sidebar-utils/alarmSheet'),
  {
    loading: () => <ItemSkeleton name="알림" Icon={Heart} />,
  },
)
const NewPost = dynamic(
  () => import('#components/layout/common-utils/make-post/newPost'),
  {
    loading: () => <ItemSkeleton name="만들기" Icon={PlusSquare} />,
  },
)
const ModalMenu = dynamic(
  () => import('#components/layout/sidebar-utils/modalMenu'),
  {
    loading: () => <ItemSkeleton name="더 보기" Icon={Menu} />,
  },
)
/* dynamic import */

export default function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { activeItem, setActiveItem } = useSidebarStore()
  const { imageUrl, initializeUserImage } = useUserImageStore()

  const { data: session } = useSession()

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!imageUrl && session?.user?.name)
      initializeUserImage(session?.user?.name)
  }, [imageUrl, initializeUserImage, session?.user?.name])

  useEffect(() => {
    if (pathname?.startsWith('/direct')) setIsModalOpen(true)
    else if (
      activeItem !== '만들기' &&
      activeItem !== '검색' &&
      activeItem !== '알림'
    )
      setIsModalOpen(false)
  }, [activeItem, pathname])

  function handleClickHome() {
    setActiveItem('홈')
    router.push('/')
  }

  const menuItems = useMemo(
    () => [
      { name: '홈', icon: Home, path: '/' },
      { name: '검색', icon: Search },
      { name: '탐색', icon: Compass, path: '/explore' },
      { name: '릴스', icon: Film, path: '/reels' },
      { name: '메시지', icon: Send, path: '/direct' },
      { name: '알림', icon: Heart },
      { name: '만들기', icon: PlusSquare },
      { name: '프로필', icon: Home, path: `/${session?.user?.name}` },
    ],
    [session],
  )

  const NavItem = menuItems.map((item) => {
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
        <Avatar
          className={`xl:mr-4 w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out ${isActive ? 'border-2 border-black' : ''}`}
        >
          <ImageWithLoad
            src={imageUrl || '/images/avatar-default.jpg'}
            className="object-cover"
            alt="avatar iamge"
            fill
            sizes="(max-width: 640px) 3rem, (max-width: 768px) 4rem, 6rem"
          />
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
          <NewPost
            className={`flex relative w-full items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`}
          >
            {ItemChildren}
            {NameChildren}
          </NewPost>
        )}
        {item.name === '검색' && (
          <SearchSheet
            setIsModalOpen={setIsModalOpen}
            className={cn(
              `flex relative w-full items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`,
              isModalOpen &&
                activeItem === '검색' &&
                'py-[11px] border border-gray-300 max-w-12',
            )}
          >
            {ItemChildren}
            {NameChildren}
          </SearchSheet>
        )}
        {item.name === '알림' && (
          <AlarmSheet
            setIsModalOpen={setIsModalOpen}
            className={cn(
              `flex relative w-full items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`,
              isModalOpen &&
                activeItem === '알림' &&
                'py-[11px] border border-gray-300 max-w-12',
            )}
          >
            {ItemChildren}
            {NameChildren}
          </AlarmSheet>
        )}
        {item.path && (
          <Link
            href={item.path || ''}
            onClick={() => setActiveItem(item.name)}
            className={`flex items-center p-3 my-2 hover:bg-gray-light rounded-lg group ${isActive ? 'font-bold' : ''}`}
          >
            {ItemChildren}
            {NameChildren}
          </Link>
        )}
      </li>
    )
  })

  return (
    <div
      className={cn(
        'hidden z-50 md:flex md:w-[73px] xl:w-[245px] 3xl:w-[336px] h-screen',
        pathname?.startsWith('/direct') && 'xl:w-[73px] 3xl:w-[73px]',
      )}
    >
      <aside
        className={cn(
          'fixed hidden z-50 md:flex md:w-[73px] xl:w-[245px] 3xl:w-[336px] h-screen bg-white border-r border-gray-300 left-0 top-0 flex-col justify-between pt-2 px-3 pb-5',
          'transition-width duration-300 ease-in-out',
          isModalOpen && 'xl:w-[73px] 3xl:w-[73px]',
        )}
      >
        <div>
          <div className="relative h-[73px] mb-6">
            <div
              className={cn(
                'absolute w-0 xl:min-w-40 pt-8 px-3 pb-4 opacity-0 xl:opacity-100 transition-opacity duration-500 ease-in-out',
                isModalOpen && 'xl:opacity-0',
                activeItem === '메시지' && 'hidden',
              )}
            >
              <Image
                onClick={handleClickHome}
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
                <div
                  className="p-3 my-1 group hover:bg-gray-light rounded-lg"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleClickHome()
                  }}
                  onClick={handleClickHome}
                >
                  <Instagram className="mr-4 group-hover:scale-110 transition duration-300 ease-in-out" />
                </div>
              </div>
            </div>
          </div>
          <nav>
            <ul>{NavItem}</ul>
          </nav>
        </div>
        <ModalMenu isModalOpen={isModalOpen} />
      </aside>
    </div>
  )
}

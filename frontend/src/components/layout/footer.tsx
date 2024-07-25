'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

import { useEffect, useMemo } from 'react'

import { Home, Compass, Film, PlusSquare, User, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'

import ImageWithLoad from '#components/feature/imageWithLoad'
import { Avatar } from '#components/ui/avatar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'

const NewPost = dynamic(
  () => import('#components/layout/common-utils/make-post/newPost'),
  {
    loading: () => (
      <div className="flex flex-col w-12 h-full items-center justify-center text-gray-500">
        <PlusSquare className="group-hover:scale-110 text-gray-500 transition duration-200 ease-in-out" />
      </div>
    ),
  },
)

export default function Footer() {
  const { activeItem, setActiveItem } = useSidebarStore()
  const { imageUrl, initializeUserImage } = useUserImageStore()

  const { data: session } = useSession()

  useEffect(() => {
    if (!imageUrl && session?.user?.name)
      initializeUserImage(session?.user?.name)
  }, [imageUrl, initializeUserImage, session?.user?.name])

  const menuItems = useMemo(
    () => [
      { name: '홈', icon: Home, path: '/' },
      { name: '탐색', icon: Compass, path: '/explore' },
      { name: '릴스', icon: Film, path: '/reels' },
      { name: '만들기', icon: PlusSquare },
      { name: '메시지', icon: Send, path: '/direct' },
      { name: '프로필', icon: User, path: `/${session?.user?.name}` },
    ],
    [session],
  )

  return (
    <footer className="md:hidden fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-gray-300">
      <nav className="flex justify-evenly items-center h-12">
        {menuItems.map((item) => {
          const isActive = activeItem === item.name

          const ItemChildren =
            item.name !== '프로필' ? (
              <item.icon
                className={`group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'} transition duration-200 ease-in-out`}
              />
            ) : (
              <Avatar
                className={`w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out ${isActive ? 'border-2 border-black' : ''}`}
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

          return item.name === '만들기' ? (
            <NewPost
              key={item.name}
              className={`flex flex-col w-12 h-full items-center justify-center ${isActive ? 'text-black' : 'text-gray-500'}`}
            >
              {ItemChildren}
            </NewPost>
          ) : (
            <Link
              key={item.name}
              href={item.path || '#'}
              className={`flex flex-col w-12 h-full items-center justify-center ${isActive ? 'text-black' : 'text-gray-500'}`}
              onClick={() => setActiveItem(item.name)}
            >
              {ItemChildren}
            </Link>
          )
        })}
      </nav>
    </footer>
  )
}

'use client'

import { usePathname } from 'next/navigation'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Footer from '#components/layout/footer'
import Sidebar from '#components/layout/sidebar'
import { useLoadingState } from '#store/client/loading.store'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'

export default function ActiveLayout() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const setActiveItem = useSidebarStore((state) => state.setActiveItem)
  const { imageUrl, initializeUserImage } = useUserImageStore()
  const { isLoading, setIsLoading } = useLoadingState()

  useEffect(() => {
    setIsLoading(false)

    let activeItem = '홈'
    if (pathname === '/explore') activeItem = '탐색'
    else if (pathname === '/reels') activeItem = '릴스'
    else if (pathname?.startsWith('/direct')) activeItem = '메시지'
    else if (pathname === '/' + session?.user?.name) activeItem = '프로필'

    setActiveItem(activeItem)
  }, [setIsLoading, pathname, session?.user?.name, setActiveItem])

  useEffect(() => {
    if (!imageUrl && session?.user?.name)
      initializeUserImage(session?.user?.name)
  }, [imageUrl, initializeUserImage, session?.user?.name])

  return (
    <>
      {isLoading && (
        <div className="fixed top-0 left-1/2 h-1 w-[100vw] transform -translate-x-1/2 animate-rainbow-move bg-gradient-to-r from-red-500 via-yellow-500 to-purple-500" />
      )}
      <Sidebar />
      <Footer />
    </>
  )
}

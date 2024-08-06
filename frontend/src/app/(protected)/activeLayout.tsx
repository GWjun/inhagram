'use client'

import { usePathname } from 'next/navigation'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Footer from '#components/layout/footer'
import Sidebar from '#components/layout/sidebar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'

export default function ActiveLayout() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const setActiveItem = useSidebarStore((state) => state.setActiveItem)
  const { imageUrl, initializeUserImage } = useUserImageStore()

  useEffect(() => {
    let activeItem = '홈'

    if (pathname === '/explore') activeItem = '탐색'
    else if (pathname === '/reels') activeItem = '릴스'
    else if (pathname?.startsWith('/direct')) activeItem = '메시지'
    else if (pathname === '/' + session?.user?.name) activeItem = '프로필'

    setActiveItem(activeItem)
  }, [pathname, session?.user?.name, setActiveItem])

  useEffect(() => {
    if (!imageUrl && session?.user?.name)
      initializeUserImage(session?.user?.name)
  }, [imageUrl, initializeUserImage, session?.user?.name])

  return (
    <>
      <Sidebar />
      <Footer />
    </>
  )
}

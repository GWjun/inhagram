'use client'

import { usePathname } from 'next/navigation'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Footer from '#components/layout/footer'
import Sidebar from '#components/layout/sidebar'
import { useSidebarStore } from '#store/client/sidebar.store'

export default function ActiveLayout() {
  const setActiveItem = useSidebarStore((state) => state.setActiveItem)
  const { data: session } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    let activeItem = '홈'

    if (pathname === '/explore') activeItem = '탐색'
    else if (pathname === '/reels') activeItem = '릴스'
    else if (pathname?.startsWith('/direct')) activeItem = '메시지'
    else if (pathname === '/' + session?.user?.name) activeItem = '프로필'

    setActiveItem(activeItem)
  }, [pathname, session, setActiveItem])

  return (
    <>
      <Sidebar />
      <Footer />
    </>
  )
}

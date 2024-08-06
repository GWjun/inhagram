'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

import { useEffect } from 'react'

import { Menu } from 'lucide-react'

import SideNavItem from '#components/layout/sidebar-utils/item/sideNavItem'
import SideTopItem from '#components/layout/sidebar-utils/item/sideTopItem'
import { ItemSkeleton } from '#components/layout/sidebar-utils/itemSkeleton'
import { SideMenuItems } from '#components/layout/SideMenuItems'
import { useShrinkStore, useSidebarStore } from '#store/client/sidebar.store'
import { cn } from 'utils/utils'

const ModalMenu = dynamic(
  () => import('#components/layout/sidebar-utils/modalMenu'),
  {
    loading: () => <ItemSkeleton name="더 보기" Icon={Menu} />,
  },
)

export default function Sidebar() {
  const { isShrink, setIsShrink } = useShrinkStore()
  const activeItem = useSidebarStore((state) => state.activeItem)

  const pathname = usePathname()

  useEffect(() => {
    if (pathname?.startsWith('/direct')) setIsShrink(true)
    else {
      const itemsWithPath = SideMenuItems.filter((item) =>
        Object.prototype.hasOwnProperty.call(item, 'path'),
      )
      const names = itemsWithPath.map((item) => item.name)
      if (names.includes(activeItem)) setIsShrink(false)
    }
  }, [activeItem, pathname, setIsShrink])

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
          isShrink && 'xl:w-[73px] 3xl:w-[73px]',
        )}
      >
        <div>
          <SideTopItem />
          <SideNavItem />
        </div>
        <ModalMenu />
      </aside>
    </div>
  )
}

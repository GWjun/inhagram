import dynamic from 'next/dynamic'
import Link from 'next/link'

import { Heart, PlusSquare, Search } from 'lucide-react'

import { ItemSkeleton } from '#components/layout/sidebar-utils/itemSkeleton'
import { SideMenuItems } from '#components/layout/SideMenuItems'
import { useShrinkStore, useSidebarStore } from '#store/client/sidebar.store'
import { cn } from '#utils/utils'

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

interface RenderMenuItemProps {
  item: (typeof SideMenuItems)[0]
}

export default function RenderMenuItem({ item }: RenderMenuItemProps) {
  const isShrink = useShrinkStore((state) => state.isShrink)
  const { activeItem, setActiveItem } = useSidebarStore()
  const isActive = activeItem === item.name

  const commonClasses = cn(
    'flex items-center w-full p-3 my-2 hover:bg-gray-light rounded-lg group',
    isActive && 'font-bold',
  )

  const classNameWithBorder = cn(
    commonClasses,
    isShrink && isActive && 'py-[11px] border border-gray-300 max-w-12',
  )

  const IconComponent = (
    <item.icon
      className={cn(
        `xl:mr-4 min-w-6 min-h-6 group-hover:scale-110 ${isActive ? 'text-black' : 'text-gray-500'} transition duration-200 ease-in-out`,
        isShrink && 'xl:mr-0',
      )}
    />
  )

  const NameComponent = (
    <span
      className={cn(
        'hidden xl:inline transition-all duration-500 ease-in-out',
        isShrink ? 'xl:hidden' : 'xl:inline',
        'whitespace-nowrap',
      )}
    >
      {item.name}
    </span>
  )

  switch (item.name) {
    case '검색':
      return (
        <SearchSheet className={classNameWithBorder}>
          {IconComponent}
          {NameComponent}
        </SearchSheet>
      )
    case '알림':
      return (
        <AlarmSheet className={classNameWithBorder}>
          {IconComponent}
          {NameComponent}
        </AlarmSheet>
      )
    case '만들기':
      return (
        <NewPost className={commonClasses}>
          {IconComponent}
          {NameComponent}
        </NewPost>
      )
    default:
      return (
        <Link
          href={item.path || ''}
          onClick={() => setActiveItem(item.name)}
          className={commonClasses}
        >
          {IconComponent}
          {NameComponent}
        </Link>
      )
  }
}

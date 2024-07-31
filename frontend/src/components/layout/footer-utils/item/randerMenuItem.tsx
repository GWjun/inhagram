import dynamic from 'next/dynamic'
import Link from 'next/link'

import { PlusSquare } from 'lucide-react'

import { SideMenuItems } from '#components/layout/SideMenuItems'
import { useSidebarStore } from '#store/client/sidebar.store'

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

export const RenderMenuItem = ({
  item,
}: {
  item: (typeof SideMenuItems)[0]
}) => {
  const { activeItem, setActiveItem } = useSidebarStore()
  const isActive = activeItem === item.name

  const ItemChildren = (
    <item.icon
      className={`group-hover:scale-110 ${
        isActive ? 'text-black' : 'text-gray-500'
      } transition duration-200 ease-in-out`}
    />
  )

  const commonClassName = `flex flex-col w-12 h-full items-center justify-center ${
    isActive ? 'text-black' : 'text-gray-500'
  }`

  if (item.name === '만들기')
    return <NewPost className={commonClassName}>{ItemChildren}</NewPost>

  return (
    <Link
      href={item.path || '#'}
      className={commonClassName}
      onClick={() => setActiveItem(item.name)}
    >
      {ItemChildren}
    </Link>
  )
}

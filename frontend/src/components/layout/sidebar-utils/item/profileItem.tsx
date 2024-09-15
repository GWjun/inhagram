import Image from 'next/image'

import { useSession } from 'next-auth/react'

import Link from '#components/feature/common/link'
import { ProfileItemGenerator } from '#components/layout/SideMenuItems'
import { Avatar } from '#components/ui/avatar'
import { useShrinkStore, useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'
import { cn } from '#utils/utils'

export default function ProfileItem() {
  const { data: session } = useSession()

  const isShrink = useShrinkStore((state) => state.isShrink)
  const { activeItem, setActiveItem } = useSidebarStore()
  const imageUrl = useUserImageStore((state) => state.imageUrl)

  if (!session?.user?.name) return null
  const ProfileItem = ProfileItemGenerator(session.user.name)

  return (
    <Link
      href={ProfileItem.path || ''}
      onClick={() => setActiveItem(ProfileItem.name)}
      className={cn(
        'flex items-center p-3 my-2 hover:bg-gray-light rounded-lg group',
        activeItem === '프로필' && 'font-bold',
      )}
    >
      <Avatar
        className={cn(
          'xl:mr-4 w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out',
          activeItem === '프로필' && 'border-2 border-black',
        )}
      >
        <Image
          src={imageUrl || '/images/assets/avatar-default.jpg'}
          className="object-cover"
          alt="avatar image"
          fill
          sizes="(max-width: 640px) 3rem, (max-width: 768px) 4rem, 6rem"
        />
      </Avatar>
      <span
        className={cn(
          'hidden xl:inline transition-all duration-500 ease-in-out',
          isShrink ? 'xl:hidden' : 'xl:inline',
          'whitespace-nowrap',
        )}
      >
        {ProfileItem.name}
      </span>
    </Link>
  )
}

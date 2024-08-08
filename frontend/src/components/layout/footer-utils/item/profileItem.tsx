import Link from 'next/link'

import { useSession } from 'next-auth/react'

import ImageWithLoad from '#components/feature/image/imageWithLoad'
import { ProfileItemGenerator } from '#components/layout/SideMenuItems'
import { Avatar } from '#components/ui/avatar'
import { useSidebarStore } from '#store/client/sidebar.store'
import { useUserImageStore } from '#store/client/user.store'
import { cn } from '#utils/utils'

export default function ProfileItem() {
  const { data: session } = useSession()

  const { activeItem, setActiveItem } = useSidebarStore()
  const imageUrl = useUserImageStore((state) => state.imageUrl)

  if (!session?.user?.name) return null
  const ProfileItem = ProfileItemGenerator(session.user.name)

  return (
    <Link
      key={ProfileItem.name}
      href={ProfileItem.path || '#'}
      className={cn(
        `flex flex-col w-12 h-full items-center justify-center`,
        activeItem === '프로필' ? 'text-black' : 'text-gray-500',
      )}
      onClick={() => setActiveItem(ProfileItem.name)}
    >
      <Avatar
        className={cn(
          `w-6 h-6 group-hover:scale-110 transition duration-200 ease-in-out`,
          activeItem === '프로필' && 'border-2 border-black',
        )}
      >
        <ImageWithLoad
          src={imageUrl || '/images/assets/avatar-default.jpg'}
          className="object-cover"
          alt="avatar iamge"
          fill
          sizes="(max-width: 640px) 3rem, (max-width: 768px) 4rem, 6rem"
        />
      </Avatar>
    </Link>
  )
}

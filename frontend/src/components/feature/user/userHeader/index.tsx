import Image from 'next/image'

import { cva, VariantProps } from 'class-variance-authority'

import Link from '#components/feature/common/link'
import { Avatar } from '#components/ui/avatar'
import { BasicUser, SimpleUser } from '#types/user.type'
import { cn } from '#utils/utils'

const userHeaderVariants = cva('flex justify-between items-center my-2', {
  variants: {
    size: {
      small: 'py-1 px-2',
      default: 'py-2 px-4',
      large: 'py-3 px-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const avatarVariants = cva(
  'group-hover:scale-110 transition duration-200 ease-in-out',
  {
    variants: {
      size: {
        small: 'w-8 h-8',
        default: 'w-10 h-10',
        large: 'w-12 h-12',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

const nicknameVariants = cva('ml-3', {
  variants: {
    size: {
      small: 'text-sm',
      default: 'text-base',
      large: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface UserHeaderProps extends VariantProps<typeof userHeaderVariants> {
  user: BasicUser | SimpleUser
}

export default function UserHeader({ user, size }: UserHeaderProps) {
  return (
    <Link
      href={`/${user.nickname}`}
      className={cn(userHeaderVariants({ size }))}
    >
      <div className="flex items-center">
        <Avatar className={cn(avatarVariants({ size }))}>
          <Image
            src={user.image || '/images/assets/avatar-default.jpg'}
            alt="user avatar"
            width={size === 'large' ? 48 : size === 'small' ? 32 : 40}
            height={size === 'large' ? 48 : size === 'small' ? 32 : 40}
            className="object-cover rounded-full"
            priority
          />
        </Avatar>
        <span className={cn(nicknameVariants({ size }))}>{user.nickname}</span>
      </div>
    </Link>
  )
}

import { memo } from 'react'

import { cva, type VariantProps } from 'class-variance-authority'

import { Skeleton } from '#components/ui/skeleton'
import { cn } from '#utils/utils'

const userSkeletonVariants = cva('flex items-center w-full', {
  variants: {
    size: {
      small: 'h-16 gap-3',
      default: 'h-20 gap-4',
      large: 'h-24 gap-6',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const avatarVariants = cva('rounded-full', {
  variants: {
    size: {
      small: 'h-10 w-10',
      default: 'h-14 w-14',
      large: 'h-18 w-18',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

const textVariants = cva('space-y-2', {
  variants: {
    size: {
      small: 'space-y-1',
      default: 'space-y-2',
      large: 'space-y-3',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

interface UserSkeletonProps extends VariantProps<typeof userSkeletonVariants> {
  count: number
  containerStyle?: string
  textStyle?: string
}

function UserSkeleton({
  count,
  size,
  containerStyle,
  textStyle,
}: UserSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(userSkeletonVariants({ size }), containerStyle)}
        >
          <Skeleton className={avatarVariants({ size })} />
          <div className={cn(textVariants({ size }), textStyle)}>
            <Skeleton
              className={cn('h-4 w-[250px]', {
                'h-3 w-[200px]': size === 'small',
                'h-5 w-[300px]': size === 'large',
              })}
            />
            <Skeleton
              className={cn('h-4 w-[200px]', {
                'h-3 w-[150px]': size === 'small',
                'h-5 w-[250px]': size === 'large',
              })}
            />
          </div>
        </div>
      ))}
    </>
  )
}

export default memo(UserSkeleton)

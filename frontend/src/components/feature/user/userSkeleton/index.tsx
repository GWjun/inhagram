import { Skeleton } from '#components/ui/skeleton'
import { cn } from '#utils/utils'
import { memo } from 'react'

interface UserSkeletonProps {
  count: number
  containerStyle?: string
  textStyle?: string
}

function UserSkeleton({ count, containerStyle, textStyle }: UserSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn('flex items-center gap-4 w-full h-20', containerStyle)}
        >
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className={cn('space-y-2', textStyle)}>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  )
}

export default memo(UserSkeleton)

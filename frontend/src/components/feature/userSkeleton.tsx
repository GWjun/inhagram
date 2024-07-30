import { Skeleton } from '#components/ui/skeleton'
import { cn } from '#utils/utils'

interface UserSkeletonProps {
  count: number
  containerStyle?: string
  textClassName?: string
}

export default function UserSkeleton({
  count,
  containerStyle,
  textClassName,
}: UserSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn('flex items-center gap-4 w-full h-20', containerStyle)}
        >
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className={cn('space-y-2', textClassName)}>
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </>
  )
}

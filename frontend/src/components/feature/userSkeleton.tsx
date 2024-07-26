import { Skeleton } from '#components/ui/skeleton'
import { cn } from '#utils/utils'

interface UserSkeletonProps {
  count: number
  textClassName?: string
}

export default function UserSkeleton({
  count,
  textClassName,
}: UserSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 w-full h-20 px-6">
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

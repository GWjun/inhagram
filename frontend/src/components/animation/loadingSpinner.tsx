import { Loader2 } from 'lucide-react'

import { cn } from 'utils/utils'

interface SpinnerProps {
  variant?: string
  className?: string
}

export default function LoadingSpinner({ className, variant }: SpinnerProps) {
  return (
    <div
      className={cn(
        'flex justify-center items-center',
        variant === 'inset' && 'w-full h-full',
      )}
    >
      <Loader2
        className={cn('h-4 w-4 animate-spin text-gray-400', className)}
      />
    </div>
  )
}

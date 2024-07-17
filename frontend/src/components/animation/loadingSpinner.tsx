import { Loader2 } from 'lucide-react'

import { cn } from 'utils/utils'

export default function LoadingSpinner({ className }: { className?: string }) {
  return (
    <div className="flex justify-center items-center">
      <Loader2
        className={cn('h-4 w-4 animate-spin text-gray-400', className)}
      />
    </div>
  )
}

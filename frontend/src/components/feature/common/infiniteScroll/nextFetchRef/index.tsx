import { forwardRef } from 'react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import { cn } from '#utils/utils'

interface NextFetchRefProps {
  isLoading: boolean
  spinnerStyle?: string
  containerStyle?: string
}

const NextFetchRef = forwardRef<HTMLDivElement, NextFetchRefProps>(
  ({ isLoading, spinnerStyle, containerStyle }, ref) => {
    return (
      <>
        {isLoading ? (
          <LoadingSpinner className={cn('w-8 h-8 mt-5', spinnerStyle)} />
        ) : (
          <div className={containerStyle} ref={ref} />
        )}
      </>
    )
  },
)

NextFetchRef.displayName = 'NextFetchRef'

export default NextFetchRef

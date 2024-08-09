import { useCallback } from 'react'

import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollProps {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export default function useInfiniteScroll({
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: UseInfiniteScrollProps) {
  const { ref } = useInView({
    onChange: useCallback(
      (inView: boolean) => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
      },
      [fetchNextPage, hasNextPage, isFetchingNextPage],
    ),
  })

  return { ref }
}

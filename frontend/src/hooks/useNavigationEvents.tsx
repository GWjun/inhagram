/* eslint-disable promise/prefer-await-to-callbacks */
import { usePathname, useSearchParams } from 'next/navigation'

import { useEffect } from 'react'

export default function useNavigationEvents(callback: () => void) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    callback()
  }, [pathname, searchParams, callback])
}

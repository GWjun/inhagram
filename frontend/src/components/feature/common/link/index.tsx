'use client'

import NextLink from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { useTransition } from 'react'

import { useLoadingState } from '#store/client/loading.store'

/**
 * A custom Link component that wraps Next.js's next/link component.
 */
export default function Link({
  href,
  children,
  replace,
  onClick,
  ...props
}: Parameters<typeof NextLink>[0]) {
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()
  const setIsLoading = useLoadingState((state) => state.setIsLoading)

  return (
    <NextLink
      href={href}
      onClick={(e) => {
        e.preventDefault()
        if (onClick) onClick(e)

        startTransition(() => {
          if (href !== pathname) setIsLoading(true)
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          const url = href.toString()
          if (replace) router.replace(url)
          else router.push(url)
        })
      }}
      {...props}
    >
      {children}
    </NextLink>
  )
}

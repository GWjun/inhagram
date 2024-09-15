'use client'

import Image from 'next/image'

import { useEffect, useState } from 'react'

export default function LoadingIcon() {
  const [isFirstLoad, setIsFirstLoad] = useState(false)

  useEffect(() => {
    window.addEventListener('beforeunload', () => setIsFirstLoad(true))
    return () => {
      window.removeEventListener('beforeunload', () => setIsFirstLoad(false))
    }
  }, [setIsFirstLoad])

  return (
    isFirstLoad && (
      <div className="fixed inset-0 flex justify-center items-center bg-white z-[9999] pointer-events-none">
        <Image
          src="/images/static/instagram-logo-outline.svg"
          width={70}
          height={70}
          alt="loading icon"
          priority
        />
      </div>
    )
  )
}

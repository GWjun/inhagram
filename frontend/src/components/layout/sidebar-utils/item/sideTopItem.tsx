'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Instagram } from 'lucide-react'

import { useShrinkStore, useSidebarStore } from '#store/client/sidebar.store'
import { cn } from '#utils/utils'

export default function SideTopItem() {
  const router = useRouter()

  const isShrink = useShrinkStore((state) => state.isShrink)
  const { activeItem, setActiveItem } = useSidebarStore()

  function handleClickHome() {
    setActiveItem('홈')
    router.push('/')
  }

  return (
    <div className="relative h-[73px] mb-6">
      <div
        className={cn(
          'absolute w-0 xl:min-w-40 pt-8 px-3 pb-4 opacity-0 xl:opacity-100 transition-opacity duration-500 ease-in-out',
          isShrink && 'xl:opacity-0',
          activeItem === '메시지' && 'hidden',
        )}
      >
        <Image
          onClick={handleClickHome}
          src="/images/static/text-icon.svg"
          alt="instagram text logo"
          width={103}
          height={32}
        />
      </div>
      <div
        className={cn(
          'absolute w-full max-w-12 scale-100 xl:scale-0 transition duration-500 ease-in-out',
          isShrink && 'xl:scale-100',
        )}
      >
        <div className="mt-4 pb-[23px]">
          <div
            className="p-3 my-1 group hover:bg-gray-light rounded-lg"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') handleClickHome()
            }}
            onClick={handleClickHome}
          >
            <Instagram className="mr-4 group-hover:scale-110 transition duration-300 ease-in-out" />
          </div>
        </div>
      </div>
    </div>
  )
}

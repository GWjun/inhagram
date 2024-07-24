'use client'

import { usePathname } from 'next/navigation'

import { LucideProps } from 'lucide-react'

interface ItemSkeletonProps {
  name: string
  Icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >
}

export function ItemSkeleton({ name, Icon }: ItemSkeletonProps) {
  const pathname = usePathname()

  return (
    <div
      className={`flex items-center p-3 ${name !== '더 보기' ? 'my-2' : 'mb-1'} hover:bg-gray-light rounded-lg w-full group`}
    >
      <Icon
        className={`xl:mr-4 group-hover:scale-110 ${name !== '더 보기' ? 'text-gray-500' : ''} transition duration-200 ease-in-out`}
      />
      <span className="hidden xl:inline">
        {pathname?.startsWith('/direct') ? '' : name}
      </span>
    </div>
  )
}

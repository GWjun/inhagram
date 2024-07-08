import { useState } from 'react'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '#components/ui/sheet'
import { useSidebarStore } from '#store/client/sidebar.store'

interface SheetProps {
  children: React.ReactNode
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  className?: string
}

export default function AlarmSheet({
  children,
  setIsModalOpen,
  ...props
}: SheetProps) {
  const [prevItem, setPrevItem] = useState('')

  const { activeItem, setActiveItem } = useSidebarStore()

  function handleClick() {
    setPrevItem(activeItem)
    setActiveItem('알림')
  }

  function handleChange(open: boolean) {
    setIsModalOpen(open)
    if (!open) setActiveItem(prevItem)
  }

  return (
    <Sheet onOpenChange={handleChange}>
      <SheetTrigger className={props.className} onClick={handleClick}>
        {children}
      </SheetTrigger>
      <SheetContent side="left_on_sidebar">
        <SheetHeader>
          <SheetTitle>Are you absolutely sure?</SheetTitle>
          <SheetDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

'use client'

import { usePathname, useRouter } from 'next/navigation'

import { useEffect, useState } from 'react'

import Post from '#components/feature/post'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#components/ui/dialog'
import useNavigationEvents from '#hooks/useNavigationEvents'

export default function PostModal({ params }: { params: { id: string } }) {
  const router = useRouter()
  const pathname = usePathname()

  const [dialogOpen, setDialogOpen] = useState(true)

  useNavigationEvents(() => {
    if (!pathname || pathname.startsWith('/post')) return
    setDialogOpen(false)
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDialogOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.addEventListener('keydown', handleKeyDown)
  }, [])

  function handleOutsidePage() {
    setDialogOpen(false)
    router.back()
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        onInteractOutside={handleOutsidePage}
        className="max-w-[90vw] h-full max-h-[80vh] md:max-w-[80vw] md:h-auto aspect-4/3 3xl:max-w-[1800px] p-0 rounded-lg"
      >
        <Post postId={params.id} />

        <DialogTitle className="hidden" />
        <DialogDescription className="hidden" />
      </DialogContent>
    </Dialog>
  )
}

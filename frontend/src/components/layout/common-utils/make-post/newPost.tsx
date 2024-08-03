'use client'

import { useState, useEffect, ReactNode } from 'react'

import { useMutationState } from '@tanstack/react-query'

import PostAlert from '#components/layout/common-utils/make-post/postAlert'
import PostContent from '#components/layout/common-utils/make-post/postContent'
import PostHeader from '#components/layout/common-utils/make-post/postHeader'
import { Dialog, DialogContent, DialogTrigger } from '#components/ui/dialog'
import {
  Page,
  resetAllStores,
  usePageStore,
  useUrlStore,
} from '#store/client/makepost.store'
import { addPostMutationKey } from '#store/server/post.queries'
import { cn } from '#utils/utils'

interface NewPostProps {
  children: ReactNode
  className?: string
}

export default function NewPost({ children, ...props }: NewPostProps) {
  const { page } = usePageStore()
  const { previewUrls } = useUrlStore()
  const status = useMutationState({
    filters: { mutationKey: addPostMutationKey },
    select: (mutation) => mutation.state.status,
  })

  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape')
        if (previewUrls.length !== 0 && !alertOpen) setAlertOpen(true)
        else if (!alertOpen) setDialogOpen(false)
        else setAlertOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewUrls.length, alertOpen])

  function handleOutsidePage(e: CustomEvent) {
    if (status[0] === 'success' || previewUrls.length === 0) {
      setDialogOpen(false)
      resetAllStores()
    } else {
      e.preventDefault()
      setAlertOpen(true)
    }
  }

  return (
    <Dialog open={dialogOpen}>
      <DialogTrigger
        className={props.className}
        onClick={() => setDialogOpen(true)}
      >
        {children}
      </DialogTrigger>

      <DialogContent
        onInteractOutside={handleOutsidePage}
        className={cn(
          'grid-rows-[auto_1fr] gap-0 w-full h-full p-0 max-w-[90vw] max-h-[50vh] md:max-w-[700px] md:max-h-[730px] 2xl:max-w-[870px] 2xl:max-h-[900px]',
          page !== Page.Image && 'md:max-w-[85vw] 2xl:max-w-[85vw]',
          status.length && 'md:max-w-[700px] 2xl:max-w-[870px]',
        )}
      >
        <PostHeader setAlertOpen={setAlertOpen} />
        <PostContent />

        <PostAlert
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          setDialogOpen={setDialogOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

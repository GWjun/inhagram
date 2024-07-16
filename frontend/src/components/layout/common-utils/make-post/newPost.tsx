'use client'

import { useState, useEffect, useCallback } from 'react'

import { ArrowLeft, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

import CheckmarkAnimation from '#components/animation/checkMark'
import XMarkAnimation from '#components/animation/XMark'
import PostAlert from '#components/layout/common-utils/make-post/postAlert'
import PostContent from '#components/layout/common-utils/make-post/postContent'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog'
import {
  resetAllStores,
  useFormStore,
  usePageStore,
  useUrlStore,
} from '#store/client/makepost.store'
import { usePostDataMutation } from '#store/server/post.queries'
import { cn } from '#utils/utils'

interface NewPostProps {
  children: React.ReactNode
  className?: string
}

const LAST_PAGE = 1

export default function NewPost({ children, ...props }: NewPostProps) {
  const { data: session } = useSession()

  const { page } = usePageStore()
  const { previewUrls, imageUrls } = useUrlStore()
  const { title, content } = useFormStore()

  const { mutate, isSuccess, isError, isPending, reset } =
    usePostDataMutation(session)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  useEffect(() => {
    function handleDialogDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAlertOpen(true)
    }

    function handleAlertDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setAlertOpen(false)
    }

    if (dialogOpen && !alertOpen)
      window.addEventListener('keydown', handleDialogDown)
    else if (alertOpen) window.addEventListener('keydown', handleAlertDown)

    return () => {
      window.removeEventListener('keydown', handleDialogDown)
      window.removeEventListener('keydown', handleAlertDown)
    }
  }, [dialogOpen, alertOpen])

  useEffect(() => {
    if (isSuccess) resetAllStores()
  }, [isSuccess])

  function handleNextPage() {
    if (page === LAST_PAGE) handleSubmit()
    else usePageStore.setState((state) => ({ page: state.page + 1 }))
  }

  function handlePrevPage() {
    if (page === 0) setAlertOpen(true)
    else usePageStore.setState((state) => ({ page: state.page - 1 }))
  }

  function handleOutsidePage(e: CustomEvent) {
    if (previewUrls.length !== 0) {
      e.preventDefault()
      setAlertOpen(true)
    } else {
      setDialogOpen(false)
      reset()
    }
  }

  function handleSubmit() {
    mutate({ title, content, images: imageUrls })
  }

  const RenderContent = useCallback(() => {
    if (isPending) return <Loader2 className="h-4 w-4 animate-spin" />
    else if (isSuccess)
      return (
        <div className="flex flex-col justify-center items-center">
          <CheckmarkAnimation />
          <span className="text-lg mt-3">게시물이 공유되었습니다.</span>
        </div>
      )
    else if (isError)
      return (
        <div className="flex flex-col justify-center items-center">
          <XMarkAnimation />
          <span className="text-lg mt-3">
            게시물을 공유하는데 실패했습니다.
          </span>
        </div>
      )
    else return <PostContent />
  }, [isPending, isSuccess, isError])

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
          'grid-rows-[auto_1fr] gap-0 w-full h-full max-w-[47vw] max-h-[50vh] lg:max-h-[80vh] p-0',
          page !== 0 && 'max-w-[85vw]',
        )}
      >
        <DialogHeader className="justify-center h-11 border-b border-gray-300 space-y-0">
          <DialogTitle className="text-md text-center font-semibold">
            새 게시물 만들기
          </DialogTitle>
          <DialogDescription />
          {previewUrls.length > 0 && (
            <>
              <ArrowLeft
                className="absolute left-2 cursor-pointer"
                onClick={handlePrevPage}
              />
              <button
                className="absolute right-4 text-sm text-center font-semibold text-button"
                onClick={handleNextPage}
              >
                {page === LAST_PAGE ? '공유하기' : '다음'}
              </button>
            </>
          )}
        </DialogHeader>

        <RenderContent />
        <PostAlert
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          setDialogOpen={setDialogOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

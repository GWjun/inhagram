'use client'

import { useState, useEffect, useCallback } from 'react'

import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

import CheckmarkAnimation from '#components/animation/checkMark'
import LoadingSpinner from '#components/animation/loadingSpinner'
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
  Page,
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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape')
        if (previewUrls.length !== 0 && !alertOpen) setAlertOpen(true)
        else if (!alertOpen) setDialogOpen(false)
        else setAlertOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [previewUrls.length, alertOpen])

  function handleNextPage() {
    if (page === Page.Form) handleSubmit()
    usePageStore.setState((state) => ({ page: state.page + 1 }))
  }

  function handlePrevPage() {
    if (page === Page.Image) setAlertOpen(true)
    else {
      if (page === Page.Result) reset()
      usePageStore.setState((state) => ({ page: state.page - 1 }))
    }
  }

  function handleOutsidePage(e: CustomEvent) {
    if (isSuccess || previewUrls.length === 0) {
      setDialogOpen(false)
      resetAllStores()
      reset()
    } else {
      e.preventDefault()
      setAlertOpen(true)
    }
  }

  function handleSubmit() {
    mutate({ title, content, images: imageUrls })
  }

  const ResultContent = useCallback(() => {
    if (isPending) return <LoadingSpinner />
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
    else return <div>error</div>
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
          'grid-rows-[auto_1fr] gap-0 w-full h-full max-w-[90vw] md:max-w-[47vw] max-h-[50vh] lg:max-h-[80vh] p-0',
          page !== Page.Image && 'md:max-w-[85vw]',
          (isPending || isError || isSuccess) && 'md:max-w-[47vw]',
        )}
      >
        <DialogHeader className="justify-center h-11 border-b border-gray-300 space-y-0">
          <DialogTitle className="text-md text-center font-semibold">
            {page !== Page.Result ? '새 게시물 만들기' : '공유'}
          </DialogTitle>
          <DialogDescription />
          {previewUrls.length > 0 && (
            <>
              {!isSuccess && (
                <ArrowLeft
                  className="absolute left-2 cursor-pointer"
                  onClick={handlePrevPage}
                />
              )}
              {page !== Page.Result && (
                <button
                  className="absolute right-4 text-sm text-center font-semibold text-button"
                  onClick={handleNextPage}
                >
                  {page !== Page.Form ? '다음' : '공유하기'}
                </button>
              )}
            </>
          )}
        </DialogHeader>

        {page !== Page.Result ? <PostContent /> : <ResultContent />}
        <PostAlert
          alertOpen={alertOpen}
          setAlertOpen={setAlertOpen}
          setDialogOpen={setDialogOpen}
        />
      </DialogContent>
    </Dialog>
  )
}

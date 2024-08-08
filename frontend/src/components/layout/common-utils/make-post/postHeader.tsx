import { Dispatch, SetStateAction } from 'react'

import { useMutationState } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

import useFormRefContext from '#components/provider/formRefProvider/useFormRefContext'
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#components/ui/dialog'
import { Page, usePageStore, useUrlStore } from '#store/client/makepost.store'
import { addPostMutationKey } from '#store/server/post.queries'

export default function PostHeader({
  setAlertOpen,
}: {
  setAlertOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { handleSubmit } = useFormRefContext()

  const { page } = usePageStore()
  const { previewUrls } = useUrlStore()

  const status = useMutationState({
    filters: { mutationKey: addPostMutationKey },
    select: (mutation) => mutation.state.status,
  })

  function handleNextPage() {
    if (page === Page.Form) handleSubmit()
    usePageStore.setState((state) => ({ page: state.page + 1 }))
  }

  function handlePrevPage() {
    if (page === Page.Image) setAlertOpen(true)
    else usePageStore.setState((state) => ({ page: state.page - 1 }))
  }

  function HeaderContent() {
    if (!previewUrls.length) return null
    return (
      <>
        {status[0] !== 'success' && (
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
    )
  }

  return (
    <DialogHeader className="justify-center h-11 border-b border-gray-300 space-y-0">
      <DialogTitle className="text-md text-center font-semibold">
        {page !== Page.Result ? '새 게시물 만들기' : '공유'}
      </DialogTitle>
      <DialogDescription />
      <HeaderContent />
    </DialogHeader>
  )
}

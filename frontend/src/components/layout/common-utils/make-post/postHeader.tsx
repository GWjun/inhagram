import { Dispatch, SetStateAction } from 'react'

import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#components/ui/dialog'
import {
  Page,
  useFormStore,
  usePageStore,
  useUrlStore,
} from '#store/client/makepost.store'
import { usePostDataMutation } from '#store/server/post.queries'

export default function PostHeader({
  setAlertOpen,
}: {
  setAlertOpen: Dispatch<SetStateAction<boolean>>
}) {
  const { data: session } = useSession()

  const { page } = usePageStore()
  const { title, content } = useFormStore()
  const { previewUrls, imageUrls } = useUrlStore()
  const { mutate, isSuccess, reset } = usePostDataMutation(session)

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

  function handleSubmit() {
    mutate({ title, content, images: imageUrls })
  }

  function HeaderContent() {
    if (!previewUrls.length) return null
    return (
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

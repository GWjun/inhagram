import Image from 'next/image'

import { useRef } from 'react'

import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import PostForm from '#components/layout/common-utils/make-post/postForm'
import { Button } from '#components/ui/button'
import { Page, usePageStore, useUrlStore } from '#store/client/makepost.store'
import { useUploadImageMutation } from '#store/server/post.queries'
import { cn } from '#utils/utils'

export default function PostContent() {
  const { data: session } = useSession()

  const page = usePageStore((state) => state.page)
  const { previewUrls, addPreviewUrls } = useUrlStore()

  const { mutateAsync, isPending, isError, reset } =
    useUploadImageMutation(session)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]

      try {
        await mutateAsync(file)

        const previewUrl = await createPreviewUrl(file)
        addPreviewUrls(previewUrl)
      } catch (error) {
        console.error('file upload fail', error)
      }
    }
  }

  const DefaultContent = () => {
    if (isPending) return <LoadingSpinner />

    return (
      <>
        <Image
          src="/images/assets/make-icon.svg"
          width={100}
          height={100}
          alt="make-icon"
          priority
          decoding="sync"
        />
        <div className="text-xl p-2">사진과 동영상을 선택해 주세요.</div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button className="mt-2" onClick={() => fileInputRef.current?.click()}>
          기기에서 선택
        </Button>
      </>
    )
  }

  return (
    <div className="flex w-full h-full justify-center items-center">
      <section className="flex flex-col justify-center relative items-center w-full h-full gap-3">
        {previewUrls.length > 0 ? (
          <div className="min-w-[46vw] w-full h-full flex justify-center relative items-center bg-gray-100 rounded-b-xl">
            <Image
              src={previewUrls[0]}
              alt="Uploaded image"
              className={cn(
                'object-contain rounded-b-xl',
                page !== Page.Image && 'rounded-br-none',
              )}
              fill
            />
          </div>
        ) : (
          <DefaultContent />
        )}
      </section>
      {page === Page.Form && (
        <section className="w-full h-full max-w-[30vw] lg:max-w-[339px] border-l border-gray-300">
          <PostForm />
        </section>
      )}

      <Alert
        isOpen={isError}
        closeCallback={reset}
        title="실패"
        message="이미지 업로드에 실패했습니다."
      />
    </div>
  )
}

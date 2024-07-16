import Image from 'next/image'

import { useRef } from 'react'

import { Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'

import PostForm from '#components/layout/common-utils/make-post/postForm'
import { Button } from '#components/ui/button'
import { usePageStore, useUrlStore } from '#store/client/makepost.store'
import { useUploadImageMutation } from '#store/server/post.queries'
import { cn } from '#utils/utils'

const LAST_PAGE = 1

export default function PostContent() {
  const { data: session } = useSession()

  const page = usePageStore((state) => state.page)
  const { previewUrls, addPreviewUrls } = useUrlStore()

  const { mutate, isPending } = useUploadImageMutation(session)

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
      mutate(file)

      // 예외 처리 필요
      const previewUrl = await createPreviewUrl(file)
      addPreviewUrls(previewUrl)
    }
  }

  const DefaultContent = () => {
    if (isPending) return <Loader2 className="h-4 w-4 animate-spin" />

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
        <div className="text-xl">사진과 동영상을 여기에 끌어다 놓으세요</div>
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
    <div className="flex w-full h-full">
      <section className="flex flex-col justify-center relative items-center w-full h-full max-w-[70vw] gap-3">
        {previewUrls.length > 0 ? (
          <div className="w-full h-full flex justify-center relative items-center bg-gray-100 rounded-b-xl">
            <Image
              src={previewUrls[0]}
              alt="Uploaded image"
              className={cn(
                'object-contain rounded-b-xl',
                page !== 0 && 'rounded-br-none',
              )}
              fill
            />
          </div>
        ) : (
          <DefaultContent />
        )}
      </section>
      {page === LAST_PAGE && (
        <section className="w-full h-full max-w-[30vw] lg:max-w-[339px] border-l border-gray-300">
          <PostForm />
        </section>
      )}
    </div>
  )
}

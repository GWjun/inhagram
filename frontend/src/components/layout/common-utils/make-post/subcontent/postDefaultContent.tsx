import Image from 'next/image'

import { ChangeEvent, useRef } from 'react'

import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import { Button } from '#components/ui/button'
import { useUrlStore } from '#store/client/makepost.store'
import { useUploadImageMutation } from '#store/server/post.queries'

export default function PostDefaultContent() {
  const { data: session } = useSession()

  const { addPreviewUrls } = useUrlStore()
  const { mutateAsync, isPending } = useUploadImageMutation(session)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function createPreviewUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      const newPreviewUrls = []
      for (const file of Array.from(files))
        try {
          await mutateAsync(file)
          const url = await createPreviewUrl(file)
          if (url) newPreviewUrls.push(url)
        } catch (error) {
          console.error('file upload fail', error)
        }

      addPreviewUrls(...newPreviewUrls)
    }
  }

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
        multiple
        className="hidden"
      />
      <Button className="mt-2" onClick={() => fileInputRef.current?.click()}>
        기기에서 선택
      </Button>
    </>
  )
}

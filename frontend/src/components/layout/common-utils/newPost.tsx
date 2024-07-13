'use client'

import Image from 'next/image'

import { useState, useRef } from 'react'

import { ArrowLeft } from 'lucide-react'
import { useSession } from 'next-auth/react'

import PostForm from '#components/layout/common-utils/postForm'
import { Button } from '#components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog'
import authFetch from '#utils/authFetch'
import { cn } from 'utils/utils'

interface NewPostProps {
  children: React.ReactNode
  className?: string
}

interface CommonImageResponse {
  fileName: string
}

const LAST_PAGE = 1

export default function NewPost({ children, ...props }: NewPostProps) {
  const [page, setPage] = useState(0)
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  const { data: session } = useSession()

  async function handleUploadImage(image: File) {
    const formData = new FormData()
    if (image) formData.append('image', image)

    const commonResponse = await authFetch<CommonImageResponse>(
      `/common/image`,
      {
        method: 'POST',
        body: formData,
      },
      session,
    )

    setImageUrls((prev) => [...prev, commonResponse.fileName])
  }

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
      await handleUploadImage(file)

      const previewUrl = await createPreviewUrl(file)
      setPreviewUrls((prev) => [...prev, previewUrl])
    }
  }

  function handleButtonClick() {
    fileInputRef.current?.click()
  }

  function handleNextPage() {
    if (page === LAST_PAGE) handleSubmit()
    else setPage((prev) => prev + 1)
  }

  function handlePrevPage() {
    if (page === 0) console.log('닫힘')
    else setPage((prev) => prev - 1)
  }

  async function handleSubmit() {
    const postResponse = await authFetch(
      `/posts`,
      {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          images: imageUrls,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      },
      session,
    )

    console.log(postResponse)
  }

  return (
    <Dialog>
      <DialogTrigger className={props.className}>{children}</DialogTrigger>
      <DialogContent
        className={cn(
          'grid-rows-[auto_1fr] gap-0 w-full h-full max-w-[50vw] max-h-[55vw] lg:max-w-[855px] lg:max-h-[898px] p-0',
          page !== 0 && 'max-w-[90vw] lg:max-w-[1195px]',
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
        <div className="flex w-full h-full">
          <section className="flex flex-col justify-center relative items-center w-full h-full max-w-[70vw] lg:max-w-[855px] gap-3">
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
              <>
                <Image
                  src="/images/assets/make-icon.svg"
                  width={100}
                  height={100}
                  alt="make-icon"
                />
                <div className="text-xl">
                  사진과 동영상을 여기에 끌어다 놓으세요
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button className="mt-2" onClick={handleButtonClick}>
                  기기에서 선택
                </Button>
              </>
            )}
          </section>
          {page === LAST_PAGE && (
            <section className="w-full h-full max-w-[30vw] lg:max-w-[339px] border-l border-gray-300">
              <PostForm
                title={title}
                setTitle={setTitle}
                content={content}
                setContent={setContent}
                handleSubmit={handleNextPage}
              />
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

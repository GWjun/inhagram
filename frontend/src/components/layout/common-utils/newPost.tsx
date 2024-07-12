'use client'

import { useState } from 'react'

import { useSession } from 'next-auth/react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#components/ui/dialog'

interface NewPostProps {
  children: React.ReactNode
  className?: string
}

interface CommonImageResponse {
  fileName: string
}

export default function NewPost({ children, ...props }: NewPostProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)

  const { data: session } = useSession()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData()
    if (image) formData.append('image', image)

    const commonResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/common/image`,
      {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      },
    )
    const commonData = (await commonResponse.json()) as CommonImageResponse
    console.log(commonData.fileName)

    const postResponse = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/posts`,
      {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          images: [commonData.fileName],
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      },
    )

    const data = await postResponse.json()
    console.log(data)
  }

  return (
    <Dialog>
      <DialogTrigger className={props.className}>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            새 게시물 작성
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                제목
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                내용
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이미지
              </label>
              <input
                id="image"
                type="file"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                accept="image/*"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              게시물 작성
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

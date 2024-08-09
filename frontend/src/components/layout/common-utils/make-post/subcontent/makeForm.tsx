import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'

import useFormRefContext from '#components/provider/formRefProvider/useFormRefContext'
import { useUrlStore } from '#store/client/makepost.store'
import { usePostDataMutation } from '#store/server/post.queries'

export interface PostFormData {
  title: string
  content: string
}

export default function MakeForm() {
  const { data: session } = useSession()
  const { formRef } = useFormRefContext()

  const { imageUrls } = useUrlStore()
  const { mutate } = usePostDataMutation(session)

  const { register, handleSubmit } = useForm<PostFormData>()

  function onSubmit(data: PostFormData) {
    mutate({ ...data, images: imageUrls })
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      className="w-full h-full"
    >
      <div className="h-[20%] p-3 border-b border-gray-300">
        <textarea
          id="title"
          placeholder="제목을 입력하세요"
          className="w-full h-full px-3 py-2 resize-none focus:outline-none"
          {...register('title')}
        />
      </div>
      <div className="h-[40%] p-3">
        <textarea
          id="content"
          placeholder="내용을 입력하세요"
          className="w-full h-full px-3 py-2 resize-none focus:outline-none"
          {...register('content')}
        />
      </div>
    </form>
  )
}

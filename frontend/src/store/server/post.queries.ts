import { useMutation } from '@tanstack/react-query'
import { Session } from 'next-auth'

import authFetch from '#utils/authFetch'
import { useUrlStore } from '#store/client/makepost.store'

type CustomSesson = Session | null

interface CommonImageResponse {
  fileName: string
}

interface PostData {
  title: string
  content: string
  images: string[]
}

async function uploadImage(image: File, session: CustomSesson) {
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

  return commonResponse.fileName
}

export function useUploadImageMutation(session: CustomSesson) {
  const addImageUrls = useUrlStore((state) => state.addImageUrls)

  return useMutation({
    mutationFn: (image: File) => uploadImage(image, session),
    gcTime: 0,
    onSuccess: (data) => addImageUrls(data),
  })
}

async function postData(data: PostData, session: CustomSesson) {
  return authFetch(
    `/posts`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}

export function usePostDataMutation(session: CustomSesson) {
  // const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: PostData) => postData(data, session),
    gcTime: 0,
    // onSuccess: () => {
    //   queryClient.invalidateQueries(['posts']) // 'posts' 쿼리를 무효화하여 데이터를 다시 가져오도록 함
    // },
  })
}

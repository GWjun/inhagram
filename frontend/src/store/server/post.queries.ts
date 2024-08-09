import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { Session } from 'next-auth'

import { useUrlStore } from '#store/client/makepost.store'
import { Post, PostsResponse } from '#types/posts.type'
import authFetch from '#utils/authFetch'

type CustomSesson = Session | null

interface CommonImageResponse {
  fileName: string
}

interface PostData {
  title: string
  content: string
  images: string[]
}

// Upload Image Mutation
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

// Post Data Mutation
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

export const addPostMutationKey = ['addPost']
export function usePostDataMutation(session: CustomSesson) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationKey: addPostMutationKey,
    mutationFn: (data: PostData) => postData(data, session),
    gcTime: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// Delete Data Mutation
async function deleteData(postId: number, session: CustomSesson) {
  return authFetch(
    `/posts/${postId}`,
    {
      method: 'DELETE',
      body: JSON.stringify({ id: postId }),
      headers: {
        'Content-Type': 'application/json',
      },
    },
    session,
  )
}

export function useDeleteDataMutation(session: CustomSesson) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: number) => deleteData(postId, session),
    gcTime: 0,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

// Get Datas Query
async function getPosts(url: string) {
  const response = await fetch(url, {
    cache: 'no-cache',
  })
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

  return (await response.json()) as Promise<PostsResponse>
}
export function useGetPostsQuery(nickname?: string) {
  const baseParam = `${process.env.NEXT_PUBLIC_SERVER_URL}/posts?order__createdAt=DESC&take=18`

  return useInfiniteQuery({
    queryKey: ['posts', nickname],
    queryFn: ({ pageParam }) => getPosts(pageParam),
    initialPageParam: nickname
      ? baseParam + `&where__author=${encodeURIComponent(nickname)}`
      : baseParam,
    getNextPageParam: (lastPage) => lastPage.next,
    retry: 2,
  })
}

// Get Data Query
async function getPost(id: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/posts/${id}`,
  )
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

  return (await response.json()) as Promise<Post>
}
export function useGetPostQuery(id: string) {
  return useQuery({
    queryKey: ['post'],
    queryFn: () => getPost(id),
    gcTime: 0,
    retry: 1,
  })
}

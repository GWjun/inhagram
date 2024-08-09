'use client'

import LoadingSpinner from '#components/animation/loadingSpinner'
import PostCarousel from '#components/feature/post/carousel'
import PostContent from '#components/feature/post/content'
import NotExist from '#components/layout/notexist'
import { useGetPostQuery } from '#store/server/post.queries'

export default function Post({ postId }: { postId: string }) {
  const { data, status } = useGetPostQuery(postId)

  if (status === 'pending') return <LoadingSpinner variant="inset" />
  if (status === 'error') return <NotExist />

  const { images, ...content } = data

  return (
    <div className="flex flex-col h-full md:flex-row">
      <PostCarousel images={images} />
      <PostContent data={content} />
    </div>
  )
}

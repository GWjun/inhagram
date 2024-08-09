'use client'

import { Fragment } from 'react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import useInfiniteScroll from '#components/feature/common/infiniteScroll'
import NextFetchRef from '#components/feature/common/infiniteScroll/nextFetchRef'
import Alert from '#components/feature/modal/alert'
import SinglePost from '#components/feature/post/imagePosts/singlePost'
import { useGetPostsQuery } from '#store/server/post.queries'

export default function ImagePosts({ userName }: { userName?: string }) {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetPostsQuery(userName)

  const { ref } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  if (status === 'pending') return <LoadingSpinner className="w-8 h-8" />

  return (
    <>
      <div className="grid grid-cols-3 w-full gap-1 mb-12">
        {data?.pages[0].data.length ? (
          data.pages.map((page, index) => (
            <Fragment key={index}>
              {page.data.map((post) => (
                <SinglePost key={post.id} post={post} />
              ))}
            </Fragment>
          ))
        ) : (
          <div className="col-span-3 text-center text-gray-500">
            게시물이 없습니다
          </div>
        )}

        <Alert
          isOpen={status === 'error'}
          closeCallback={refetch}
          title="실패"
          message="게시물을 불러오는데 실패했습니다."
        />
      </div>
      <NextFetchRef ref={ref} isLoading={isFetchingNextPage} />
    </>
  )
}

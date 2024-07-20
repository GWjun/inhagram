'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Fragment, useCallback } from 'react'

import { Layers2 } from 'lucide-react'
import { useInView } from 'react-intersection-observer'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/alert'
import { useGetPostsQuery } from '#store/server/post.queries'

export default function UserPost() {
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetPostsQuery()

  const { ref } = useInView({
    onChange: useCallback(
      (inView: boolean) => {
        if (inView && hasNextPage && !isFetchingNextPage) fetchNextPage()
      },
      [fetchNextPage, hasNextPage, isFetchingNextPage],
    ),
  })

  if (status === 'pending') return <LoadingSpinner className="w-8 h-8" />

  return (
    <>
      <div className="grid grid-cols-3 gap-1 mb-12">
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((post) => (
              <Link href={`/post/${post.id}`} key={post.id}>
                <div className="relative w-full aspect-square max-w-[307.67px] group">
                  <Image
                    src={post.images[0].path}
                    alt="posts"
                    fill
                    sizes="(max-width: 307.67px) 100vw, 307.67px"
                    className="object-cover transition-all duration-300 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-in-out" />
                  {post.images.length > 1 && (
                    <div className="absolute top-2 right-2 text-white">
                      <Layers2
                        fill="white"
                        className="text-gray-300"
                        size={16}
                      />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </Fragment>
        ))}

        <Alert
          isOpen={status === 'error'}
          closeCallback={refetch}
          title="실패"
          message="게시물을 불러오는데 실패했습니다."
        />
      </div>
      {isFetchingNextPage ? (
        <LoadingSpinner className="w-8 h-8 mt-5" />
      ) : (
        <div ref={ref} />
      )}
    </>
  )
}

'use client'

import { Fragment } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import PostComment from '#components/feature/comments/comment'
import useInfiniteScroll from '#components/feature/common/infiniteScroll'
import NextFetchRef from '#components/feature/common/infiniteScroll/nextFetchRef'
import Alert from '#components/feature/modal/alert'
import UserSkeleton from '#components/feature/user/userSkeleton'
import { useGetCommentsQuery } from '#store/server/comment.queries'

export default function PostComments({ postId }: { postId: number }) {
  const { data: session } = useSession()

  const {
    data: comments,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    refetch,
  } = useGetCommentsQuery(postId, session as Session)

  const { ref } = useInfiniteScroll({
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  })

  if (status === 'pending') return <UserSkeleton count={10} size="small" />

  return (
    <section className="flex flex-col w-full max-h-0 gap-5">
      {status === 'success' &&
        comments?.pages[0].data.length > 0 &&
        comments.pages.map((page, index) => (
          <Fragment key={index}>
            {page.data.map((comment) => (
              <PostComment
                postId={postId}
                commentData={comment}
                key={comment.id}
              />
            ))}
          </Fragment>
        ))}

      <NextFetchRef ref={ref} isLoading={isFetchingNextPage} />

      <Alert
        isOpen={status === 'error'}
        closeCallback={refetch}
        title="실패"
        message="댓글을 불러오는데 실패했습니다."
      />
    </section>
  )
}

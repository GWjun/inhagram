import { useMutationState } from '@tanstack/react-query'

import CheckmarkAnimation from '#components/animation/checkMark'
import LoadingSpinner from '#components/animation/loadingSpinner'
import XMarkAnimation from '#components/animation/XMark'
import { addPostMutationKey } from '#store/server/post.queries'

export default function PostResult() {
  const status = useMutationState({
    filters: { mutationKey: addPostMutationKey },
    select: (mutation) => mutation.state.status,
  })

  if (status[0] === 'pending') return <LoadingSpinner />
  else if (status[0] === 'success')
    return (
      <div className="flex flex-col justify-center items-center">
        <CheckmarkAnimation />
        <span className="text-lg mt-3">게시물이 공유되었습니다.</span>
      </div>
    )
  else
    return (
      <div className="flex flex-col justify-center items-center">
        <XMarkAnimation />
        <span className="text-lg mt-3">게시물을 공유하는데 실패했습니다.</span>
      </div>
    )
}

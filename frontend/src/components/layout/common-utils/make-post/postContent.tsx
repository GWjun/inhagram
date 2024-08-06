import { useSession } from 'next-auth/react'

import Alert from '#components/feature/alert'
import PostDefaultContent from '#components/layout/common-utils/make-post/subcontent/postDefaultContent'
import PostForm from '#components/layout/common-utils/make-post/subcontent/postForm'
import PostImageContent from '#components/layout/common-utils/make-post/subcontent/postImageContent'
import PostResult from '#components/layout/common-utils/make-post/subcontent/postResult'
import { Page, usePageStore, useUrlStore } from '#store/client/makepost.store'
import { useUploadImageMutation } from '#store/server/post.queries'

export default function PostContent() {
  const { data: session } = useSession()

  const page = usePageStore((state) => state.page)
  const previewUrls = useUrlStore((state) => state.previewUrls)
  const { isError, reset } = useUploadImageMutation(session)

  function MainContent() {
    if (!previewUrls.length) return <PostDefaultContent />
    return <PostImageContent />
  }

  if (page === Page.Result) return <PostResult />

  return (
    <div className="flex w-full h-full justify-center items-center">
      <section className="flex flex-col justify-center relative items-center w-full h-full gap-3">
        <MainContent />
      </section>

      {page === Page.Form && (
        <section className="w-full h-full max-w-[30vw] lg:max-w-[339px] border-l border-gray-300">
          <PostForm />
        </section>
      )}

      <Alert
        isOpen={isError}
        closeCallback={reset}
        title="실패"
        message="이미지 업로드에 실패했습니다."
      />
    </div>
  )
}

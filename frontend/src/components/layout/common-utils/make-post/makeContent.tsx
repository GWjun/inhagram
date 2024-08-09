import { useSession } from 'next-auth/react'

import Alert from '#components/feature/modal/alert'
import MakeDefaultContent from '#components/layout/common-utils/make-post/subcontent/makeDefaultContent'
import MakeForm from '#components/layout/common-utils/make-post/subcontent/makeForm'
import MakeImageContent from '#components/layout/common-utils/make-post/subcontent/makeImageContent'
import MakeResult from '#components/layout/common-utils/make-post/subcontent/makeResult'
import { Page, usePageStore, useUrlStore } from '#store/client/makepost.store'
import { useUploadImageMutation } from '#store/server/post.queries'

export default function MakeContent() {
  const { data: session } = useSession()

  const page = usePageStore((state) => state.page)
  const previewUrls = useUrlStore((state) => state.previewUrls)
  const { isError, reset } = useUploadImageMutation(session)

  function MainContent() {
    if (!previewUrls.length) return <MakeDefaultContent />
    return <MakeImageContent />
  }

  if (page === Page.Result) return <MakeResult />

  return (
    <div className="flex w-full h-full justify-center items-center">
      <section className="flex flex-col justify-center relative items-center w-full h-full gap-3">
        <MainContent />
      </section>

      {page === Page.Form && (
        <section className="w-full h-full max-w-[30vw] lg:max-w-[339px] border-l border-gray-300">
          <MakeForm />
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

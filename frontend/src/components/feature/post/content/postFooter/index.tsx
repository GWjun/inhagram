import { useRef, useEffect, KeyboardEvent } from 'react'

import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'

import LoadingSpinner from '#components/animation/loadingSpinner'
import Alert from '#components/feature/modal/alert'
import { Button } from '#components/ui/button'
import { useCommentFooterState } from '#store/client/comment.store'
import { usePostCommentMutation } from '#store/server/comment.queries'
import type { PostFooter } from '#types/posts.type'

export default function PostFooter({ footer }: { footer: PostFooter }) {
  const { data: session } = useSession()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const setTextAreaHeight = useCommentFooterState(
    (state) => state.setTextAreaHeight,
  )
  const { mutate, status, reset } = usePostCommentMutation(
    footer.id,
    session as Session,
  )

  useEffect(() => {
    if (textareaRef.current && status === 'success') {
      textareaRef.current.value = ''
      textareaRef.current.style.height = '0px'
      setTextAreaHeight(20)
    }
  }, [setTextAreaHeight, status])

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, 80)
      textarea.style.height = `${newHeight}px`
      setTextAreaHeight(newHeight)
    }

    textarea.addEventListener('input', adjustHeight)
    return () => textarea.removeEventListener('input', adjustHeight)
  }, [setTextAreaHeight])

  function handleSubmit() {
    if (textareaRef.current) mutate(textareaRef.current.value)
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === 'Enter' &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="absolute bottom-0 w-full border-t border-gray-200">
      <p className="text-sm font-semibold p-3">좋아요 {footer.likeCount}개</p>
      <div className="flex items-center w-full border-t border-gray-200">
        <div className="grow p-2 flex justify-center items-center">
          <textarea
            ref={textareaRef}
            className="w-full min-h-[20px] max-h-[80px] text-sm resize-none overflow-y-auto focus:outline-0"
            placeholder="댓글 달기..."
            rows={1}
            onKeyDown={handleKeyDown}
          />
        </div>
        <Button
          onClick={handleSubmit}
          variant="ghost"
          className="text-button hover:bg-transparent hover:text-button"
        >
          {status === 'pending' ? <LoadingSpinner /> : '게시'}
        </Button>
      </div>

      <Alert
        isOpen={status === 'error'}
        closeCallback={reset}
        title="실패"
        message="댓글을 게시하는데 실패했습니다."
      />
    </div>
  )
}

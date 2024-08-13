import Comments from '#components/feature/comments'
import { useCommentFooterState } from '#store/client/comment.store'
import type { PostBody } from '#types/posts.type'
import { formatTimeDifference } from '#utils/dateFormat'

export default function PostBody({ body }: { body: PostBody }) {
  const date = formatTimeDifference(body.createdAt)

  const textAreaHeight = useCommentFooterState((state) => state.textAreaHeight)
  const mbValue = textAreaHeight + 60 + 'px'

  return (
    <div
      className="border-t border-gray-200 p-3 overflow-y-auto flex-grow"
      style={{ marginBottom: `${mbValue}` }}
    >
      <p className="font-semibold">{body.title}</p>
      <p className="text-sm">{body.content}</p>
      <p className="text-xs text-gray-400 mt-1 mb-3">{date}</p>

      <Comments postId={body.id} />
    </div>
  )
}

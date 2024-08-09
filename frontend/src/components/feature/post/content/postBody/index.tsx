import type { PostBody } from '#types/posts.type'
import { extractDate } from '#utils/dateFormat'

export default function PostBody({ body }: { body: PostBody }) {
  const date = extractDate(body.createdAt)

  return (
    <div className="border-t border-gray-200 p-3">
      <p className="font-semibold">{body.title}</p>
      <p>{body.content}</p>
      <p className="text-sm text-gray-400 my-2">{date}</p>
    </div>
  )
}

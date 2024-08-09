import type { PostFooter } from '#types/posts.type'

export default function PostFooter({ footer }: { footer: PostFooter }) {
  return (
    <div className="absolute bottom-0 w-full p-3 border-t border-gray-200">
      <p className="text-sm font-semibold">좋아요 {footer.likeCount}개</p>
    </div>
  )
}

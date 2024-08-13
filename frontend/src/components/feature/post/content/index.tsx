import PostBody from '#components/feature/post/content/postBody'
import PostFooter from '#components/feature/post/content/postFooter'
import PostHeader from '#components/feature/post/content/postHeader'
import { Post } from '#types/posts.type'

export default function PostContent({ data }: { data: Omit<Post, 'images'> }) {
  const {
    id,
    author,
    title,
    content,
    createdAt,
    updateAt,
    likeCount,
    commentCount,
  } = data
  const body = { id, title, content, createdAt, updateAt }
  const footer = { id, likeCount, commentCount }

  return (
    <section className="relative h-full max-h-[40%] md:max-h-full md:w-[370px] 3xl:w-[470px] flex flex-col">
      <PostHeader postId={id} user={author} />
      <PostBody body={body} />
      <PostFooter footer={footer} />
    </section>
  )
}

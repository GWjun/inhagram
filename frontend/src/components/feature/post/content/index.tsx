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
  const body = { title, content, createdAt, updateAt }
  const footer = { likeCount, commentCount }

  return (
    <section className="relative h-[65%] md:h-full md:w-[370px] 3xl:w-[470px]">
      <PostHeader postId={id} user={author} />
      <PostBody body={body} />
      <PostFooter footer={footer} />
    </section>
  )
}

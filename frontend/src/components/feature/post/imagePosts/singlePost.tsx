import Image from 'next/image'
import Link from 'next/link'

import { Layers2, Heart, MessageCircle } from 'lucide-react'

import { Post } from '#types/posts.type'

export default function SinglePost({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.id}`}>
      <div className="relative w-full aspect-square max-w-[307.67px] group">
        <Image
          src={post.images[0].path}
          alt="posts"
          fill
          sizes="(max-width: 307.67px) 100vw, 307.67px"
          className="object-cover transition-all duration-300 ease-in-out"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300 ease-in-out" />
        {post.images.length > 1 && (
          <div className="absolute top-2 right-2 text-white">
            <Layers2 fill="white" className="text-gray-300" size={16} />
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
          <div className="flex items-center space-x-4 text-white">
            <div className="flex items-center">
              <Heart
                fill="white"
                className="mr-2"
                size={20}
                aria-label="좋아요"
              />
              <span>{post.likeCount}</span>
            </div>
            <div className="flex items-center">
              <MessageCircle
                fill="white"
                className="mr-2"
                size={20}
                aria-label="댓글"
              />
              <span>{post.commentCount}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

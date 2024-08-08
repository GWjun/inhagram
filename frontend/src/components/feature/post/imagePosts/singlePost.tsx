import Image from 'next/image'
import Link from 'next/link'

import { Layers2 } from 'lucide-react'

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
      </div>
    </Link>
  )
}

import PaginationType from '#types/pagination.type'
import { BasicUser } from '#types/user.type'

interface Image {
  id: number
  updateAt: string
  createdAt: string
  order: number
  type: number
  path: string
}

export interface PostBody {
  id: number
  title: string
  content: string
  createdAt: string
  updateAt: string
}

export interface PostFooter {
  id: number
  likeCount: number
  commentCount: number
}

export interface Post {
  id: number
  title: string
  content: string
  createdAt: string
  updateAt: string
  likeCount: number
  commentCount: number
  author: BasicUser
  images: Image[]
}

export interface PostsResponse extends PaginationType {
  data: Post[]
}

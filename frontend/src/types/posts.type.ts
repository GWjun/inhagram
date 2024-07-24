import PaginationType from '#types/pagination.type'
import UserType from '#types/user.type'

interface Image {
  id: number
  updateAt: string
  createdAt: string
  order: number
  type: number
  path: string
}

export interface Post {
  id: number
  updateAt: string
  createdAt: string
  likeCount: number
  commentCount: number
  author: UserType
  images: Image[]
}

export interface PostsResponse extends PaginationType {
  data: Post[]
}

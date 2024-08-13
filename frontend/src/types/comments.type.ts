import PaginationType from '#types/pagination.type'
import { BasicUser } from '#types/user.type'

export interface Comment {
  id: number
  updateAt: string
  createdAt: string
  comment: string
  likeCount: number
  author: BasicUser
}

export interface CommentsResponse extends PaginationType {
  data: Comment[]
}

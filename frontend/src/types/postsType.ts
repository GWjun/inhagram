export interface Author {
  id: number
  updateAt: string
  createdAt: string
  nickname: string
  email: string
  role: string
}

export interface Image {
  id: number
  updateAt: string
  createdAt: string
  order: number
  type: number
  path: string
}

export interface Posts {
  id: number
  updateAt: string
  createdAt: string
  likeCount: number
  commentCount: number
  author: Author
  images: Image[]
}

export interface Cursor {
  after: string | null
}

export default interface PostsResponse {
  data: Posts[]
  cursor: Cursor
  count: number
  next: string | null
}

interface Author {
  id: number
  updateAt: string
  createdAt: string
  nickname: string
  email: string
  role: string
}

interface Image {
  id: number
  updateAt: string
  createdAt: string
  order: number
  type: number
  path: string
}

interface Cursor {
  after: string | null
}

export interface Post {
  id: number
  updateAt: string
  createdAt: string
  likeCount: number
  commentCount: number
  author: Author
  images: Image[]
}

export interface PostsResponse {
  data: Post[]
  cursor: Cursor
  count: number
  next: string | null
}

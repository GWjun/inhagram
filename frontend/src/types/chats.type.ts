import PaginationType from '#types/pagination.type'
import UserType from '#types/user.type'

type User = Pick<UserType, 'id' | 'nickname' | 'image'>

interface ChatRoom {
  id: number
  updateAt: string
  createdAt: string
  users: User[]
}

export interface ChatsResponse extends PaginationType {
  data: ChatRoom[]
}

interface Message {
  id: number
  updateAt: string
  createdAt: string
  message: string
  author: User
}

export interface MessagesResponse extends PaginationType {
  data: Message[]
}

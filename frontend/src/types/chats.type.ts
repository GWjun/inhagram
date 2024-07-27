import PaginationType from '#types/pagination.type'
import { BasicUser } from '#types/user.type'

interface ChatRoom {
  id: number
  updateAt: string
  createdAt: string
  users: BasicUser[]
}

export interface ChatsResponse extends PaginationType {
  data: ChatRoom[]
}

interface Message {
  id: number
  updateAt: string
  createdAt: string
  message: string
  author: BasicUser
}

export interface MessagesResponse extends PaginationType {
  data: Message[]
}

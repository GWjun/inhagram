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

export interface Message {
  id: number
  updateAt: string
  createdAt: string
  message: string
  author: BasicUser
  notice?: boolean
}

export interface MessagesResponse extends PaginationType {
  data: Message[]
}

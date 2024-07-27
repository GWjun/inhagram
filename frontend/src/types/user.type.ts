export default interface UserType {
  id: number
  updateAt: string
  createdAt: string
  nickname: string
  email: string
  image: string | null
  role: string
}

export type BasicUser = Pick<UserType, 'id' | 'nickname' | 'image'>

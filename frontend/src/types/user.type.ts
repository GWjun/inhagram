export default interface UserType {
  id: number
  updateAt: string
  createdAt: string
  nickname: string
  email: string
  image: string
  role: string
}

export type BasicUser = Pick<UserType, 'id' | 'nickname' | 'image'>

export type SimpleUser = Pick<UserType, 'nickname' | 'image'>

export interface UserCountType {
  postCount: number
  followerCount: number
  followeeCount: number
}

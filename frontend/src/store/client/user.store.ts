import { create } from 'zustand'

interface UserState {
  userName: string
  setUserName: (userName: string) => void
  userEmail: string
  setUserEmail: (userEmail: string) => void
}

export const useUserStore = create<UserState>((set) => ({
  userName: '',
  setUserName: (userName) => set({ userName }),
  userEmail: '',
  setUserEmail: (userEmail) => set({ userEmail }),
}))

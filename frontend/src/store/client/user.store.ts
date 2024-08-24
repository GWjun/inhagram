import { create } from 'zustand'

export interface UserImageResponse {
  id: number
  path: string
}

interface UserImageStore {
  imageUrl: string
  isLoading: boolean
  initializeUserImage: (userName: string) => Promise<void>
  setUserImage: (imageUrl: string) => void
}

export const useUserImageStore = create<UserImageStore>()((set) => ({
  imageUrl: '',
  isLoading: false,

  initializeUserImage: async (userName: string) => {
    set({ isLoading: true })
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${userName}/image`,
        { cache: 'no-cache' },
      )

      if (!response.ok)
        throw new Error(`User image error! status: ${response.status}`)

      const userImageData = (await response.json()) as UserImageResponse
      set({ imageUrl: userImageData.path, isLoading: false })
    } catch (error) {
      console.error(`Failed to fetch image for user ${userName}:`, error)
    }
  },

  setUserImage: (imageUrl: string) => {
    set({ imageUrl })
  },
}))

// import { create } from 'zustand'

// interface AuthState {
//   // isAuthenticated: boolean
//   accessToken: string | null
//   refreshToken: string | null
//   setTrueAuthenticated: () => boolean
//   setTokens: (tokens: { accessToken: string; refreshToken: string }) => void
//   clearTokens: () => void
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   // isAuthenticated: !!localStorage.getItem('accessToken'),
//   accessToken: null,
//   refreshToken: null,
//   setTrueAuthenticated: () => true,
//   setTokens: ({ accessToken, refreshToken }) =>
//     set({ accessToken, refreshToken }),
//   clearTokens: () => set({ accessToken: null, refreshToken: null }),
// }))

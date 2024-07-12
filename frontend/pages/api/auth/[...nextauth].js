import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser, refreshAccessToken, registerUser } from '#utils/FetchUser'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { label: 'Nickname', type: 'text', optional: true },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (credentials === undefined) return null

        if (
          process.env.NODE_ENV === 'development' &&
          credentials.email === 'admin'
        )
          return { id: 'admin', accessToken: 'admin', refreshToken: 'admin' }

        if (credentials.type === 'register' && credentials.nickname) {
          const data = await registerUser(
            credentials.nickname,
            credentials.email,
            credentials.password,
          )
          return {
            id: credentials.email,
            ...data,
          }
        } else {
          const data = await loginUser(credentials.email, credentials.password)
          return {
            id: credentials.email,
            ...data,
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const expiresDuration = parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRE)

      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = Date.now() + expiresDuration
      }

      // refresh accessToken
      let isRefreshed = false
      if (Date.now() >= token.expiresAt) {
        const newAccessToken = await refreshAccessToken(token.refreshToken)

        if (newAccessToken) {
          token.accessToken = newAccessToken
          token.expiresAt = Date.now() + expiresDuration
          isRefreshed = true
        }
      }

      try {
        const decoded = jwt.decode(token.accessToken)
        if (!isRefreshed && decoded && decoded?.name && decoded?.email) {
          token.name = decoded.name
          token.email = decoded.email
        }
      } catch (error) {
        console.error('Failed to decode accessToken:', error)
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
}

export default NextAuth(authOptions)

/* eslint-disable @typescript-eslint/require-await */

import jwt from 'jsonwebtoken'
import NextAuth, { DefaultSession, NextAuthOptions } from 'next-auth'
import { DefaultJWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser, refreshAccessToken, registerUser } from '#utils/FetchUser'

interface CustomSession extends DefaultSession {
  accessToken?: string
  refreshToken?: string
}

interface CustomJWT extends DefaultJWT {
  accessToken?: string
  refreshToken?: string
}

interface AuthCredentials {
  nickname?: string
  email: string
  password: string
  type?: string
}

interface User {
  accessToken: string
  refreshToken: string
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { label: 'Nickname', type: 'text', optional: true },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: AuthCredentials): Promise<User | null> {
        if (
          process.env.NODE_ENV === 'development' &&
          credentials.email === 'admin'
        )
          return { accessToken: 'admin', refreshToken: 'admin' }

        if (credentials.type === 'register' && credentials.nickname)
          return registerUser(
            credentials.nickname,
            credentials.email,
            credentials.password,
          )
        else return loginUser(credentials.email, credentials.password)
      },
    }),
  ],
  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: CustomJWT
      user: User | undefined
    }): Promise<CustomJWT> {
      const expiresDuration =
        process.env.NODE_ENV === 'development'
          ? 24 * 3600 * 1000
          : parseInt(process.env.NEXT_PUBLIC_TOKEN_EXPIRE)

      if (user) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.expiresAt = Date.now() + expiresDuration
      }

      // refresh accessToken
      if (Date.now() >= token.expiresAt) {
        const newAccessToken = await refreshAccessToken(
          token.refreshToken as string,
        )

        if (newAccessToken) {
          token.accessToken = newAccessToken
          token.expiresAt = Date.now() + expiresDuration
        }
      }

      try {
        const decoded = jwt.decode(token.accessToken as string) as CustomJWT
        if (decoded && decoded.email) {
          token.name = decoded.email
          token.email = decoded.email
        } else if (process.env.NODE_ENV === 'development') {
          token.name = 'admin'
          token.email = 'admin'
        }
      } catch (error) {
        console.error('Failed to decode accessToken:', error)
      }

      return token
    },
    async session({
      session,
      token,
    }: {
      session: CustomSession
      token: CustomJWT
    }): Promise<CustomSession> {
      session.accessToken = token.accessToken
      session.refreshToken = token.refreshToken
      return session
    },
  },
}

export default NextAuth(authOptions)

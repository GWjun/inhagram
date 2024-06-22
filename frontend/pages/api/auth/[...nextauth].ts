import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

import { loginUser, registerUser } from '#utils/FetchUser'

interface AuthCredentials {
  nickname?: string
  email: string
  password: string
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        nickname: { label: 'Nickname', type: 'text', optional: true },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: AuthCredentials) {
        if (
          process.env.NODE_ENV === 'development' &&
          credentials.email === 'admin'
        )
          return { accessToken: 'admin', refreshToken: 'admin' }

        if (credentials.nickname)
          return registerUser(
            credentials.nickname,
            credentials.email,
            credentials.password,
          )
        else return loginUser(credentials.email, credentials.password)
      },
    }),
  ],
})

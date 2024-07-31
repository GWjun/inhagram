import { useMutation } from '@tanstack/react-query'
import { signIn } from 'next-auth/react'

export interface AuthCredentials {
  nickname?: string
  email: string
  password: string
  type?: string
}

async function fetchToken(credentials: AuthCredentials) {
  const response = await signIn('credentials', {
    ...credentials,
    redirect: false,
  })

  if (!response?.ok) throw new Error(response?.error || 'fetchToken error')

  return response
}

export const useGetTokenQuery = () => {
  return useMutation({
    mutationFn: fetchToken,
  })
}

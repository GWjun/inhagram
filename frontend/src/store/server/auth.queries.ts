// import { useMutation, useQueryClient } from '@tanstack/react-query'

// import { useAuthStore } from '#store/client/auth.store'

// interface AuthRespose {
//   accessToken: string
//   refreshToken: string
// }

// interface AuthCredentials {
//   nickname?: string
//   email: string
//   password: string
// }

// const toBase64 = (str: string): string => {
//   return Buffer.from(str).toString('base64')
// }

// const fetchRegister = async (
//   credentials: AuthCredentials,
// ): Promise<AuthRespose> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register/email`,
//     {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(credentials),
//     },
//   )
//   if (!response.ok) throw new Error('Login failed')

//   const data = (await response.json()) as AuthRespose
//   return data
// }

// const fetchLogin = async (
//   credentials: AuthCredentials,
// ): Promise<AuthRespose> => {
//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/email`,
//     {
//       method: 'POST',
//       headers: {
//         Authorization: `Basic ${toBase64(`${credentials.email}:${credentials.password}`)}`,
//       },
//     },
//   )

//   if (!response.ok) throw new Error('Login failed')

//   const data = (await response.json()) as AuthRespose
//   return data
// }

// export const useRegisterQuery = () => {
//   const queryClient = useQueryClient()
//   const { setTokens } = useAuthStore()

//   return useMutation({
//     mutationFn: fetchRegister,
//     onSuccess: (data) => {
//       setTokens(data)
//       queryClient.setQueryData(['user'], data)
//       localStorage.setItem('accessToken', data.accessToken)
//       localStorage.setItem('refreshToken', data.refreshToken)
//     },
//   })
// }

// export const useLoginQuery = () => {
//   const queryClient = useQueryClient()
//   const { setTokens } = useAuthStore()

//   return useMutation({
//     mutationFn: fetchLogin,
//     onSuccess: (data) => {
//       setTokens(data)
//       queryClient.setQueryData(['user'], data)
//       localStorage.setItem('accessToken', data.accessToken)
//       localStorage.setItem('refreshToken', data.refreshToken)
//     },
//   })
// }

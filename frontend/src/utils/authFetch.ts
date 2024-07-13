import { Session } from 'next-auth'

import { refreshAccessToken } from '#utils/fetchUser'

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>
}

export default async function authFetch<T>(
  endpoint: string,
  options: FetchOptions = {},
  session: Session | null,
): Promise<T> {
  if (session?.accessToken) {
    if (!options.headers) options.headers = {}
    options.headers.Authorization = `Bearer ${session.accessToken}`
  }

  let response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
    options,
  )

  // refresh logic
  if (response.status === 401 && session?.refreshToken)
    try {
      const newAccessToken = await refreshAccessToken(session.refreshToken)

      if (!options.headers) options.headers = {}
      options.headers.Authorization = `Bearer ${newAccessToken}`

      response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}${endpoint}`,
        options,
      )
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError)
      throw new Error('Authentication failed')
    }

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

  return (await response.json()) as T
}

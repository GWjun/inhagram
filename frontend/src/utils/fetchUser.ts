interface AuthResponse {
  accessToken: string
  refreshToken: string
}

interface ErrorResponse {
  message: string
  error: string
  statusCode: number
}

const toBase64 = (str: string): string => {
  return Buffer.from(str).toString('base64')
}

export async function loginUser(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login/email`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${toBase64(`${email}:${password}`)}`,
      },
    },
  )

  if (!response.ok) throw new Error('Login failed')

  return (await response.json()) as AuthResponse
}

export async function registerUser(
  nickname: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/register/email`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, email, password }),
    },
  )
  const data = (await response.json()) as AuthResponse | ErrorResponse

  if (!response.ok) throw new Error(`${(data as ErrorResponse).message}`)

  return data as AuthResponse
}

export async function refreshAccessToken(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/auth/token/access`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-cache',
    },
  )

  const data = (await response.json()) as
    | Pick<AuthResponse, 'accessToken'>
    | ErrorResponse

  if (!response.ok) throw new Error(`${(data as ErrorResponse).message}`)

  return (data as Pick<AuthResponse, 'accessToken'>).accessToken
}

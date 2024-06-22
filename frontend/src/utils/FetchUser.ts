interface AuthResponse {
  accessToken: string
  refreshToken: string
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

  const data = (await response.json()) as AuthResponse
  return data
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

  if (!response.ok) throw new Error('Register failed')

  const data = (await response.json()) as AuthResponse
  return data
}

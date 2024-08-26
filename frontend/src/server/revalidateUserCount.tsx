'use server'

import { revalidateTag } from 'next/cache'

// eslint-disable-next-line @typescript-eslint/require-await
export default async function RevalidateUserCount() {
  revalidateTag('userCount')
}

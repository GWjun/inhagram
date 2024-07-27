'use client'

import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Alert from '#components/feature/alert'
import useWebSocketStore, {
  MAX_RETRY_COUNT,
} from '#store/client/websocket.store'

export default function SocketClient() {
  const { data: session } = useSession()
  const router = useRouter()

  const { socket, retry, isConnected, initSocket } = useWebSocketStore()

  useEffect(() => {
    if (!socket && session?.accessToken) initSocket(session)
  }, [initSocket, session, socket])

  return (
    <Alert
      isOpen={retry >= MAX_RETRY_COUNT && !isConnected}
      closeCallback={() => router.back()}
      title="실패"
      message="연결에 실패했습니다."
    />
  )
}

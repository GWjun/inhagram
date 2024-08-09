'use client'

import { useRouter } from 'next/navigation'

import { useEffect } from 'react'

import { useSession } from 'next-auth/react'

import Alert from '#components/feature/modal/alert'
import useWebSocketStore, {
  MAX_RETRY_COUNT,
} from '#store/client/websocket.store'

export default function SocketClient() {
  const { data: session } = useSession()
  const router = useRouter()

  const {
    retry,
    isConnected,
    exception,
    initSocket,
    closeSocket,
    clearException,
  } = useWebSocketStore()

  useEffect(() => {
    if (session?.accessToken) initSocket(session)

    return () => closeSocket()
  }, [initSocket, closeSocket, session])

  return (
    <>
      <Alert
        isOpen={retry >= MAX_RETRY_COUNT && !isConnected}
        closeCallback={() => router.back()}
        title="연결 실패"
        message="연결에 실패했습니다."
      />
      <Alert
        isOpen={!!exception}
        closeCallback={clearException}
        title="알림"
        message={exception || ''}
      />
    </>
  )
}

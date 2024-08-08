/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react'

import useWebSocketStore from '#store/client/websocket.store'

interface EventHandlers {
  [event: string]: (...args: any[]) => void | Promise<void>
}

interface UseSocketEventHandlerProps {
  handlers: EventHandlers
  dependencies?: unknown[]
}

const useSocketEventHandler = ({
  handlers,
  dependencies = [],
}: UseSocketEventHandlerProps) => {
  const socket = useWebSocketStore((state) => state.socket)

  useEffect(() => {
    if (socket) {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.on(event, handler)
      })

      return () => {
        Object.entries(handlers).forEach(([event, handler]) => {
          socket.off(event, handler)
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, ...dependencies])
}

export default useSocketEventHandler

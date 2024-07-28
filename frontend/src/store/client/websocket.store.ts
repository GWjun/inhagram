import { Session } from 'next-auth'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

import { WsException } from '#types/common.type'
import { refreshAccessToken } from '#utils/fetchUser'

export const MAX_RETRY_COUNT = 3

interface WebSocketStore {
  socket: Socket | null
  retry: number
  isConnected: boolean
  exception: string | null

  initSocket: (session: Session) => void
  createChat: (toUserName: string) => void
  exitChat: (chatId: string) => void
  writeStartMessage: (chatId: string) => void
  writeStopMessage: (chatId: string) => void
  sendMessage: (chatId: string, message: string) => void
  closeSocket: () => void
  clearException: () => void
}

const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  retry: 0,
  isConnected: false,
  exception: null,

  initSocket: (session: Session) => {
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/chats`, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${session.accessToken}`,
      },
    })

    if (socket) {
      socket.on('connect_error', (error) => {
        console.error('connection error:', error)
      })

      socket.on('exception', (error: WsException) => {
        console.error('websocket error:', error)
        set({ exception: error.message || '채팅 오류가 발생했습니다.' })
      })

      socket.on('setup_complete', () => {
        set({ isConnected: true, retry: 0 })
        socket.emit('enter_chat')
      })

      socket.on('disconnect', async () => {
        const retry = get().retry
        if (retry >= MAX_RETRY_COUNT) {
          console.error('Max retry attempts reached')
          return
        }

        try {
          if (session.refreshToken) {
            session.accessToken = await refreshAccessToken(session.refreshToken)

            set({ retry: retry + 1 })

            get().initSocket(session)
          } else throw new Error('Do not have refreshToken')
        } catch (error) {
          console.error('Failed to refresh access token:', error)
          set({ isConnected: false })
        }
      })

      set({ socket })
    }
  },

  createChat: (toUserName: string) => {
    const { socket } = get()
    if (socket) socket.emit('create_chat', { toUserName })
  },

  exitChat: (chatId: string) => {
    const { socket } = get()
    if (socket) socket.emit('exit_chat', { chatId })
  },

  writeStartMessage: (chatId: string) => {
    const { socket } = get()
    if (socket) socket.emit('write_start', { chatId })
  },

  writeStopMessage: (chatId: string) => {
    const { socket } = get()
    if (socket) socket.emit('write_stop', { chatId })
  },

  sendMessage: (chatId: string, message: string) => {
    const { socket } = get()
    if (socket) socket.emit('send_message', { chatId, message })
  },

  closeSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false })
    }
  },

  clearException: () => {
    set({ exception: null })
  },
}))

export default useWebSocketStore

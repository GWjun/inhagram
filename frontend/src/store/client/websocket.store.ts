import { Session } from 'next-auth'
import { io, Socket } from 'socket.io-client'
import { create } from 'zustand'

interface WebSocketStore {
  socket: Socket | null
  isConnected: boolean
  initSocket: (session: Session) => void
  sendMessage: (chatId: string, message: string) => void
  closeSocket: () => void
}

const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  isConnected: false,

  initSocket: (session: Session) => {
    const socket = io(`${process.env.NEXT_PUBLIC_SERVER_URL}/chats`, {
      transports: ['websocket'],
      auth: {
        token: `Bearer ${session.accessToken}`,
      },
    })

    socket.on('connect_error', (error) => {
      console.error('connection error:', error)
    })

    socket.on('exception', (error) => {
      console.error('websocket error:', error)
    })

    socket.on('setup_complete', () => {
      set({ isConnected: true })
      socket.emit('enter_chat')
    })

    socket.on('disconnect', () => {
      set({ isConnected: false })
      console.log('WebSocket disconnected')
    })

    socket.on('message_received', () => {
      console.log('received!')
    })

    set({ socket })
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
}))

export default useWebSocketStore

import { ReactNode } from 'react'

import ChatLayout from './(chatLayout)/chatLayout'
import SocketClient from './(chatLayout)/socketClient'

export default function DirectLayout(props: { children: ReactNode }) {
  return (
    <div className="flex items-center">
      <SocketClient />
      <ChatLayout />
      <div className="flex w-full h-full justify-center items-center">
        {props.children}
      </div>
    </div>
  )
}

import { SquarePen } from 'lucide-react'

import ChatLists from '#components/feature/chat/chatLists'

import NewChat from '../newChat'

export default function ChatLayout() {
  return (
    <div className="sm:min-w-28 lg:min-w-[397px] h-screen pb-6 pt-10 border-r border-gray-300 z-30">
      <section className="flex justify-center lg:justify-between mb-6 lg:pr-6">
        <h3 className="hidden lg:flex font-bold sm:px-6">메시지</h3>
        <NewChat>
          <SquarePen />
        </NewChat>
      </section>
      <ChatLists />
    </div>
  )
}

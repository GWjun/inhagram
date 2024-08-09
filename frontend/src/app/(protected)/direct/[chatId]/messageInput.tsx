import { useCallback, useEffect, useState } from 'react'

import { Button } from '#components/ui/button'
import { Input } from '#components/ui/input'
import useMessageStore from '#store/client/message.store'
import useWebSocketStore from '#store/client/websocket.store'
import { cn } from '#utils/utils'

export default function MessageInput({ chatId }: { chatId: string }) {
  const { writeStartMessage, writeStopMessage, sendMessage } =
    useWebSocketStore()
  const { myWritten, setMyWritten, messageBuffer, setMessageBuffer } =
    useMessageStore()

  const [content, setContent] = useState('')

  useEffect(() => {
    if (myWritten && !messageBuffer && content.trim() === '') {
      writeStopMessage(chatId)
      setMyWritten(false)
    }

    if (!myWritten && content.trim() !== '') {
      writeStartMessage(chatId)
      setMyWritten(true)
    }
  }, [
    chatId,
    content,
    messageBuffer,
    myWritten,
    writeStartMessage,
    writeStopMessage,
  ])

  const handleSendMessage = useCallback(() => {
    if (content.trim().length === 0) return
    setMessageBuffer([...messageBuffer, content])
    sendMessage(chatId, content.trim())
    setContent('')
  }, [chatId, content, sendMessage])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (
        e.key === 'Enter' &&
        content.trim().length > 0 &&
        !e.nativeEvent.isComposing
      )
        handleSendMessage()
    },
    [content, handleSendMessage],
  )

  return (
    <div className="flex items-center relative mx-5">
      <Input
        className="rounded-2xl"
        placeholder="메시지 입력..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button
        onClick={handleSendMessage}
        variant="ghost"
        className={cn(
          'absolute right-0 text-button hover:bg-transparent hover:text-button',
          content.length <= 0 && 'hidden',
        )}
      >
        보내기
      </Button>
    </div>
  )
}

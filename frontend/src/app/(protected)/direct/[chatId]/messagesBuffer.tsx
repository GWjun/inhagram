'use client'

import { memo } from 'react'

import { SendHorizonal, X } from 'lucide-react'

import { Message } from '#types/chats.type'
import { extractTime } from '#utils/dateFormat'
import { cn } from '#utils/utils'

interface MessagesBufferProps {
  messageBuffer: string[]
  lastMessage: Message | undefined
  otherWritten: boolean
  transmitFailed: boolean
  sessionUserName: string | null | undefined
}

function MessagesBuffer({
  messageBuffer,
  otherWritten,
  transmitFailed,
  sessionUserName,
  lastMessage,
}: MessagesBufferProps) {
  if (!sessionUserName || !lastMessage) return null

  const currentTime = extractTime(new Date().toUTCString())

  const isMine = lastMessage.author.nickname === sessionUserName
  const lastTime = extractTime(lastMessage.createdAt)

  const sameTime = currentTime === lastTime

  return (
    <>
      <div
        className={cn(
          'flex items-end mb-6',
          !otherWritten && 'hidden',
          !isMine && sameTime && '-mt-5',
        )}
      >
        <div className="text-center w-12 py-2 px-3 mx-2 ml-5 rounded-3xl text-sm bg-gray-200 text-black">
          ...
        </div>
      </div>
      <div className="flex-row-reverse">
        {messageBuffer.map((message, index) => (
          <div
            key={index}
            className={cn(
              'flex items-end justify-end mb-1',
              !messageBuffer && 'hidden',
              isMine && sameTime && index === 0 && '-mt-5',
              index === messageBuffer.length - 1 && 'mb-6',
            )}
          >
            <div className="text-xs text-gray-400">
              {transmitFailed ? (
                <X size={12} aria-label="전송 실패" />
              ) : (
                <SendHorizonal
                  size={12}
                  className="rotate-180"
                  aria-label="전송 중"
                />
              )}
            </div>
            <span className="max-w-xs py-2 px-3 mr-5 rounded-3xl text-sm mx-2 bg-button text-white">
              {message}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

export default memo(MessagesBuffer)

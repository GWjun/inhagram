'use client'

import { Fragment, memo } from 'react'

import { InfiniteData } from '@tanstack/react-query'

import { MessagesResponse } from '#types/chats.type'
import { extractDate, extractTime } from '#utils/dateFormat'
import { cn } from '#utils/utils'

interface MessagesComponentProps {
  messages: InfiniteData<MessagesResponse, unknown> | undefined
  hasNextPage: boolean
  sessionUserName: string | null | undefined
}

function MessagesContent({
  messages,
  hasNextPage,
  sessionUserName,
}: MessagesComponentProps) {
  if (!messages || !messages.pages[0].data.length)
    return (
      <div className="col-span-3 text-center text-gray-500 mb-8">
        채팅을 시작해 보세요
      </div>
    )

  let prevTime = ''
  let prevDate = extractDate(new Date().toUTCString())
  let prevUser: boolean | undefined

  return messages.pages.map((page, pageIndex) => (
    <Fragment key={pageIndex}>
      {page.data.map((message) => {
        const isMine = message.author.nickname === sessionUserName
        const content = message.message

        const time = extractTime(message.createdAt)
        const date = extractDate(message.createdAt)

        const sameTime = time === prevTime
        const sameDate = date === prevDate
        const sameUser = isMine === prevUser

        prevTime = time
        const prevTempDate = prevDate
        prevDate = date
        prevUser = isMine

        if (message.notice)
          return (
            <div className="text-center text-sm text-gray-400 py-2">
              <span>{content}</span>
            </div>
          )

        return (
          <Fragment key={message.id}>
            <div
              className={cn(
                'text-center text-sm text-gray-400 py-2',
                sameDate && 'hidden',
              )}
            >
              <span>{prevTempDate}</span>
            </div>

            <div
              className={cn(
                'flex items-end justify-end mb-6',
                !isMine && 'flex-row-reverse',
                sameTime && sameUser && 'mb-1',
              )}
            >
              <div
                className={cn(
                  'text-xs text-gray-400',
                  sameTime && sameUser && 'hidden',
                )}
              >
                {time}
              </div>
              <div
                className={`max-w-xs py-2 px-3 rounded-3xl text-sm mx-2 ${
                  isMine
                    ? 'bg-button text-white mr-5'
                    : 'bg-gray-200 text-black ml-5'
                }`}
              >
                {content}
              </div>
            </div>
          </Fragment>
        )
      })}
      {pageIndex === messages.pages.length - 1 && !hasNextPage && (
        <span className="text-center text-sm text-gray-400 py-2">
          {prevDate}
        </span>
      )}
    </Fragment>
  ))
}

export default memo(MessagesContent)

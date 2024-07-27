import Image from 'next/image'

import NewChat from './newChat'

export default function Direct() {
  return (
    <div className="flex flex-col min-h-full justify-center items-center">
      <Image
        src="/images/assets/message-icon.svg"
        width={100}
        height={100}
        alt="message-icon"
        priority
        decoding="sync"
      />
      <h2 className="text-xl mt-3">내 메시지</h2>
      <div className="text-gray-500 text-sm mt-1 mb-4">
        친구나 그룹에 비공개 사진과 메시지를 보내보세요
      </div>

      <NewChat>
        <div className="inline-flex items-center justify-center h-8 px-3 py-2 bg-button text-primary-foreground hover:bg-button-dark rounded-lg">
          메시지 보내기
        </div>
      </NewChat>
    </div>
  )
}

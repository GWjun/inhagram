import { create } from 'zustand'

interface MessageState {
  messageBuffer: string[]
  myWritten: boolean
  otherWritten: boolean

  setMessageBuffer: (buffer: string[]) => void
  setMyWritten: (written: boolean) => void
  setOtherWritten: (written: boolean) => void
}
const useMessageStore = create<MessageState>()((set) => ({
  messageBuffer: [],
  myWritten: false,
  otherWritten: false,
  setMessageBuffer: (buffer) => set({ messageBuffer: buffer }),
  setMyWritten: (written) => set({ myWritten: written }),
  setOtherWritten: (written) => set({ otherWritten: written }),
}))

export default useMessageStore

import { create } from 'zustand'

interface CommentFooterState {
  textAreaHeight: number
  setTextAreaHeight: (height: number) => void
}

export const useCommentFooterState = create<CommentFooterState>()((set) => ({
  textAreaHeight: 20,
  setTextAreaHeight: (height) => set({ textAreaHeight: height }),
}))

import { create } from 'zustand'

interface SidebarState {
  activeItem: string
  setActiveItem: (item: string) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeItem: '',
  setActiveItem: (item) => set({ activeItem: item }),
}))

interface ShrinkState {
  isShrink: boolean
  setIsShrink: (state: boolean) => void
}
export const useShrinkStore = create<ShrinkState>((set) => ({
  isShrink: false,
  setIsShrink: (state) => set({ isShrink: state }),
}))

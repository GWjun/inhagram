import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface SidebarState {
  activeItem: string
  setActiveItem: (item: string) => void
}

export const useSidebarStore = create<SidebarState>()(
  devtools(
    (set) => ({
      activeItem: '',
      setActiveItem: (item) =>
        set({ activeItem: item }, false, 'sidebar/setActiveItem'),
    }),
    { name: 'sidebar/activeItem' },
  ),
)

interface ShrinkState {
  isShrink: boolean
  setIsShrink: (state: boolean) => void
}
export const useShrinkStore = create<ShrinkState>()(
  devtools(
    (set) => ({
      isShrink: false,
      setIsShrink: (state) =>
        set({ isShrink: state }, false, 'sidebar/setIsShrink'),
    }),
    { name: 'sidebar/isShrink' },
  ),
)

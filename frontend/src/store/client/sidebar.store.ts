import { create } from 'zustand'

interface SidebarState {
  activeItem: string
  setActiveItem: (item: string) => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  activeItem: '',
  setActiveItem: (item) => set({ activeItem: item }),
}))

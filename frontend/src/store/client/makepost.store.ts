import { create } from 'zustand'

// Page Store
export enum Page {
  Image,
  Form,
  Result,
}

interface PageState {
  page: Page
}

interface PageActions {
  setPage: (page: Page) => void
}

export const usePageStore = create<PageState & PageActions>((set) => ({
  page: Page.Image,
  setPage: (page) => set({ page }),
}))

// URL Store
interface UrlState {
  previewUrls: string[]
  imageUrls: string[]
}

interface UrlActions {
  addPreviewUrls: (url: string) => void
  addImageUrls: (url: string) => void
}

export const useUrlStore = create<UrlState & UrlActions>((set) => ({
  previewUrls: [],
  imageUrls: [],
  addPreviewUrls: (url) =>
    set((state) => ({ previewUrls: [...state.previewUrls, url] })),
  addImageUrls: (url) =>
    set((state) => ({ imageUrls: [...state.imageUrls, url] })),
}))

// Form Store
interface FormState {
  title: string
  content: string
}

interface FormActions {
  setTitle: (title: string) => void
  setContent: (content: string) => void
}

export const useFormStore = create<FormState & FormActions>((set) => ({
  title: '',
  content: '',
  setTitle: (title) => set({ title }),
  setContent: (content) => set({ content }),
}))

// Reset Store
export const resetAllStores = () => {
  usePageStore.setState({ page: 0 })
  useUrlStore.setState({ previewUrls: [], imageUrls: [] })
  useFormStore.setState({ title: '', content: '' })
}

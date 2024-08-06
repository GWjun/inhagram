import { createContext, RefObject } from 'react'

interface CustomFormState {
  handleSubmit: () => void
  formRef: RefObject<HTMLFormElement> | null
}

const initialState: CustomFormState = {
  handleSubmit: () => {},
  formRef: null,
}

export const FormRefContext = createContext(initialState)

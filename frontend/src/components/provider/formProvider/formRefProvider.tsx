import { ReactNode, useContext, useRef } from 'react'

import { FormRefContext } from '#components/provider/formProvider/formRefContext'

export function FormRefProvider({ children }: { children: ReactNode }) {
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = () => {
    if (formRef.current)
      formRef.current.dispatchEvent(
        new Event('submit', { cancelable: true, bubbles: true }),
      )
  }

  return (
    <FormRefContext.Provider value={{ handleSubmit, formRef }}>
      {children}
    </FormRefContext.Provider>
  )
}

export const useFormRefContext = () => useContext(FormRefContext)

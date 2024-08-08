import { useContext } from 'react'

import { FormRefContext } from '#components/provider/formRefProvider/formRefContext'

export default function useFormRefContext() {
  return useContext(FormRefContext)
}

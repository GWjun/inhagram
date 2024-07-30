import { ReactNode } from 'react'

import ActiveLayout from './activeLayout'

export default function ProtectedLayout(props: {
  children: ReactNode
  modal: ReactNode
}) {
  return (
    <div className="flex">
      <ActiveLayout />
      <main className="flex flex-col grow">
        {props.children}
        {props.modal}
        <div id="modal-root" />
      </main>
    </div>
  )
}

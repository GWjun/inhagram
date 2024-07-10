'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from 'components/ui/toast'
import { useToast } from 'components/ui/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  function handleClose() {
    const count = parseInt(localStorage.getItem('pwa-close') || '0')
    localStorage.setItem('pwa-close', JSON.stringify(count + 1))
  }

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={handleClose} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}

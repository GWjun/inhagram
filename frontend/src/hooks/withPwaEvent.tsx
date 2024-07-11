'use client'

import { ComponentType, useEffect } from 'react'

import { ToastAction } from '#components/ui/toast'
import { toast } from '#components/ui/use-toast'

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

function withPwaEvent(WrappedComponent: ComponentType) {
  function WithPwaEvent() {
    useEffect(() => {
      function handleBeforeInstallPrompt(e: BeforeInstallPromptEvent) {
        e.preventDefault()
        toast({
          title: '앱 설치가 준비되었습니다!',
          description: '설치하여 더욱 편리하게 이용해보세요.',
          action: (
            <ToastAction onClick={() => e.prompt()} altText="install">
              설치하기
            </ToastAction>
          ),
          className: 'rounded-2xl',
        })
      }

      const count = parseInt(localStorage.getItem('pwa-close') || '0')
      if (count < 3)
        window.addEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt as EventListener,
        )

      return () =>
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt as EventListener,
        )
    }, [])

    return <WrappedComponent />
  }

  WithPwaEvent.displayName = `WithPwaEvent(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithPwaEvent
}

export default withPwaEvent

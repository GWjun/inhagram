'use client'

import { redirect } from 'next/navigation'

import { useEffect, ComponentType } from 'react'

import { useAuthStore } from '#store/client/auth.store'

function withAuth<T extends object>(WrappedComponent: ComponentType<T>) {
  const WithAuthComponent = (props: T) => {
    const { isAuthenticated } = useAuthStore()

    useEffect(() => {
      if (!isAuthenticated) redirect('/login')
    }, [isAuthenticated])

    if (!isAuthenticated) return null

    return <WrappedComponent {...props} />
  }

  WithAuthComponent.displayName = `WithAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`

  return WithAuthComponent
}

export default withAuth

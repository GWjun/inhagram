'use client'

import Image from 'next/image'

import { useEffect } from 'react'

import { useMutationState } from '@tanstack/react-query'

import Link from '#components/feature/common/link'
import { Card, CardContent, CardFooter, CardHeader } from '#components/ui/card'
import withPwaEvent from '#hooks/withPwaEvent'
import { getTokenMutationKey } from '#store/server/auth.queries'

import LoginForm from './loginForm'

function LoginCard() {
  const status = useMutationState({
    filters: { mutationKey: getTokenMutationKey },
    select: (mutation) => mutation.state.status,
  })

  useEffect(() => {
    if (status[0] === 'success') window.location.reload()
  }, [status])

  return (
    <div className="flex flex-col justify-center items-center">
      <Card className="w-[350px] p-4 mb-3">
        <CardHeader className="items-center">
          <Image
            src="/images/static/text-icon.svg"
            width={150}
            height={150}
            alt="instagram text logo"
          />
        </CardHeader>

        <LoginForm />

        <CardContent className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </CardContent>

        <CardFooter className="justify-center flex-col">
          <button className="text-button bg-transparent">
            <p className="text-sm font-semibold">Google로 로그인</p>
          </button>
          {status[0] === 'error' && (
            <p className="text-sm text-destructive mt-3">
              잘못된 비밀번호입니다. 다시 확인하세요.
            </p>
          )}
        </CardFooter>
      </Card>

      <Card className="w-[350px] p-4">
        <CardContent className="flex justify-center p-2">
          <p className="text-sm">계정이 없으신가요?</p>
          <Link
            href="/signup"
            className="px-2 text-button text-sm font-semibold"
          >
            가입하기
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default withPwaEvent(LoginCard)

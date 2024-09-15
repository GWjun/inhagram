'use client'

import Image from 'next/image'

import { useEffect } from 'react'

import { useMutationState } from '@tanstack/react-query'

import Link from '#components/feature/common/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '#components/ui/card'
import { getTokenMutationKey } from '#store/server/auth.queries'

import SignUpError from './signUpError'
import SignUpForm from './signUpForm'

export default function SignUp() {
  const state = useMutationState({
    filters: { mutationKey: getTokenMutationKey },
    select: (mutation) => mutation.state,
  })

  useEffect(() => {
    if (state[0]?.status === 'success') window.location.reload()
  }, [state])

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-[350px] p-4 mb-3">
        <CardHeader className="items-center">
          <Image
            src="/images/static/text-icon.svg"
            width={150}
            height={150}
            alt="instagram text logo"
          />
        </CardHeader>

        <CardDescription className="text-center font-semibold text-md mb-8">
          친구들의 사진과 동영상을 보려면 가입하세요.
        </CardDescription>

        <SignUpForm />

        <CardContent className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </CardContent>

        <CardFooter className="justify-center flex-col">
          <button className="text-button bg-transparent">
            <p className="text-sm font-semibold">Google로 로그인</p>
          </button>
          <SignUpError error={state[0]?.error} />
        </CardFooter>
      </Card>

      <Card className="w-[350px] p-4">
        <CardContent className="flex justify-center p-2">
          <p className="text-sm">계정이 있으신가요?</p>
          <Link href="login" className="px-2 text-button text-sm font-semibold">
            로그인
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

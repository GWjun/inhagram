'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useEffect } from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from '#components/ui/card'
import { useGetTokenQuery } from '#store/server/auth.queries'

import SignUpForm from './signUpForm'

export default function SignUp() {
  const { mutate, isSuccess, isPending, error } = useGetTokenQuery()

  useEffect(() => {
    if (isSuccess) window.location.reload()
  }, [isSuccess])

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

        <SignUpForm mutate={mutate} isPending={isPending} />

        <CardContent className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </CardContent>

        <CardFooter className="justify-center flex-col">
          <button className="text-button bg-transparent">
            <p className="text-sm font-semibold">Google로 로그인</p>
          </button>
          {error && (
            <p className="text-sm text-destructive mt-3">
              {error.message === 'Already exist nickname' &&
                '이미 존재하는 닉네임입니다.'}
              {error.message === 'email must be an email' &&
                '올바른 이메일 형식이어야 합니다.'}
              {!['Already exist nickname', 'email must be an email'].includes(
                error.message,
              ) && '현재 가입할 수 없습니다.'}
            </p>
          )}
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

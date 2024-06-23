'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useEffect, useState } from 'react'

import { Loader2 } from 'lucide-react'

import { Button } from '#components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#components/ui/card'
import { Input } from '#components/ui/input'
import { useGetTokenQuery } from '#store/server/auth.queries'

export default function LogIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isFormValid, setIsFormValid] = useState(false)

  const { mutate, isSuccess, isPending, isError } = useGetTokenQuery()

  useEffect(() => {
    setIsFormValid(email.length > 0 && password.length >= 4)
  }, [email, password])

  useEffect(() => {
    if (isSuccess) window.location.reload()
  }, [isSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutate({ email, password, type: 'login' })
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Card className="w-[350px] p-4 mb-3">
        <CardHeader className="items-center">
          <Image
            src="/images/text-icon.svg"
            width={150}
            height={150}
            alt="instagram"
          />
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-1.5">
            <Input
              className="bg-primary-foreground"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="bg-primary-foreground"
              placeholder="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CardContent>
          <CardContent>
            <Button type="submit" className="w-full" disabled={!isFormValid}>
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '로그인'
              )}
            </Button>
          </CardContent>
        </form>
        <CardContent className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </CardContent>
        <CardFooter className="justify-center flex-col">
          <button className="text-button bg-transparent">
            <p className="text-sm font-semibold">Google로 로그인</p>
          </button>
          {isError && (
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
            href="signup"
            className="px-2 text-button text-sm font-semibold"
          >
            가입하기
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

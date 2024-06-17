'use client'

import Image from 'next/image'
import Link from 'next/link'

import { FormEvent, useState } from 'react'

import { Button } from '#components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#components/ui/card'
import { Input } from '#components/ui/input'

export default function Page() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })

    if (res.ok) {
      const data = await res.json()
    } else {
    }
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
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
            <Button
              type="submit"
              className="w-full bg-button-light hover:bg-tranparent"
            >
              로그인
            </Button>
          </CardContent>
        </form>
        <CardContent className="flex items-center">
          <div className="flex-grow border-t border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">또는</span>
          <div className="flex-grow border-t border-gray-300" />
        </CardContent>
        <CardFooter className="justify-center">
          <button className="text-button bg-transparent">
            <p className="text-sm font-semibold">Google로 로그인</p>
          </button>
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

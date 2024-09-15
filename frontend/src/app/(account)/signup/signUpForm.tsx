import { useForm } from 'react-hook-form'

import LoadingSpinner from '#components/animation/loadingSpinner'
import { Button } from '#components/ui/button'
import { CardContent } from '#components/ui/card'
import { Input } from '#components/ui/input'
import { useGetTokenQuery } from '#store/server/auth.queries'

import { emailOption, nicknameOption, passwordOption } from '../inputOptions'

interface SignUpFormData {
  nickname: string
  email: string
  password: string
}

export default function SignUpForm() {
  const { mutate, isPending } = useGetTokenQuery()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<SignUpFormData>()

  function onSubmit(data: SignUpFormData) {
    mutate?.({ ...data, type: 'register' })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CardContent className="space-y-1.5">
        <Input
          className="bg-primary-foreground"
          placeholder="닉네임"
          {...register('nickname', nicknameOption)}
        />
        <Input
          className="bg-primary-foreground"
          placeholder="이메일"
          {...register('email', emailOption)}
        />
        <Input
          className="bg-primary-foreground"
          placeholder="비밀번호"
          type="password"
          {...register('password', passwordOption)}
        />
      </CardContent>
      <CardContent>
        <Button type="submit" className="w-full" disabled={!isValid}>
          {isPending ? <LoadingSpinner /> : '가입'}
        </Button>
      </CardContent>
    </form>
  )
}
